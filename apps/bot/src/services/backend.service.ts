import axios from "axios";
import { env } from "../config";

const client = axios.create({
  baseURL: env.backendInternalUrl,
  timeout: 5000,
  headers: { Authorization: `Bearer ${env.internalBotToken}` },
});

export async function checkBanBySteamId(input: { steamId: string; eosId?: string | null; name?: string | null }) {
  const response = await client.get(`/internal/bans/check/${input.steamId}`, {
    params: { eosId: input.eosId ?? undefined, name: input.name ?? undefined },
  });

  return response.data as { isBanned: boolean; nicknameBlacklisted?: boolean; activeBan: null | { id: string; reason: string } };
}

export async function sendPlayerConnected(input: { serverId: number; steamId: string; eosId?: string | null; name?: string | null; raw: string }) {
  await client.post("/internal/events/player-connected", input);
}

export async function sendPlayerDisconnected(input: { serverId: number; steamId: string; raw: string }) {
  await client.post("/internal/events/player-disconnected", input);
}
