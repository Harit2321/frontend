import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import prisma from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { createProjectSchema } from '@/lib/validations';
import {
    successResponse,
    errorResponse,
    unauthorizedResponse,
    handleValidationError,
    handleDatabaseError,
} from '@/lib/api-response';

/**
 * GET /api/projects
 * Get all projects for the current user
 */
export async function GET(request: NextRequest) {
    try {
        const user = getUserFromRequest(request);

        if (!user) {
            return unauthorizedResponse();
        }

        const projects = await (prisma as any).project.findMany({
            where: {
                userId: user.userId,
            },
            include: {
                services: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return successResponse(projects);
    } catch (error) {
        return errorResponse('Failed to fetch projects', null, 500);
    }
}

/**
 * POST /api/projects
 * Create a new project with its services
 */
export async function POST(request: NextRequest) {
    try {
        const user = getUserFromRequest(request);

        if (!user) {
            return unauthorizedResponse();
        }

        const body = await request.json();

        // Validate input
        const validatedData = createProjectSchema.parse(body);

        // Create project and services in a transaction
        const project = await prisma.$transaction(async (tx: any) => {
            const newProject = await tx.project.create({
                data: {
                    userId: user.userId,
                    agentName: validatedData.agentName,
                    language: validatedData.language,
                    greeting: validatedData.greeting,
                    voiceId: validatedData.voiceId,
                    businessName: validatedData.businessName,
                    industry: validatedData.industry,
                    phone: validatedData.phone,
                    website: validatedData.website,
                    schedule: validatedData.schedule as any, // Json type
                },
            }); 

            // Create services associated with this project
            if (validatedData.services && validatedData.services.length > 0) {
                await Promise.all(
                    validatedData.services.map((service) =>
                        tx.service.create({
                            data: {
                                name: service.name,
                                duration: typeof service.duration === 'string' ? parseInt(service.duration) : service.duration,
                                price: service.price ? (typeof service.price === 'string' ? parseFloat(service.price) : service.price) : null,
                                projectId: newProject.id,
                            },
                        })
                    )
                );
            }

            return tx.project.findUnique({
                where: { id: newProject.id },
                include: { services: true },
            });
        });

        return successResponse(project, 'Project created successfully', 201);
    } catch (error: any) {
        if (error instanceof ZodError) {
            return handleValidationError(error);
        }

        console.error('Project creation error details:', {
            message: error.message,
            code: error.code,
            meta: error.meta,
            stack: error.stack
        });
        return handleDatabaseError(error);
    }
}
