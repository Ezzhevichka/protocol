import axios, { AxiosError } from "axios";
import type { SquadServerConfig } from "../config/servers";
import { AppError } from "../errors/app-error";

function unwrapAxiosError(error: unknown, serverId: number): never {
  if (error instanceof AxiosError) {
    throw new AppError(
      error.response?.status ?? 502,
      "BOT_REQUEST_FAILED",
      `Бот ${serverId} вернул ошибку`,
      error.response?.data ?? error.message
    );
  }
  throw error;
}

export async function listPlayersFromBot(server: SquadServerConfig): Promise<{ players: any[]; squads: any[]; server: any }> {
  try {
    const response = await axios.get(`${server.botUrl}/players`, {
      headers: { Authorization: `Bearer ${server.botToken}` },
      timeout: 10_000,
    });

    return {
      players: response.data.players as any[],
      squads: (response.data.squads ?? []) as any[],
      server: response.data.server as any,
    };
  } catch (error) {
    unwrapAxiosError(error, server.id);
  }
}

export async function kickPlayerOnBot(server: SquadServerConfig, steamId: string, reason: string): Promise<unknown> {
  try {
    const response = await axios.post(
      `${server.botUrl}/kick`,
      { steamId, reason },
      {
        headers: { Authorization: `Bearer ${server.botToken}` },
        timeout: 10_000,
      }
    );

    return response.data;
  } catch (error) {
    unwrapAxiosError(error, server.id);
  }
}

export async function warnPlayerOnBot(
  server: SquadServerConfig,
  steamId: string,
  message: string
) {
  const response = await axios.post(
    `${server.botUrl}/warn`,
    {
      steamId,
      message,
    },
    {
      headers: {
        Authorization: `Bearer ${server.botToken}`,
      },
      timeout: 10_000,
    }
  );

  return response.data;
}
