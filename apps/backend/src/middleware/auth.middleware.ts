import type { FastifyReply, FastifyRequest } from 'fastify';
import { SESSION_TOKEN_NAME } from '@/config';
import { getSession, touchSession } from '@/services';
import { getSessionToken } from '@/utils';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
	const token = getSessionToken(request, reply);
	if (!token) {
		reply.code(401).send({ error: 'Unauthorized' });
		return;
	}

	const session = await getSession(request.server.redis, token);
	if (!session) {
		reply.clearCookie(SESSION_TOKEN_NAME, { path: '/' });
		reply.code(401).send({ error: 'Unauthorized' });
		return;
	}

	await touchSession(request.server.redis, token);

	request.authUser = {
		steamId: session.steamId,
		profile: session.profile,
		createdAt: session.createdAt,
	};
};

export const optionalAuthenticate = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
	const token = getSessionToken(request, reply);
	if (!token) {
		request.authUser = null;
		return;
	}

	const session = await getSession(request.server.redis, token);
	if (!session) {
		request.authUser = null;
		return;
	}

	await touchSession(request.server.redis, token);
	request.authUser = {
		steamId: session.steamId,
		profile: session.profile,
		createdAt: session.createdAt,
	};
};
