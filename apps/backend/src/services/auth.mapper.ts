import { AuthUser } from '@/types';

export type MeResponse = {
	id: string;
	steamId: string;
	displayName: string | null;
	avatarUrl: string | null;
	profileUrl: string | null;
	role: string | null;
	isAdmin: boolean;
};

export const toMeResponse = (user: AuthUser): MeResponse => ({
	id: user.steamId,
	steamId: user.steamId,
	displayName: user.profile?.personaname ?? null,
	avatarUrl: user.profile?.avatarfull ?? user.profile?.avatar ?? null,
	profileUrl: user.profile?.profileurl ?? null,
	role: null,
	isAdmin: false,
});
