import { AuthUser } from '@/types';
import { prisma } from '@protocol/database';
import { updateExistingUser } from './updateExistingUser';

export const handleLoggedInUser = async (authUser: AuthUser) => {
	const user = await prisma.user.findUnique({
		where: {
			steamId: authUser.steamId,
		},
	});

	if (user) return updateExistingUser({ 
		steamId: authUser.steamId, 
		name: authUser.profile?.personaname, 
		avatarUrl: authUser.profile?.avatar, 
		profileUrl: authUser.profile?.profileurl,
	});

	await prisma.user.create({
		data: {
			steamId: authUser.steamId,
			name: authUser.profile?.personaname ?? 'New Player',
			profileUrl: authUser.profile?.profileurl ?? null,
			avatarUrl: authUser.profile?.avatar ?? '',
		},
	});
};
