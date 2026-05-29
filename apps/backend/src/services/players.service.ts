import { buildPlayersResponse } from './player-snapshot.service';
import { getSquadServerConfig, listSquadServerConfigs } from './servers.service';
import { AppError } from '../errors/app-error';

export async function getPlayersByServerId(serverId: number) {
  const server = await getSquadServerConfig(serverId);

  if (!server) {
    throw new AppError(404, 'SERVER_NOT_FOUND', 'Сервер не найден');
  }

  return buildPlayersResponse(server.id, server.name);
}

export async function getDefaultPlayers() {
  const servers = await listSquadServerConfigs();
  const server = servers[0];

  if (!server) {
    throw new AppError(404, 'SERVER_NOT_FOUND', 'Сервер не найден');
  }

  return buildPlayersResponse(server.id, server.name);
}
