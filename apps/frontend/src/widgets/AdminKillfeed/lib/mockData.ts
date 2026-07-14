import type { KillEvent, KillfeedServer } from './types';

const ATTACKERS = [
	{ name: '[PRO] Argon',      steamId: '76561198000000001' },
	{ name: '[JDM] Yatoo',      steamId: '76561198000000002' },
	{ name: 'Helldiver',        steamId: '76561198000000003' },
	{ name: '[OLEJA] Cristian', steamId: '76561198000000004' },
	{ name: '[TmNW] Белочка',   steamId: '76561198000000005' },
	{ name: 'BlueGuy',          steamId: '76561198000000006' },
	{ name: 'Morales',          steamId: '76561198000000007' },
	{ name: '[SOUS] LOLIK',     steamId: '76561198000000008' },
	{ name: '[PORK] Kolbasa',   steamId: '76561198000000009' },
	{ name: 'dancsiga',         steamId: '76561198000000010' },
];

const VICTIMS = [
	{ name: 'Kapysta',      steamId: '76561198000000011' },
	{ name: '[JDM] Vuchar', steamId: '76561198000000012' },
	{ name: 'Orion',        steamId: '76561198000000013' },
	{ name: 'Викл',         steamId: '76561198000000014' },
	{ name: 'default',      steamId: '76561198000000015' },
	{ name: 'Stephens',     steamId: '76561198000000016' },
	{ name: '[GVR] бобер',  steamId: '76561198000000017' },
	{ name: 'Инсан',        steamId: '76561198000000018' },
	{ name: 'Homps',        steamId: '76561198000000019' },
	{ name: 'Boil',         steamId: '76561198000000020' },
];

const WEAPONS = ['AK-74M', 'M4A1', 'L85A2', 'AKS-74U', 'RPK-74', 'M249 SAW', 'SVD Dragunov', 'G3A3', 'FAL', 'PKM'];

export const MOCK_SERVERS: KillfeedServer[] = [
	{ id: 'A', name: 'Protocol #1' },
	{ id: 'B', name: 'Protocol #2' },
	{ id: 'C', name: 'Protocol #3' },
];

const DATES = ['2026-07-12', '2026-07-13', '2026-07-14'];

function pad(n: number) { return String(n).padStart(2, '0'); }

export const MOCK_KILL_EVENTS: KillEvent[] = Array.from({ length: 50 }, (_, i) => {
	const h = pad(10 + Math.floor(i / 12));
	const m = pad((i * 7) % 60);
	const s = pad((i * 13) % 60);
	const attacker = ATTACKERS[i % ATTACKERS.length];
	const victim   = VICTIMS[i % VICTIMS.length];
	const server   = MOCK_SERVERS[i % MOCK_SERVERS.length];
	return {
		id: `mock-${i}`,
		date: DATES[i % DATES.length],
		timestamp: `${h}:${m}:${s}`,
		serverId: server.id,
		serverName: server.name,
		attackerName: attacker.name,
		attackerSteamId: attacker.steamId,
		weapon: WEAPONS[i % WEAPONS.length],
		victimName: victim.name,
		victimSteamId: victim.steamId,
		damage: 100,
	};
});

export const MOCK_WEAPONS = WEAPONS;
