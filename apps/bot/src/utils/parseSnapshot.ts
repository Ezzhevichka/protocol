import { Player, ServerId, Snapshot, Squad, Team, TeamId, UnassignedPlayer } from '@protocol/types';
import { TPlayer, TServerInfo, TSquad } from 'squad-rcon';

const mapPlayer = (player: TPlayer): Player => ({
	playerId: player.playerID,
	eosId: player.eosID,
	steamId: player.steamID,
	name: player.name.trim(),
	teamId: player.teamID,
	squadId: player.squadID,
	isLeader: player.isLeader,
	role: player.role,
});

const mapUnassignedPlayer = (player: TPlayer): UnassignedPlayer => ({
	...mapPlayer(player),
	squadId: null,
});

const mapSquad = (squad: TSquad, players: Player[]): Squad => ({
	squadId: squad.squadID,
	squadName: squad.squadName,
	size: squad.size,
	locked: squad.locked.toLowerCase() === 'true',
	creatorName: squad.creatorName,
	creatorEosId: squad.creatorEOSID,
	creatorSteamId: squad.creatorSteamID,
	teamId: squad.teamID,
	teamName: squad.teamName,
	players,
});

const getUnassignedPlayers = (players: TPlayer[], teamId: TeamId): UnassignedPlayer[] => players.filter((player) => player.teamID === teamId && !player.squadID).map(mapUnassignedPlayer);

const getSquadsWithPlayers = (squads: TSquad[], players: TPlayer[], teamId: TeamId): Squad[] => {
	const mappedPlayers = players.map(mapPlayer);

	return squads.reduce<Squad[]>((acc, squad) => {
		acc.push(
			mapSquad(
				squad,
				mappedPlayers.filter(
					(player) => player.squadId === squad.squadID && player.teamId === teamId
				)
			)
		);
		return acc;
	}, []);
};

const getTeamPlayersCount = (players: TPlayer[], teamId: TeamId): number => players.filter((player) => player.teamID === teamId).length;

export const parseSnapshot = (playersRaw: TPlayer[], squadsRaw: TSquad[], serverInfoRaw: Optional<TServerInfo>): Snapshot => {
	const teams: Team[] = [
		{
			name: serverInfoRaw?.teamOne ?? 'Team 1',
			id: TeamId.ONE,
			playersCount: getTeamPlayersCount(playersRaw, TeamId.ONE),
			unassignedPlayers: getUnassignedPlayers(playersRaw, TeamId.ONE),
			squads: getSquadsWithPlayers(squadsRaw, playersRaw, TeamId.ONE),
		},
		{
			name: serverInfoRaw?.teamTwo ?? 'Team 2',
			id: TeamId.TWO,
			playersCount: getTeamPlayersCount(playersRaw, TeamId.TWO),
			unassignedPlayers: getUnassignedPlayers(playersRaw, TeamId.TWO),
			squads: getSquadsWithPlayers(squadsRaw, playersRaw, TeamId.TWO),
		},
	];

	return {
		id: process.env.SERVER_INITIAL_NAME as ServerId,
		teams,
		serverName: serverInfoRaw?.serverName ?? '',
		maxPlayers: serverInfoRaw?.maxPlayers ?? 0,
		playerCount: serverInfoRaw?.playerCount ?? 0,
		publicQueue: serverInfoRaw?.publicQueue ?? 0,
		currentLayer: serverInfoRaw?.currentLayer ?? '',
		nextLayer: serverInfoRaw?.nextLayer ?? '',
		matchTimeout: serverInfoRaw?.matchTimeout ?? 0,
		matchStartTime: serverInfoRaw?.matchStartTime ?? 0,
		gameVersion: serverInfoRaw?.gameVersion ?? '',
	};
};
