import { BanTargetType, type Ban } from '@squad-admin/database';
import { prisma } from '@squad-admin/database';

import { kickPlayerOnBot, listPlayersFromBot } from './bot.service';
import { isNicknameBlacklisted } from './nickname-blacklist.service';
import { upsertPlayerIdentity } from './player-identity.service';
import { squadServers } from '../config/servers';
import type { CreateBanInput, RevokeBanInput } from '../schemas/bans.schema';
import { activeBanWhere, banMatchesPlayer } from '../utils/ban';
import { normalizeBanTarget, normalizeEosId, normalizeSteamId } from '../utils/normalize';

function getTargets(input: CreateBanInput) {
    if (input.targets?.length) return input.targets;
    return [{ targetType: input.targetType!, targetValue: input.targetValue! }];
}

async function enrichBans(bans: Ban[]) {
    const steamIds = bans
        .filter((ban) => ban.targetType === 'STEAM_ID')
        .map((ban) => ban.normalizedTargetValue);
    const eosIds = bans
        .filter((ban) => ban.targetType === 'EOS_ID')
        .map((ban) => ban.normalizedTargetValue);

    const identities = await prisma.player.findMany({
        where: {
            OR: [
                steamIds.length ? { steamId: { in: steamIds } } : undefined,
                eosIds.length ? { eosId: { in: eosIds } } : undefined,
            ].filter(Boolean) as any,
        },
        include: { names: { orderBy: { lastSeenAt: 'desc' }, take: 10 }, externalProfile: true },
    });

    const bySteamId = new Map(identities.filter((p) => p.steamId).map((p) => [p.steamId, p]));
    const byEosId = new Map(identities.filter((p) => p.eosId).map((p) => [p.eosId!, p]));

    return bans.map((ban) => ({
        ...ban,
        player:
      ban.targetType === 'STEAM_ID'
          ? (bySteamId.get(ban.normalizedTargetValue) ?? null)
          : (byEosId.get(ban.normalizedTargetValue) ?? null),
    }));
}

export async function listBans(status?: string) {
    const bans = await prisma.ban.findMany({
        where: status ? { status: status as never } : undefined,
        orderBy: { createdAt: 'desc' },
    });
    return enrichBans(bans);
}

export async function getBanStatus(input: { steamId?: string; eosId?: string; nickname?: string }) {
    const or = [];

    if (input.steamId) {
        or.push({
            targetType: BanTargetType.STEAM_ID,
            normalizedTargetValue: normalizeSteamId(input.steamId),
        });
    }

    if (input.eosId) {
        or.push({
            targetType: BanTargetType.EOS_ID,
            normalizedTargetValue: normalizeEosId(input.eosId),
        });
    }

    const activeBan = or.length
        ? await prisma.ban.findFirst({
            where: { ...activeBanWhere(), OR: or },
            orderBy: { createdAt: 'desc' },
        })
        : null;

    const nicknameBlacklisted = await isNicknameBlacklisted(input.nickname);

    return {
        isBanned: Boolean(activeBan) || nicknameBlacklisted,
        activeBan,
        nicknameBlacklisted,
    };
}

export async function getBanStatusBySteamId(steamIdRaw: string) {
    const steamId = normalizeSteamId(steamIdRaw);
    const result = await getBanStatus({ steamId });
    return { steamId, ...result };
}

export async function createBan(input: CreateBanInput) {
    if (input.playerSnapshot?.steamId) {
        await upsertPlayerIdentity({
            steamId: input.playerSnapshot.steamId,
            eosId: input.playerSnapshot.eosId ?? null,
            name: input.playerSnapshot.name ?? null,
        });
    }

    const targets = getTargets(input);
    const createdBans: Ban[] = [];

    for (const target of targets) {
        const normalizedTargetValue = normalizeBanTarget(target.targetType, target.targetValue);

        const ban = await prisma.ban.create({
            data: {
                targetType: target.targetType,
                targetValue: target.targetValue,
                normalizedTargetValue,
                targetNameSnapshot: input.playerSnapshot?.name ?? null,
                reason: input.reason,
                expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
                createdById: input.createdById ?? null,
                createdByName: input.createdByName ?? null,
            },
        });

        createdBans.push(ban);
    }

    const kickResults = await Promise.allSettled(
        squadServers.map(async (server) => {
            const { players } = await listPlayersFromBot(server);
            const matched = players.filter((player) =>
                createdBans.some((ban) => banMatchesPlayer(ban, player))
            );

            for (const player of matched) {
                await kickPlayerOnBot(server, player.steamId, input.reason);
            }

            return {
                serverId: server.id,
                matched: matched.length,
                kickedSteamIds: matched.map((player) => player.steamId),
            };
        })
    );

    return {
        ban: createdBans[0],
        bans: createdBans,
        kickResults: kickResults.map((result, index) => {
            const server = squadServers[index];
            if (result.status === 'fulfilled') return result.value;
            return {
                serverId: server.id,
                matched: 0,
                kickedSteamIds: [],
                error: result.reason instanceof Error ? result.reason.message : String(result.reason),
            };
        }),
    };
}

export async function revokeBan(banId: string, input: RevokeBanInput) {
    return prisma.ban.update({
        where: { id: banId },
        data: {
            status: 'REVOKED',
            revokedAt: new Date(),
            revokedById: input.revokedById ?? null,
            revokedByName: input.revokedByName ?? null,
            revokeReason: input.revokeReason ?? null,
        },
    });
}
