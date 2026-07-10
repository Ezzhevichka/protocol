import type { RedisClient } from '@protocol/redis';
import type { Authenticator } from '@fastify/passport';
import type { AuthUser } from './src/types/auth';

declare module 'fastify' {
	interface FastifyInstance {
		redis: RedisClient;
		passport: Authenticator;
	}

	interface FastifyRequest {
		authUser: AuthUser | null;
	}
}

export {};
