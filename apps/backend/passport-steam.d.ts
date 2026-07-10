declare module 'passport-steam' {
	import type { Strategy as PassportStrategy } from 'passport';

	export class Strategy extends PassportStrategy {
		constructor(
			options: {
				returnURL: string;
				realm: string;
				apiKey?: string;
				profile?: boolean;
				passReqToCallback?: boolean;
			},
			verify: (
				req: unknown,
				identifier: string,
				profile: {
					id?: string;
					displayName?: string;
					_json?: Record<string, unknown>;
				},
				done: (error: Error | null, user?: unknown) => void,
			) => void,
		);
	}
}
