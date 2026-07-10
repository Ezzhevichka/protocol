import fp from 'fastify-plugin';
import { createPassport } from '@/config';

export const passportPlugin = fp(async (app) => {
	const passport = createPassport();

	app.decorate('passport', passport);
	app.decorateRequest('passport', {
		getter() {
			return passport;
		},
	});
});
