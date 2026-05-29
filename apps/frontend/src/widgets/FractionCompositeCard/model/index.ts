import type { Player, Squad } from 'shared/types';

export type FractionCompositeSquad = Squad;
export type FractionCompositeNotSquadPlayer = Player;

export type FractionCompositeCardProps = {
  hoursAmount: number | string;
  fractionName: string;
  playersAmount: string | number;
  flag: string;
  squads: Squad[];
  notSquadPlayers: Player[];
  className?: string;
};
