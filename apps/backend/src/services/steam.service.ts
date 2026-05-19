import { prisma } from '@squad-admin/database';

import { upsertPlayerIdentity } from './player-identity.service';

const SQUAD_APP_ID = 393380;
const REFRESH_MS = 1000 * 60 * 60 * 24;

function toDate(unix?: number | null) {
    return unix ? new Date(unix * 1000) : null;
}

export async function refreshSteamProfile(steamId: string) {
    const key = process.env.STEAM_API_KEY;
    if (!key) throw new Error('STEAM_API_KEY is required');

    const cached = await prisma.playerExternalProfile.findUnique({ where: { steamId } });
    if (cached && Date.now() - cached.lastFetchedAt.getTime() < REFRESH_MS) return cached;

    const [summaryResponse, gamesResponse] = await Promise.all([
        fetch(
            `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${key}&steamids=${steamId}`
        ),
        fetch(
            `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${key}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`
        ),
    ]);

    const summaryJson = await summaryResponse.json().catch(() => null);
    const gamesJson = await gamesResponse.json().catch(() => null);

    const steamPlayer = summaryJson?.response?.players?.[0] ?? null;
    const games = gamesJson?.response?.games ?? [];
    const squad = games.find((game: any) => Number(game.appid) === SQUAD_APP_ID);
    const totalPlaytimeMin = Array.isArray(games)
        ? games.reduce((sum: number, game: any) => sum + Number(game.playtime_forever ?? 0), 0)
        : null;

    const player = await upsertPlayerIdentity({
        steamId,
        name: steamPlayer?.personaname ?? undefined,
    });

    return prisma.playerExternalProfile.upsert({
        where: { steamId },
        create: {
            playerId: player.id,
            steamId,
            personaName: steamPlayer?.personaname ?? null,
            profileUrl: steamPlayer?.profileurl ?? null,
            avatarUrl: steamPlayer?.avatarfull ?? steamPlayer?.avatarmedium ?? null,
            countryCode: steamPlayer?.loccountrycode ?? null,
            steamCreatedAt: toDate(steamPlayer?.timecreated),
            squadPlaytimeMin: squad ? Number(squad.playtime_forever ?? 0) : null,
            totalPlaytimeMin,
            isPrivate: !Array.isArray(games),
            raw: { summary: steamPlayer, gamesResponse: gamesJson?.response ?? null },
        },
        update: {
            personaName: steamPlayer?.personaname ?? null,
            profileUrl: steamPlayer?.profileurl ?? null,
            avatarUrl: steamPlayer?.avatarfull ?? steamPlayer?.avatarmedium ?? null,
            countryCode: steamPlayer?.loccountrycode ?? null,
            steamCreatedAt: toDate(steamPlayer?.timecreated),
            squadPlaytimeMin: squad ? Number(squad.playtime_forever ?? 0) : null,
            totalPlaytimeMin,
            isPrivate: !Array.isArray(games),
            raw: { summary: steamPlayer, gamesResponse: gamesJson?.response ?? null },
            lastFetchedAt: new Date(),
        },
    });
}
