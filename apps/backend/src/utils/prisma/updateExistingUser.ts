import { User } from '@protocol/database/dist/generated/client';
import { prisma } from '@protocol/database';

export const updateExistingUser = async (user: Partial<User>) => {
	const existingUser = await prisma.user.findUnique({
		where: { steamId: user.steamId },
	});

	if (!existingUser) return;

	const newData: Record<string, typeof user[keyof User]> = {};

	for (const key in user) {
		if (key === 'steamId') continue;
		if (key === 'createdAt') continue;
		if (key === 'roleId') continue;
		if (user[key as keyof User] !== existingUser[key as keyof User]) {
			newData[key] = user[key as keyof User];
		}
	}

	await prisma.user.update({
		where: { steamId: user.steamId },
		data: newData,
	});
};
