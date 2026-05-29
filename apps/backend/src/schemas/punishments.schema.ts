import { z } from 'zod';

export const createWarnSchema = z
  .object({
    steamId: z.string().optional(),
    eosId: z.string().optional().nullable(),
    nickname: z.string().optional().nullable(),
    reason: z.string().min(1),
    serverId: z.coerce.number(),
    createdById: z.string().optional().nullable(),
    createdByName: z.string().optional().nullable(),
  })
  .refine((value) => Boolean(value.steamId || value.eosId || value.nickname), {
    message: 'Нужен steamId, eosId или nickname',
  });

export type CreateWarnInput = z.infer<typeof createWarnSchema>;
