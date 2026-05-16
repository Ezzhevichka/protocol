import { BanStatus, BanTargetType } from "@squad-admin/database";
import { z } from "zod";

export const banTargetSchema = z.object({
  targetType: z.nativeEnum(BanTargetType),
  targetValue: z.string().min(1),
});

export const playerSnapshotSchema = z.object({
  steamId: z.string().optional().nullable(),
  eosId: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
}).optional();

export const createBanSchema = z.object({
  targetType: z.nativeEnum(BanTargetType).optional(),
  targetValue: z.string().min(1).optional(),
  targets: z.array(banTargetSchema).optional(),
  reason: z.string().min(1),
  expiresAt: z.string().datetime().optional().nullable(),
  createdById: z.string().optional().nullable(),
  createdByName: z.string().optional().nullable(),
  playerSnapshot: playerSnapshotSchema,
}).refine((value) => Boolean(value.targets?.length || (value.targetType && value.targetValue)), {
  message: "Нужно указать targets или targetType + targetValue",
});

export const revokeBanSchema = z.object({
  revokedById: z.string().optional().nullable(),
  revokedByName: z.string().optional().nullable(),
  revokeReason: z.string().optional().nullable(),
});

export const listBansQuerySchema = z.object({
  status: z.nativeEnum(BanStatus).optional(),
});

export type CreateBanInput = z.infer<typeof createBanSchema>;
export type RevokeBanInput = z.infer<typeof revokeBanSchema>;
