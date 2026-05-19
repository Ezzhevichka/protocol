import { prisma } from '@squad-admin/database';

import { warnPlayerOnBot } from './bot.service';
import { upsertPlayerIdentity } from './player-identity.service';
import { getSquadServer } from '../config/servers';

export async function listWarns(query?: string) {
    const q = query?.trim();
    return prisma.punishment.findMany({
        where: {
            type: 'WARN',
            ...(q
                ? {
                    OR: [
                        { steamId: { contains: q } },
                        { eosId: { contains: q } },
                        { nickname: { contains: q, mode: 'insensitive' } },
                        { reason: { contains: q, mode: 'insensitive' } },
                    ],
                }
                : {}),
        },
        include: { player: true },
        orderBy: { createdAt: 'desc' },
    });
}

export async function createWarn(input: {
    serverId: number;
    steamId?: string;
    eosId?: string | null;
    nickname?: string | null;
    reason: string;
    createdById?: string | null;
    createdByName?: string | null;
}) {
    let playerId: string | null = null;
    if (input.steamId) {
        const player = await upsertPlayerIdentity({
            steamId: input.steamId,
            eosId: input.eosId,
            name: input.nickname,
        });
        playerId = player.id;
    }

    const punishment = await prisma.punishment.create({
        data: {
            type: 'WARN',
            playerId,
            steamId: input.steamId ?? null,
            eosId: input.eosId ?? null,
            nickname: input.nickname ?? null,
            reason: input.reason,
            createdById: input.createdById ?? null,
            createdByName: input.createdByName ?? null,
        },
    });

    let delivery: {
        ok: boolean;
        error?: string;
        result?: unknown;
    } | null = null;

    if (input.steamId) {
        const server = getSquadServer(input.serverId);

        if (!server) {
            delivery = {
                ok: false,
                error: 'SERVER_NOT_FOUND',
            };
        } else {
            try {
                const message = `WARN: ${input.reason}`;

                const result = await warnPlayerOnBot(server, input.steamId, message);

                delivery = {
                    ok: true,
                    result,
                };
            } catch (error) {
                delivery = {
                    ok: false,
                    error: error instanceof Error ? error.message : 'WARN_DELIVERY_FAILED',
                };
            }
        }
    }

    return {
        punishment,
        delivery,
    };
}
