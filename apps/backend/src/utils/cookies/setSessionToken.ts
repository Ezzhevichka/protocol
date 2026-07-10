import { SESSION_TOKEN_NAME, SESSION_TTL_SECONDS, env } from '@/config';
import { FastifyReply } from 'fastify';

export const setSessionToken = (reply: FastifyReply, token: string): void => {
	reply.setCookie(SESSION_TOKEN_NAME, token, {
		path: '/',
		httpOnly: true,
		secure: env.isProduction,
		sameSite: 'lax',
		maxAge: SESSION_TTL_SECONDS,
		signed: true,
	});
};
