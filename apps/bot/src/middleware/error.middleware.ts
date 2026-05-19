import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export function errorMiddleware(error: unknown, _req: Request, res: Response, next: NextFunction) {
    console.error('errorMiddleware', error);

    if (error instanceof z.ZodError) {
        return res.status(400).json({
            error: 'VALIDATION_ERROR',
            details: error.flatten(),
        });
    }

    if (error instanceof Error && error.name === 'ADMIN_BAN_DISABLED') {
        return res.status(400).json({
            error: 'ADMIN_BAN_DISABLED',
            message: 'Use database bans plus AdminKick enforcement.',
        });
    }

    res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
    });

    next();
}
