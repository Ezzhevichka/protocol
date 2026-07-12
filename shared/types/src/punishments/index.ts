export type WarnIntervalType = 'once' | 'second' | 'minute';

export interface PunishmentRequest {
	victimId: SteamId;
	authorId: SteamId;
	reason: string;
	description?: string;
	until?: Nullable<Date>;
	serverId: string;
	punishmentType: PunishmentType;
	warnInterval?: { value: number; type: WarnIntervalType };
}

export enum PunishmentType {
	BAN = 'BAN',
	WARN = 'WARN'
}
