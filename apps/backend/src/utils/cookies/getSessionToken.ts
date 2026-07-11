import { SESSION_TOKEN_NAME } from '@/config';
import { FastifyReply, FastifyRequest } from 'fastify';

export const getSessionToken = (request: FastifyRequest, reply: FastifyReply): string | null => {
	const raw = request.cookies[SESSION_TOKEN_NAME];
	if (!raw) return null;

	const unsigned = reply.unsignCookie(raw);
	if (!unsigned.valid || !unsigned.value) return null;

	return unsigned.value;
};
