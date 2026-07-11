import { cookies } from 'next/headers';

import type {
	AuthUser,
	ServerData,
	FractionData,
	StatCard,
	MapData,
	ServerStateData,
} from 'shared/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function getMe(): Promise<AuthUser | null> {
	try {
		const cookieStore = await cookies();
		const res = await fetch(`${API_URL}/me`, {
			headers: { Cookie: cookieStore.toString() },
			cache: 'no-store',
		});
		if (!res.ok) return null;
		const data = await res.json() as { user: AuthUser | null; isAdmin: boolean };
		if (!data.user) return null;
		return { ...data.user, isAdmin: data.isAdmin };
	} catch {
		return null;
	}
}

type RawSnapshot = {
	id: string;
	serverName: string;
	serverNumberId: number;
	maxPlayers: number;
	playerCount: number;
	publicQueue: number;
	currentLayer: string;
	nextLayer: string;
	teams: RawSnapshotTeam[];
};

type RawSnapshotTeam = {
	id: string;
	name: string;
	playersCount: number;
	unassignedPlayers: RawSnapshotPlayer[];
	squads: RawSnapshotSquad[];
};

type RawSnapshotSquad = {
	squadId: string;
	squadName: string;
	size: string;
	locked: boolean;
	teamId: string | null;
	players: RawSnapshotPlayer[];
};

type RawSnapshotPlayer = {
	playerId: string;
	eosId: string;
	steamId: string;
	name: string;
	teamId: string;
	squadId: string | null;
	isLeader: boolean;
	role: string;
};

export async function getServers(): Promise<ServerData[]> {
	let res: Response;
	try {
		res = await fetch(`${API_URL}/servers`, { cache: 'no-store' });
	} catch {
		return [];
	}
	if (!res.ok) return [];
	const snapshots = await res.json() as RawSnapshot[];

	return snapshots.map((s) => ({
		id: s.id,
		badge: s.id,
		name: s.serverName,
		state: 'default' as const,
		playersCount: s.playerCount ?? 0,
		maxPlayers: s.maxPlayers ?? 100,
		queueCount: s.publicQueue ?? 0,
		currentLayer: s.currentLayer ?? null,
		nextLayer: s.nextLayer ?? null,
		teamOne: s.teams[0]?.name,
		teamTwo: s.teams[1]?.name,
	}));
}

/* ── Server players ─────────────────────────────────────────── */

type RawLivePlayer = {
	steamId: string;
	eosId: string;
	name: string;
	raw?: {
		teamID?: string;
		squadID?: string;
		isLeader?: boolean;
		role?: string;
	};
};

type RawLiveSquad = {
	squadId: string;
	teamId: string;
	name: string;
	size: number | null;
	locked: boolean;
};

export type LiveTeam = {
	teamId: string;
	playersCount: number;
	squads: Array<{
		squad: RawLiveSquad;
		players: RawLivePlayer[];
	}>;
	unassigned: RawLivePlayer[];
};

export type ServerPlayersData = {
	serverId: string;
	serverName: string;
	serverNumberId: number;
	playersCount: number;
	squadsCount: number;
	maxPlayers: number;
	queueCount: number;
	currentLayer: string | null;
	nextLayer: string | null;
	teams: LiveTeam[];
};

function snapshotToServerPlayersData(s: RawSnapshot): ServerPlayersData {
	const teams: LiveTeam[] = s.teams.map((team) => ({
		teamId: team.name,
		playersCount: team.playersCount,
		squads: team.squads
			.filter((sq) => (sq.teamId ?? team.id) === team.id)
			.map((sq) => ({
				squad: {
					squadId: sq.squadId,
					teamId: sq.teamId ?? team.id,
					name: sq.squadName,
					size: sq.size ? Number(sq.size) : null,
					locked: sq.locked,
				},
				players: sq.players.map((p) => ({
					steamId: p.steamId,
					eosId: p.eosId,
					name: p.name,
					raw: {
						teamID: p.teamId,
						squadID: p.squadId ?? undefined,
						isLeader: p.isLeader,
						role: p.role,
					},
				})),
			})),
		unassigned: team.unassignedPlayers.map((p) => ({
			steamId: p.steamId,
			eosId: p.eosId,
			name: p.name,
			raw: {
				teamID: p.teamId,
				squadID: undefined,
				isLeader: p.isLeader,
				role: p.role,
			},
		})),
	}));

	return {
		serverId: s.id,
		serverName: s.serverName,
		serverNumberId: s.serverNumberId,
		playersCount: s.playerCount,
		squadsCount: s.teams.reduce((n, t) => n + t.squads.length, 0),
		maxPlayers: s.maxPlayers,
		queueCount: s.publicQueue,
		currentLayer: s.currentLayer ?? null,
		nextLayer: s.nextLayer ?? null,
		teams,
	};
}

