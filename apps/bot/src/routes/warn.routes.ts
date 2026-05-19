// bot/src/routes/warn.routes.ts

import { Router } from 'express';
import { z } from 'zod';

import { warnPlayer } from '../services/squad.service';

const router = Router();

const schema = z.object({
    steamId: z.string().min(1),
    message: z.string().min(1).max(180),
});

router.post('/', async (req, res, next) => {
    try {
        const input = schema.parse(req.body);

        const result = await warnPlayer(input.steamId, input.message);

        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default router;
