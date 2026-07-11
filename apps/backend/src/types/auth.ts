export type SteamProfile = {
	steamid: string;
	communityvisibilitystate: number,
	profilestate: number,
	personaname: string,
	profileurl: string,
	avatar: string,
	avatarmedium: string,
	avatarfull: string,
	avatarhash: string,
	lastlogoff: number,
	personastate: number,
	realname: string,
	primaryclanid: string,
	timecreated: number,
	personastateflags: number,
	loccountrycode: string,
	locstatecode: string,
	loccityid: number
};

export type AuthUser = {
	steamId: string;
	profile: Nullable<SteamProfile>;
	createdAt: string;
};

export type SessionPayload = AuthUser;
