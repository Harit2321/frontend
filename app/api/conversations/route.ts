import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import prisma from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { createConversationSchema } from '@/lib/validations';
import {
    successResponse,
    errorResponse,
    unauthorizedResponse,
    handleValidationError,
} from '@/lib/api-response';

/**
 * GET /api/conversations
 * Get all conversations for the authenticated user
 */
export async function GET(request: NextRequest) {
    try {
        const user = getUserFromRequest(request);

        if (!user) {
            return unauthorizedResponse();
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const conversations = await prisma.conversation.findMany({
            where: {
                userId: user.userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
            skip: offset,
            select: {
                id: true,
                summary: true,
                createdAt: true,
                metadata: true,
            },
        });

        const total = await prisma.conversation.count({
            where: {
                userId: user.userId,
            },
        });

        return successResponse({
            conversations,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total,
            },
        });
    } catch (error) {
        return errorResponse('Failed to fetch conversations', null, 500);
    }
}

/**
 * POST /api/conversations
 * Create a new conversation record
 */
export async function POST(request: NextRequest) {
    try {
        const user = getUserFromRequest(request);

        // Note: Conversations can be created without authentication (for anonymous users)
        // But if a user is authenticated, link it to their account

        const body = await request.json();

        // Validate input
        const validatedData = createConversationSchema.parse(body);

        // Create conversation
        const conversation = await prisma.conversation.create({
            data: {
                userId: user?.userId || null,
                transcript: validatedData.transcript,
                summary: validatedData.summary,
                metadata: validatedData.metadata,
            },
        });

        return successResponse(conversation, 'Conversation saved successfully', 201);
    } catch (error) {
        if (error instanceof ZodError) {
            return handleValidationError(error);
        }

        return errorResponse('Failed to save conversation', null, 500);
    }
}
