import { Router } from 'express';

import { getServerInfo } from '../services/squad.service';

const router = Router();

router.get('/', async (_req, res, next) => {
    try {
        console.log('[GET /server] requested');

        const server = await getServerInfo();

        console.log('[GET /server] result:', server);

        res.json({
            server,
        });
    } catch (error) {
        console.error('[GET /server] failed:', error);
        next(error);
    }
});

export default router;
