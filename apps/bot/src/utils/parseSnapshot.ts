import { TPlayer, TServerInfo, TSquad } from 'squad-rcon';
import { ServerSnapshot } from '../types';

const getUnassignedPlayers = (players: TPlayer[], teamId: ServerSnapshot.TeamId) => players.filter((player) => player.teamID === teamId && !player.squadID);

const getSquadsWithPlayers = (squads: TSquad[], players: TPlayer[], teamId: ServerSnapshot.TeamId) => {
	return squads.reduce((acc: ServerSnapshot.Squad[], current) => {
		acc.push({ ...current, players: players.map((player) => ({ ...player, name: player.name.trim() })).filter((player) => player.squadID === current.squadID && player.teamID === teamId) });
		return acc;
	}, []);
};

export const parseSnapshot = (playersRaw: TPlayer[], squadsRaw: TSquad[], serverInfo: Optional<TServerInfo>) => {
	const teams = [
		{
			name: serverInfo?.teamOne ?? 'Team 1',
			id: ServerSnapshot.TeamId.ONE,
			unassignedPlayers: getUnassignedPlayers(playersRaw, ServerSnapshot.TeamId.ONE),
			squads: getSquadsWithPlayers(squadsRaw, playersRaw, ServerSnapshot.TeamId.ONE),
		},
		{
			name: serverInfo?.teamTwo ?? 'Team 2',
			id: ServerSnapshot.TeamId.TWO,
			unassignedPlayers: getUnassignedPlayers(playersRaw, ServerSnapshot.TeamId.TWO),
			squads: getSquadsWithPlayers(squadsRaw, playersRaw, ServerSnapshot.TeamId.TWO),
		},
	];

	return { teams, serverInfo };
};
