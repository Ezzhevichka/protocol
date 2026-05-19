import { Router } from 'express';

import { listPlayers } from '../services/squad.service';

const router = Router();

router.get('/', async (_req, res, next) => {
    try {
        const result = await listPlayers();
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default router;
