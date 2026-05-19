import { z } from 'zod';

export const createNicknameBlacklistSchema = z.object({
    nickname: z.string().min(1),
});
