import { env } from "../../config";
import type { SquadEvent } from "../../core/events/types";
import { sendPlayerConnected, sendPlayerDisconnected } from "../../services/backend.service";

export async function playerSessionHandler(event: SquadEvent) {
  if (event.type === "PLAYER_CONNECTED") {
    await sendPlayerConnected({ serverId: env.serverId, steamId: event.steamId, eosId: event.eosId, name: event.name, raw: event.raw });
  }

  if (event.type === "PLAYER_DISCONNECTED") {
    await sendPlayerDisconnected({ serverId: env.serverId, steamId: event.steamId, raw: event.raw });
  }
}
