import type { SquadEvent } from '../../core/events/types';
import { checkBanBySteamId } from '../../services/backend.service';
import { kickPlayer, listPlayers } from '../../services/squad.service';

const recentlyHandled = new Map<string, number>();

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRecentlyHandled(steamId: string) {
    const now = Date.now();
    const last = recentlyHandled.get(steamId);
    if (last && now - last < 15000) return true;
    recentlyHandled.set(steamId, now);
    return false;
}

async function findOnlinePlayer(steamId: string) {
    // TODO: уюрать эту хуйню, что за цикл, сделать просто проверку в базе, если бот отправил событие
    for (let attempt = 1; attempt <= 10; attempt++) {
        const { players } = await listPlayers();
        const player = players.find((item) => item.steamId === steamId);
        if (player) return player;
        await sleep(1000);
    }
    return null;
}

export async function banEnforcementHandler(event: SquadEvent) {
    if (event.type !== 'PLAYER_CONNECTED') return;
    if (isRecentlyHandled(event.steamId)) return;

    const player = await findOnlinePlayer(event.steamId);
    const name = player?.name ?? event.name ?? null;
    const eosId = player?.eosId ?? event.eosId ?? null;

    const banStatus = await checkBanBySteamId({ steamId: event.steamId, eosId, name });
    if (!banStatus.isBanned) return;

    await kickPlayer(
        event.steamId,
        banStatus.activeBan?.reason
      ?? (banStatus.nicknameBlacklisted ? 'Nickname is blacklisted' : 'Banned')
    );
}
