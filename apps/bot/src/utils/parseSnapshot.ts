import { Player, ServerId, Snapshot, Squad, Team, TeamId, UnassignedPlayer, sortSquadPlayers, sortSquads } from '@protocol/types';
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

const getTeamSquads = (squads: TSquad[], teamId: TeamId): TSquad[] => {
	const teamSquads = new Map<string, TSquad>();

	for (const squad of squads) {
		if (squad.teamID !== teamId) continue;
		teamSquads.set(squad.squadID, squad);
	}

	return [...teamSquads.values()];
};

const getSquadsWithPlayers = (squads: TSquad[], players: TPlayer[], teamId: TeamId): Squad[] => {
	const teamSquads = getTeamSquads(squads, teamId);
	const playersBySquadId = new Map<string, Player[]>();

	for (const player of players) {
		if (player.teamID !== teamId || !player.squadID) continue;

		const squadPlayers = playersBySquadId.get(player.squadID) ?? [];
		squadPlayers.push(mapPlayer(player));
		playersBySquadId.set(player.squadID, squadPlayers);
	}

	const squadsWithPlayers = teamSquads.flatMap((squad) => {
		const squadPlayers = playersBySquadId.get(squad.squadID);
		if (!squadPlayers?.length) return [];

		return [mapSquad(squad, sortSquadPlayers(squadPlayers))];
	});

	return sortSquads(squadsWithPlayers);
};

const getUnassignedPlayers = (players: TPlayer[], teamId: TeamId): UnassignedPlayer[] =>
	players
		.filter((player) => player.teamID === teamId && !player.squadID)
		.map(mapUnassignedPlayer);

const getTeamPlayersCount = (players: TPlayer[], teamId: TeamId): number =>
	players.filter((player) => player.teamID === teamId).length;

const buildTeam = (
	teamId: TeamId,
	teamName: string,
	players: TPlayer[],
	squads: TSquad[]
): Team => ({
	id: teamId,
	name: teamName,
	playersCount: getTeamPlayersCount(players, teamId),
	unassignedPlayers: getUnassignedPlayers(players, teamId),
	squads: getSquadsWithPlayers(squads, players, teamId),
});

export const parseSnapshot = (
	playersRaw: TPlayer[],
	squadsRaw: TSquad[],
	serverInfoRaw: Optional<TServerInfo>
): Snapshot => ({
	id: process.env.SERVER_INITIAL_NAME as ServerId,
	teams: [
		buildTeam(TeamId.ONE, serverInfoRaw?.teamOne ?? 'Team 1', playersRaw, squadsRaw),
		buildTeam(TeamId.TWO, serverInfoRaw?.teamTwo ?? 'Team 2', playersRaw, squadsRaw),
	],
	serverName: serverInfoRaw?.serverName ?? '',
	serverNumberId: Number(process.env.SERVER_ID ?? 0),
	maxPlayers: serverInfoRaw?.maxPlayers ?? 0,
	playerCount: serverInfoRaw?.playerCount ?? 0,
	publicQueue: serverInfoRaw?.publicQueue ?? 0,
	currentLayer: serverInfoRaw?.currentLayer ?? '',
	nextLayer: serverInfoRaw?.nextLayer ?? '',
	matchTimeout: serverInfoRaw?.matchTimeout ?? 0,
	matchStartTime: serverInfoRaw?.matchStartTime ?? 0,
	gameVersion: serverInfoRaw?.gameVersion ?? '',
});
