import { PunishmentRequest } from '@protocol/types';
import { prisma, StatusType } from '@protocol/database';
import { env, InternalApiRoutes } from '@/config';
import axios from 'axios';
import { createBanReason } from '@/utils';

const SERVER_LETTER_PORTS = {
	A: 4001,
	B: 4002,
	C: 4003,
	D: 4004,
	E: 4005,
	F: 4006,
};

export const banPlayer = async ({ victimId, authorId, reason, until, description, serverId, punishmentType }: PunishmentRequest) => {
	const internalBotUrl = `${env.internalBotUrl}:${SERVER_LETTER_PORTS[serverId as keyof typeof SERVER_LETTER_PORTS]}`;
	const parsedReason = createBanReason({ reason, until });

	await prisma.punishment.create({ data: { victim: victimId, author: authorId, reason: parsedReason, until, type: punishmentType, description, status: StatusType.ACTIVE } });

	const botResponse = await axios.post(`${internalBotUrl}${InternalApiRoutes.BAN}`, { victimId, reason: parsedReason }, { headers: { Authorization: `Bearer ${env.botToken}` } }); // TODO: Create internal api routes

	if (!botResponse.data.success) return false;

	return true;
};
