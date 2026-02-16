import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import {
    successResponse,
    errorResponse,
    unauthorizedResponse,
} from '@/lib/api-response';

/**
 * GET /api/projects/[projectId]
 * Get a single project by ID for the current user
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        const user = getUserFromRequest(request);

        if (!user) {
            return unauthorizedResponse();
        }

        // Await the params Promise to get the projectId
        const { projectId } = await params;

        const project = await (prisma as any).project.findFirst({
            where: {
                id: projectId,
                userId: user.userId,
            },
            include: {
                services: true,
            },
        });

        if (!project) {
            return errorResponse('Project not found', null, 404);
        }

        return successResponse(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        return errorResponse('Failed to fetch project', null, 500);
    }
}
