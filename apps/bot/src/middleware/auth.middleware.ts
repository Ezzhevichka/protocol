import type { NextFunction, Request, Response } from 'express';

import { env } from '../config';

export function botAuth(req: Request, res: Response, next: NextFunction) {
    const expected = `Bearer ${env.botToken}`;

    if (req.headers.authorization !== expected) {
        return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    next();
}
