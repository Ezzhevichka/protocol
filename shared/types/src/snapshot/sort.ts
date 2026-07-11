import type { Player, Squad } from '.';

export const COMMAND_SQUAD_NAME = 'Command Squad';

export const sortSquadPlayers = (players: Player[]): Player[] =>
	[...players].sort((a, b) => Number(b.isLeader) - Number(a.isLeader));

export const sortSquads = (squads: Squad[]): Squad[] =>
	[...squads].sort((a, b) => {
		const aIsCommand = a.squadName === COMMAND_SQUAD_NAME;
		const bIsCommand = b.squadName === COMMAND_SQUAD_NAME;

		if (aIsCommand !== bIsCommand) {
			return aIsCommand ? -1 : 1;
		}

		return Number(a.squadId) - Number(b.squadId);
	});