export async function getServerPlayers(serverId: string): Promise<ServerPlayersData | null> {
	try {
		const res = await fetch(`${API_URL}/servers/${serverId}`, { cache: 'no-store' });
		if (!res.ok) return null;
		const snapshot = await res.json() as RawSnapshot | null;
		if (!snapshot) return null;
		return snapshotToServerPlayersData(snapshot);
	} catch {
		return null;
	}
}

export async function banPlayer(params: {
	steamId: string;
	authorId: string;
	reason: string;
	serverNumberId: number;
}): Promise<boolean> {
	try {
		const cookieStore = await cookies();
		const res = await fetch(`${API_URL}/punishments/ban`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: cookieStore.toString(),
			},
			body: JSON.stringify(params),
			cache: 'no-store',
		});
		return res.ok;
	} catch {
		return false;
	}
}

export async function getCurrentMap(): Promise<MapData> {
	return {
		mapName: 'Gorodok Invasion v2',
		imageSrc: '/maps/gorodok_invasion_v2.jpg',
	};
}

export async function getServerState(): Promise<ServerStateData> {
	return {
		level: 'sweaty',
		hoursAmount: 1000,
		openProfilePercentages: 88,
	};
}

export async function getFractions(): Promise<[FractionData, FractionData]> {
	return [
		{
			hoursAmount: 248,
			fractionName: 'United States Army',
			playersAmount: 47,
			flag: '/general/flags/usa.svg',
			squads: [
				{
					id: 1,
					squadNumber: 1,
					squadName: 'Alpha',
					playersInSquad: 9,
					isOpen: false,
					hasCmd: true,
					players: [
						{ id: 1, kitName: 'SL', nickname: '[PRO] Argon', role: 'SL' },
						{ id: 2, kitName: 'Medic', nickname: 'Kapysta', role: 'Medic' },
						{ id: 3, kitName: 'Rifleman', nickname: '[OLEJA] Cristian', role: 'Rifleman' },
					],
				},
				{
					id: 2,
					squadNumber: 2,
					squadName: 'Bravo',
					playersInSquad: 6,
					isOpen: true,
					hasCmd: false,
					players: [
						{ id: 4, kitName: 'SL', nickname: 'Helldiver', role: 'SL' },
						{ id: 5, kitName: 'Engineer', nickname: 'Morales', role: 'Engineer' },
					],
				},
			],
			notSquadPlayers: [
				{ id: 10, kitName: 'Rifleman', nickname: 'BlueGuy', role: 'Rifleman' },
				{ id: 11, kitName: 'Medic', nickname: 'Инсан', role: 'Medic' },
			],
		},
		{
			hoursAmount: 201,
			fractionName: 'Russian Ground Forces',
			playersAmount: 44,
			flag: '/general/flags/ru.svg',
			squads: [
				{
					id: 3,
					squadNumber: 1,
					squadName: 'Альфа',
					playersInSquad: 8,
					isOpen: false,
					hasCmd: true,
					players: [
						{ id: 6, kitName: 'SL', nickname: '[JDM] Yatoo', role: 'SL' },
						{ id: 7, kitName: 'Sniper', nickname: '[JDM] Vuchar', role: 'Sniper' },
						{ id: 8, kitName: 'Machine Gunner', nickname: '[GOMES] Пулик', role: 'Machine Gunner' },
					],
				},
				{
					id: 4,
					squadNumber: 2,
					squadName: 'Браво',
					playersInSquad: 5,
					isOpen: true,
					hasCmd: false,
					players: [
						{ id: 9, kitName: 'SL', nickname: 'Викл', role: 'SL' },
						{ id: 10, kitName: 'Pilot', nickname: 'arx', role: 'Pilot' },
					],
				},
			],
			notSquadPlayers: [
				{ id: 12, kitName: 'Sniper', nickname: 'default', role: 'Sniper' },
				{ id: 13, kitName: 'Engineer', nickname: 'Stephens', role: 'Engineer' },
			],
		},
	];
}

