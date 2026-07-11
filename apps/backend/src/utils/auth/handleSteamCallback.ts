import { env } from '@/config';
import { createSessionToken, saveSession } from '@/services';
import { AuthUser } from '@/types';
import { FastifyReply, FastifyRequest } from 'fastify';
import { handleLoggedInUser } from '../prisma';
import { setSessionToken } from '../cookies';

export const handleSteamCallback = async (request: FastifyRequest, reply: FastifyReply, err: Nullable<Error>, user: unknown): Promise<void> => {
	const steamError = err ?? (!user || typeof user !== 'object' || !('steamId' in user));
	if (steamError) {
		request.log.error(err, 'Steam authentication failed');
		reply.redirect(`${env.frontendUrl}`);
		return;
	}

	const authUser = user as AuthUser;
	const token = createSessionToken();

	await handleLoggedInUser(authUser);

	await saveSession(request.server.redis, token, authUser);
	setSessionToken(reply, token);

	reply.redirect(`${env.frontendUrl}`);
};
