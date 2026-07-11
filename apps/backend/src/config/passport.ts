import { Authenticator, type Strategy } from '@fastify/passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import { extractSteamId, normalizeSteamProfile } from '@/services';
import { env } from './env';
import { AuthUser } from '@/types';

export type PassportSteamUser = AuthUser;

export const createPassport = (): Authenticator => {
	const passport = new Authenticator();

	passport.use('steam', new SteamStrategy(
		{
			returnURL: `${env.backendUrl}/auth/steam/callback`,
			realm: `${env.backendUrl}/`,
			apiKey: env.steamApiKey,
			passReqToCallback: true,
		},
		(
			_req: unknown,
			identifier: string,
			profile: { id?: string; _json?: Record<string, unknown>; displayName?: string },
			done: (error: Error | null, user?: PassportSteamUser | false) => void
		) => {
			try {
				const steamId = extractSteamId(identifier, profile);
				const normalizedProfile = normalizeSteamProfile(profile);
				done(null, {
					steamId,
					profile: normalizedProfile,
					createdAt: new Date().toISOString(),
				});
			} catch (error) {
				done(error as Error);
			}
		}
	));

	return passport;
};

export const createSteamStrategyForState = (state: string): Strategy =>
	new SteamStrategy(
		{
			returnURL: `${env.backendUrl}/auth/steam/callback?state=${encodeURIComponent(state)}`,
			realm: `${env.backendUrl}/`,
			apiKey: env.steamApiKey,
			passReqToCallback: true,
		},
		(
			_req: unknown,
			identifier: string,
			profile: { id?: string; _json?: Record<string, unknown>; displayName?: string },
			done: (error: Error | null, user?: PassportSteamUser | false) => void
		) => {
			try {
				const steamId = extractSteamId(identifier, profile);
				const normalizedProfile = normalizeSteamProfile(profile);
				done(null, {
					steamId,
					profile: normalizedProfile,
					createdAt: new Date().toISOString(),
				});
			} catch (error) {
				done(error as Error);
			}
		}
	) as unknown as Strategy;
