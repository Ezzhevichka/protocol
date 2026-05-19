import type { NextFunction, Request, Response } from 'express';

import { listActiveServersInfo } from '../services/servers.service';

export async function listServers(_req: Request, res: Response, next: NextFunction) {
    try {
        const servers = await listActiveServersInfo();

        res.json({ servers });
    } catch (error) {
        next(error);
    }
}
