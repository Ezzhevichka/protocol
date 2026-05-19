import { z } from 'zod';

export const privilegeGroupSchema = z.object({
    key: z.string().min(1),
    label: z.string().min(1),
    color: z.string().min(1),
    permissions: z.array(z.string()).default([]),
});

export const updatePrivilegeGroupSchema = z.object({
    key: z.string().min(1).optional(),
    label: z.string().min(1).optional(),
    color: z.string().min(1).optional(),
    permissions: z.array(z.string()).optional(),
});

export const createPrivilegeSchema = z
    .object({
        steamId: z.string().optional(),
        eosId: z.string().optional(),
        nickname: z.string().optional(),

        groupKey: z.string().min(1),
        comment: z.string().optional().nullable(),
        prefix: z.string().optional().nullable(),
        prefixColor: z.string().optional().nullable(),
        imageUrl: z.string().optional().nullable(),
    })
    .refine((value) => Boolean(value.steamId || value.eosId || value.nickname), {
        message: 'steamId, eosId or nickname is required',
    });

export const updatePrivilegeSchema = z.object({
    steamId: z.string().optional(),
    eosId: z.string().optional(),
    nickname: z.string().optional(),

    groupKey: z.string().min(1).optional(),
    comment: z.string().optional().nullable(),
    prefix: z.string().optional().nullable(),
    prefixColor: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
});

export type PrivilegeGroupInput = z.infer<typeof privilegeGroupSchema>;
export type UpdatePrivilegeGroupInput = z.infer<typeof updatePrivilegeGroupSchema>;

export type CreatePrivilegeInput = z.infer<typeof createPrivilegeSchema>;
export type UpdatePrivilegeInput = z.infer<typeof updatePrivilegeSchema>;
