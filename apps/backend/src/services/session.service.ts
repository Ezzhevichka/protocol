import crypto from 'node:crypto';
import type { RedisClient } from '@protocol/redis';
import { SESSION_KEY_PREFIX, SESSION_TTL_SECONDS } from '@/config';
import { AuthUser, SessionPayload } from '@/types';

export const createSessionToken = (): string =>
	crypto.randomBytes(48).toString('base64url');

export const saveSession = async (
	redis: RedisClient,
	token: string,
	payload: SessionPayload
): Promise<void> => {
	await redis.set(
		`${SESSION_KEY_PREFIX}${token}`,
		JSON.stringify(payload),
		{ EX: SESSION_TTL_SECONDS }
	);
};

export const getSession = async (
	redis: RedisClient,
	token: string
): Promise<SessionPayload | null> => {
	const raw = await redis.get(`${SESSION_KEY_PREFIX}${token}`);
	if (!raw) return null;
	return JSON.parse(raw) as SessionPayload;
};

export const touchSession = async (
	redis: RedisClient,
	token: string
): Promise<boolean> => {
	const result = await redis.expire(`${SESSION_KEY_PREFIX}${token}`, SESSION_TTL_SECONDS);
	return result === 1;
};

export const deleteSession = async (
	redis: RedisClient,
	token: string
): Promise<void> => {
	await redis.del(`${SESSION_KEY_PREFIX}${token}`);
};

export const toAuthUser = (steamId: string, profile: AuthUser['profile']): AuthUser => ({
	steamId,
	profile,
	createdAt: new Date().toISOString(),
});
