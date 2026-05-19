import { z } from 'zod';

export const kickSchema = z.object({
    steamId: z.string().regex(/^7656119\d{10}$/),
    reason: z.string().min(1).max(180),
});

export const commandSchema = z.object({
    command: z.string().min(1).max(300),
});
