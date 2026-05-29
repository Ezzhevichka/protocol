import { sendPlayerConnected } from 'services/backend-service';
import { kickPlayer } from 'services/squad-service';
import { HandlePlayerConnectedAction, PlayerEvent } from 'types/parserEvents';

const recentlyHandled = new Map<string, number>();

const RECENTLY_HANDLED_TTL_MS = 15_000;

function isRecentlyHandled(steamId: string) {
  const now = Date.now();
  const last = recentlyHandled.get(steamId);

  if (last && now - last < RECENTLY_HANDLED_TTL_MS) {
    return true;
  }

  recentlyHandled.set(steamId, now);
  return false;
}

function cleanupRecentlyHandled() {
  const now = Date.now();

  for (const [steamId, handledAt] of recentlyHandled.entries()) {
    if (now - handledAt > RECENTLY_HANDLED_TTL_MS) {
      recentlyHandled.delete(steamId);
    }
  }
}

export async function banEnforcementHandler(event: PlayerEvent) {
  if (event.type !== 'PLAYER_CONNECTED') {
    return;
  }

  if (isRecentlyHandled(event.steamId)) {
    return;
  }

  cleanupRecentlyHandled();

  const decision = await sendPlayerConnected({
    steamId: event.steamId,
    serverId: Number(process.env.SERVER_ID),
    eosId: event.eosId ?? null,
    name: event.name ?? null,
  });

  if (decision.action !== HandlePlayerConnectedAction.KICK) {
    return;
  }

  await kickPlayer(event.steamId, decision.reason);
}
