// backend/src/routes/remote-bot.routes.ts

import { Router } from 'express';

import { restartRemoteBotController } from '../controllers/remote-bot.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/restart', requireAuth, restartRemoteBotController);

export default router;
