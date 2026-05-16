import { getSquadServer } from "../config/servers";
import { listPlayersFromBot } from "./bot.service";
import { syncPlayerIdentities } from "./player-identity.service";
import { groupPlayersByTeams } from "./player-grouping.service";

export async function getPlayersByServerId(serverId: number) {
  const server = getSquadServer(serverId);

  if (!server) {
    const error = new Error("SERVER_NOT_FOUND");
    error.name = "SERVER_NOT_FOUND";
    throw error;
  }

  const data = await listPlayersFromBot(server);

  await syncPlayerIdentities(data.players);

  const teams = groupPlayersByTeams({
    players: data.players,
    squads: data.squads,
  });

  return {
    serverId: server.id,
    serverName: server.name,

    playersCount: data.players.length,
    squadsCount: data.squads.length,

    players: data.players,
    server: data.server as any,
    squads: data.squads,
    teams,
  };
}