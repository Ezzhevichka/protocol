import crypto from 'node:crypto';
import type { RedisClient } from '@protocol/redis';
import { STEAM_STATE_PREFIX, STEAM_STATE_TTL_SECONDS } from '@/config';
import { SteamProfile } from '@/types';

export const generateState = (): string =>
	crypto.randomBytes(32).toString('hex');

export const saveSteamState = async (
	redis: RedisClient,
	state: string
): Promise<void> => {
	await redis.set(`${STEAM_STATE_PREFIX}${state}`, 'pending', {
		EX: STEAM_STATE_TTL_SECONDS,
	});
};

export const consumeSteamState = async (
	redis: RedisClient,
	state: string
): Promise<boolean> => {
	const key = `${STEAM_STATE_PREFIX}${state}`;
	const exists = await redis.get(key);
	if (!exists) return false;
	await redis.del(key);
	return true;
};

export const extractSteamId = (identifier: string, profile?: { id?: string }): string => {
	if (profile?.id) return profile.id;

	const match = identifier.match(/(\d{17})$/);
	if (!match) {
		throw new Error('Unable to extract SteamID from OpenID identifier');
	}

	return match[1];
};

export const normalizeSteamProfile = (profile: {
	id?: string;
	_json?: Record<string, unknown>;
	displayName?: string;
} | undefined): SteamProfile | null => {
	if (!profile) return null;
	if (profile._json && typeof profile._json.steamid === 'string') {
		return profile._json as SteamProfile;
	}
	return null;
};
