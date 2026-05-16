import { SquadPlayer } from "../model";

export const SQUAD_SIZE = 9;

export const formatSquadPlayersCount = (playersInSquad: number | string) => {
  if (typeof playersInSquad === "number") {
    return `${playersInSquad}/${SQUAD_SIZE}`;
  }

  return `${playersInSquad}/${SQUAD_SIZE}`;
};

export const normalizeSquadPlayers = (players: SquadPlayer[]) => {
  return players.slice(0, SQUAD_SIZE);
};
