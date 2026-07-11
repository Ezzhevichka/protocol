import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { env, createSteamStrategyForState, SESSION_TOKEN_NAME } from '@/config';
import { toMeResponse, generateState, saveSteamState, consumeSteamState, createSessionToken, saveSession, deleteSession } from '@/services';
import { optionalAuthenticate } from '@/middleware';
import { AuthUser } from '@/types';
import { handleLoggedInUser, setSessionToken } from '@/utils';

const handleSteamCallback = async (request: FastifyRequest, reply: FastifyReply, err: Nullable<Error>, user: unknown): Promise<void> => {
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

export const authRoutes = async (app: FastifyInstance): Promise<void> => {

	app.get('/auth/steam', async (request, reply) => {
		const state = generateState();
		await saveSteamState(app.redis, state);

		const strategy = createSteamStrategyForState(state);
		const runAuth = app.passport.authenticate(strategy, {
			session: false,
			authInfo: false,
		});

		await runAuth.call(app, request, reply);
	});

	app.get('/auth/steam/callback', async (request, reply) => {
		const state = (request.query as { state?: string }).state;
		if (!state) {
			reply.code(400).send({ error: 'Missing state parameter' });
			return;
		}

		const isValidState = await consumeSteamState(app.redis, state);
		if (!isValidState) {
			reply.code(403).send({ error: 'Invalid or expired state' });
			return;
		}

		const strategy = createSteamStrategyForState(state);
		const runAuth = app.passport.authenticate(strategy, { session: false, authInfo: false, failureRedirect: `${env.frontendUrl}/login` }, handleSteamCallback);

		await runAuth.call(app, request, reply);
	});

	app.get('/auth/logout', async (request, reply) => {
		const raw = request.cookies[SESSION_TOKEN_NAME];
		if (raw) {
			const unsigned = reply.unsignCookie(raw);
			if (unsigned.valid && unsigned.value) {
				await deleteSession(app.redis, unsigned.value);
			}
		}

		reply.clearCookie(SESSION_TOKEN_NAME, { path: '/' });
		reply.redirect(`${env.frontendUrl}/`);
	});

	app.get('/me', { preHandler: optionalAuthenticate }, async (request) => ({
		user: request.authUser ? toMeResponse(request.authUser) : null,
		isAdmin: false,
	}));
};
