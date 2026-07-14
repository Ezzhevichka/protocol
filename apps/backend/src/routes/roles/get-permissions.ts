import { FastifyInstance } from 'fastify';
import { SquadPermissions, SitePermissions, RoleType } from '@protocol/database';

export const getPermissions = async (app: FastifyInstance) => {
	app.get('/permissions', async (_req, reply) => {
		return reply.status(200).send({
			squad: Object.values(SquadPermissions),
			site: Object.values(SitePermissions),
			roleTypes: Object.values(RoleType),
		});
	});
};
