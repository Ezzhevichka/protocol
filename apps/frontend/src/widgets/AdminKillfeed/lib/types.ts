export type KillfeedMode = 'history' | 'live';

export type KillEvent = {
	id: string;
	date: string;            // "2026-07-14"
	timestamp: string;       // "14:32:01"
	serverId: string;
	serverName: string;
	attackerName: string;
	attackerSteamId: string;
	weapon: string;
	victimName: string;
	victimSteamId: string;
	damage: number;
};

export type KillfeedServer = {
	id: string;
	name: string;
};

export type SortKey = keyof Pick<KillEvent, 'date' | 'timestamp' | 'serverName' | 'attackerName' | 'weapon' | 'victimName' | 'damage'>;

export type SortState = {
	key: SortKey;
	dir: 'asc' | 'desc';
};

export type FilterState = {
	attackerSearch: string;  // по нику или steamId убийцы
	victimSearch: string;    // по нику или steamId жертвы
	weapons: string[];       // выбранные оружия
	serverIds: string[];     // выбранные серверы (по id)
	dateFrom: string;        // "2026-07-01" или ""
	dateTo: string;          // "2026-07-14" или ""
};
