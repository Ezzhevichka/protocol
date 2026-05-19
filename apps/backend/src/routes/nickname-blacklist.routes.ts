import { Router } from 'express';

import {
    addNicknameBlacklistController,
    listNicknameBlacklistController,
    removeNicknameBlacklistController,
} from '../controllers/nickname-blacklist.controller';
import { validateBody } from '../middleware/validate.middleware';
import { createNicknameBlacklistSchema } from '../schemas/nickname-blacklist.schema';

const router = Router();
router.get('/', listNicknameBlacklistController);
router.post('/', validateBody(createNicknameBlacklistSchema), addNicknameBlacklistController);
router.delete('/:id', removeNicknameBlacklistController);
export default router;
