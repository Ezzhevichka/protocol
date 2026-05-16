export type { Player as SquadPlayer } from "shared/types";
import type { Player } from "shared/types";

export type SquadCardProps = {
  playersInSquad: number | string;
  isOpen: boolean;
  hasCmd: boolean;
  cmd?: boolean;
  fullWidth?: boolean;
  players: Player[];
  squadNumber?: number | string;
  squadName?: string;
  className?: string;
};
