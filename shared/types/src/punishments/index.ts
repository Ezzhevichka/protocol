export interface PunishmentRequest {
	victimId: SteamId;
	authorId: SteamId;
	reason: string;
	description?: string;
	until?: Nullable<Date>;
	serverId: string;
	punishmentType: PunishmentType;
}

export enum PunishmentType {
	BAN = 'BAN',
	WARN = 'WARN'
}
