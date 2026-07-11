export type Player = {
	playerId: string; // Ingame player ID
	eosId: string;
	steamId: string;
	name: string;
	teamId: string;
	squadId: Nullable<string>;
	isLeader: boolean;
	role: string; // change to enum in future
};

export type Squad = {
	squadId: string;
	squadName: string;
	size: string;
	locked: boolean;
	creatorName: string;
	creatorEosId: string;
	creatorSteamId: string;
	teamId: Nullable<string>;
	teamName: Nullable<string>;
	players: Player[];
};

export type Team = {
	id: TeamId;
	name: string;
	playersCount: number;
	unassignedPlayers: UnassignedPlayer[];
	squads: Squad[];
};

export enum TeamId {
	ONE = '1',
	TWO = '2'
}

export type ServerInfo = {
	serverName: string;
	maxPlayers: number;
	publicQueueLimit: number;
	reserveSlots: number;
	playerCount: number;
	a2sPlayerCount: number;
	publicQueue: number;
	reserveQueue: number;
	currentLayer: string;
	nextLayer: string;
	matchTimeout: number;
	matchStartTime: number;
	gameVersion: string;
};

export type UnassignedPlayer = Omit<Player, 'squadId'> & { squadId: null };

export enum ServerId {
	A = 'A',
	B = 'B',
	C = 'C',
	D = 'D',
	E = 'E',
	F = 'F'
}

export type Snapshot = {
	id: ServerId;
	teams: Team[];
	serverName: string;
	maxPlayers: number;
	playerCount: number;
	publicQueue: number;
	currentLayer: string;
	nextLayer: string;
	matchTimeout: number;
	matchStartTime: number;
	gameVersion: string;
	serverNumberId: number;
};
