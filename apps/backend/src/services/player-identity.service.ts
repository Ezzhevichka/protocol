import { prisma } from '@squad-admin/database';

function clean(value?: string | null) {
    const next = value?.trim();
    return next ? next : null;
}

export async function upsertPlayerIdentity(input: {
    steamId: string;
    eosId?: string | null;
    name?: string | null;
    serverId?: number | null;
}) {
    const steamId = clean(input.steamId);
    if (!steamId) throw new Error('STEAM_ID_REQUIRED');

    const eosId = clean(input.eosId);
    const name = clean(input.name);

    const player = await prisma.player.upsert({
        where: { steamId },
        create: {
            steamId,
            eosId,
            lastName: name,
            lastSeenAt: new Date(),
            lastSeenServerId: input.serverId ?? null,
        },
        update: {
            eosId: eosId ?? undefined,
            lastName: name ?? undefined,
            lastSeenAt: new Date(),
            lastSeenServerId: input.serverId ?? undefined,
        },
    });

    if (name) {
        const existingName = await prisma.playerName.findUnique({
            where: { playerId_nickname: { playerId: player.id, nickname: name } },
        });

        if (existingName) {
            await prisma.playerName.update({
                where: { id: existingName.id },
                data: { lastSeenAt: new Date(), timesSeen: { increment: 1 } },
            });
        } else {
            await prisma.playerName.create({ data: { playerId: player.id, nickname: name } });
        }
    }

    return player;
}

export async function syncPlayerIdentities(players: any[], serverId?: number) {
    await Promise.allSettled(
        players.map((player) =>
            upsertPlayerIdentity({
                steamId: player.steamId,
                eosId: player.eosId ?? player.raw?.eosID ?? null,
                name: player.name ?? player.raw?.name ?? null,
                serverId,
            })
        )
    );
}

export async function openPlayerSession(input: {
    serverId: number;
    steamId: string;
    eosId?: string | null;
    name?: string | null;
    raw?: string | null;
}) {
    const player = await upsertPlayerIdentity(input);

    await prisma.playerSession.updateMany({
        where: { playerId: player.id, serverId: input.serverId, status: 'ONLINE' },
        data: { status: 'STALE', disconnectedAt: new Date() },
    });

    const session = await prisma.playerSession.create({
        data: {
            playerId: player.id,
            serverId: input.serverId,
            lastKnownName: input.name ?? null,
            lastKnownEosId: input.eosId ?? null,
            connectRaw: input.raw ?? null,
        },
    });

    return { player, session };
}

export async function closePlayerSession(input: {
    serverId: number;
    steamId: string;
    raw?: string | null;
}) {
    const player = await prisma.player.findUnique({ where: { steamId: input.steamId } });
    if (!player) return null;

    const session = await prisma.playerSession.findFirst({
        where: { playerId: player.id, serverId: input.serverId, status: 'ONLINE' },
        orderBy: { connectedAt: 'desc' },
    });

    if (!session) return null;

    return prisma.playerSession.update({
        where: { id: session.id },
        data: { status: 'CLOSED', disconnectedAt: new Date(), disconnectRaw: input.raw ?? null },
    });
}

export async function listKnownPlayers(query?: string) {
    const q = query?.trim();

    return prisma.player.findMany({
        where: q
            ? {
                OR: [
                    { steamId: { contains: q } },
                    { eosId: { contains: q } },
                    { lastName: { contains: q, mode: 'insensitive' } },
                    { names: { some: { nickname: { contains: q, mode: 'insensitive' } } } },
                ],
            }
            : undefined,
        include: {
            names: { orderBy: { lastSeenAt: 'desc' }, take: 20 },
            sessions: { orderBy: { connectedAt: 'desc' }, take: 5 },
            externalProfile: true,
            punishments: { orderBy: { createdAt: 'desc' }, take: 10 },
        },
        orderBy: { lastSeenAt: 'desc' },
        take: 300,
    });
}

export async function getPlayerProfileBySteamId(steamId: string) {
    return prisma.player.findUnique({
        where: { steamId },
        include: {
            names: { orderBy: { lastSeenAt: 'desc' } },
            sessions: { orderBy: { connectedAt: 'desc' }, take: 50 },
            externalProfile: true,
            punishments: { orderBy: { createdAt: 'desc' } },
        },
    });
}