export async function getTopStats(): Promise<{
	title: string;
	dateRange: string;
	cards: StatCard[];
}> {
	return {
		title: 'Топ игроков за неделю',
		dateRange: '(12.01—18.01)',
		cards: [
			{
				id: 'cmd',
				iconSrc: '/general/star_cmd.svg',
				title: 'CMD',
				players: [
					{ rank: 1, nickname: '[JDM] Yatoo', hoursText: '15ч 43м' },
					{ rank: 2, nickname: '[OLEJA] Cristian', hoursText: '14ч 19м' },
					{ rank: 3, nickname: '[TmNW] Белочка', hoursText: '8ч 13м' },
					{ rank: 4, nickname: 'Helldiver', hoursText: '3ч 50м' },
					{ rank: 5, nickname: 'BlueGuy', hoursText: '2ч 7м' },
				],
			},
			{
				id: 'sl',
				iconSrc: '/general/squad_kit_sl.svg',
				title: 'SL',
				players: [
					{ rank: 1, nickname: 'Argon', hoursText: '37ч 18м' },
					{ rank: 2, nickname: '[PET] Кирюха', hoursText: '20ч 38м' },
					{ rank: 3, nickname: 'dancsiga', hoursText: '19ч 20м' },
					{ rank: 4, nickname: 'Orion', hoursText: '17ч 47м' },
					{ rank: 5, nickname: 'Викл', hoursText: '14ч 23м' },
				],
			},
			{
				id: 'seeder',
				iconSrc: '/general/seed_header.svg',
				title: 'Seeder',
				players: [
					{ rank: 1, nickname: '[PRO] Angel', hoursText: '26ч 28м' },
					{ rank: 2, nickname: '[GVR] бобер', hoursText: '22ч 40м' },
					{ rank: 3, nickname: '[OLEJA] Филин', hoursText: '21ч 5м' },
					{ rank: 4, nickname: '[PRO] BulletProoff', hoursText: '15ч 34м' },
					{ rank: 5, nickname: '[OLEJA] Ivas', hoursText: '12ч 51м' },
				],
			},
			{
				id: 'medic',
				iconSrc: '/kits/medic_kit.svg',
				title: 'Медик',
				players: [
					{ rank: 1, nickname: '[SOUS] LOLIK', hoursText: '56ч 23м' },
					{ rank: 2, nickname: 'Kapysta', hoursText: '26ч 8м' },
					{ rank: 3, nickname: '[ALL] Medick', hoursText: '22ч 14м' },
					{ rank: 4, nickname: 'Koper', hoursText: '19ч 55м' },
					{ rank: 5, nickname: 'Инсан', hoursText: '16ч 58м' },
				],
			},
			{
				id: 'rifleman',
				iconSrc: '/kits/rifleman_kit.svg',
				title: 'Стрелок',
				players: [
					{ rank: 1, nickname: '[PORK] Kolbasa', hoursText: '51ч 50м' },
					{ rank: 2, nickname: 'Homps', hoursText: '47ч 43м' },
					{ rank: 3, nickname: 'Boil', hoursText: '41ч 11м' },
					{ rank: 4, nickname: 'Смог', hoursText: '34ч 29м' },
					{ rank: 5, nickname: '[POU] Chyha', hoursText: '28ч 47м' },
				],
			},
			{
				id: 'mg',
				iconSrc: '/kits/machine_gunner_kit.svg',
				title: 'Пулеметчик',
				players: [
					{ rank: 1, nickname: '[GOMES] Пулик', hoursText: '13ч 9м' },
					{ rank: 2, nickname: 'Henrika', hoursText: '4ч 24м' },
					{ rank: 3, nickname: 'Russell', hoursText: '3ч 45м' },
					{ rank: 4, nickname: 'scrummy', hoursText: '2ч 27м' },
					{ rank: 5, nickname: 'useless guy', hoursText: '1ч 12м' },
				],
			},
			{
				id: 'engineer',
				iconSrc: '/kits/combat_Engineer_kit.svg',
				title: 'Инженер',
				players: [
					{ rank: 1, nickname: 'Morales', hoursText: '11ч 29м' },
					{ rank: 2, nickname: 'Stephens', hoursText: '10ч 8м' },
					{ rank: 3, nickname: '[TNR] Ryanne', hoursText: '26ч 8м' },
					{ rank: 4, nickname: 'Anuj', hoursText: '7ч 34м' },
					{ rank: 5, nickname: 'Helge', hoursText: '5ч 47м' },
				],
			},
			{
				id: 'sniper',
				iconSrc: '/kits/sniper_kit.svg',
				title: 'Снайпер',
				players: [
					{ rank: 1, nickname: '[JDM] Vuchar', hoursText: '14ч 31м' },
					{ rank: 2, nickname: '[SOUS] Dope.', hoursText: '7ч 45м' },
					{ rank: 3, nickname: 'default', hoursText: '5ч 19м' },
					{ rank: 4, nickname: 'Hotties', hoursText: '3ч 11м' },
					{ rank: 5, nickname: 'grrrave', hoursText: '1ч 24м' },
				],
			},
			{
				id: 'pilot',
				iconSrc: '/kits/lead_pilot.svg',
				title: 'Пилот',
				players: [
					{ rank: 1, nickname: 'arx', hoursText: '25ч 0м' },
					{ rank: 2, nickname: 'Nemoi', hoursText: '11ч 8м' },
					{ rank: 3, nickname: '[TmNW] GafiAlex', hoursText: '8ч 35м' },
					{ rank: 4, nickname: '[FLY] bruh', hoursText: '7ч 33м' },
					{ rank: 5, nickname: 'bee', hoursText: '3ч 56м' },
				],
			},
		],
	};
}
