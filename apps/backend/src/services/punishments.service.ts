import { prisma } from '@protocol/database';
import { env } from '@/config';
import axios from 'axios';

type BanPlayerPayload = {
	steamId: string;
	authorId: string;
	reason: string;
	serverNumberId: number;
};

export const banPlayer = async ({ steamId, authorId, reason, serverNumberId }: BanPlayerPayload) => {
	const internalBotUrl = `${env.internalBotUrl}:${4000 +serverNumberId}`;
	await prisma.punishment.create({ data: { victim: steamId, author: authorId, reason, type: 'BAN', status: 'ACTIVE' } });
	const botResponse = await axios.post(`${internalBotUrl}/ban`, { steamId, reason }, { headers: { Authorization: `Bearer ${env.botToken}` } });
	if (!botResponse.data.success) return false;
	return true;
};
