import { RolesApiRoutes } from '@/config';
import { prisma } from '@protocol/database';
import { FastifyInstance } from 'fastify';

export const getAllRoles = async (app: FastifyInstance) => {
	app.get(RolesApiRoutes.GET_ALL_ROLES, async (request, reply) => {
		const roles = await prisma.role.findMany();
		return reply.status(200).send(roles);
	});
};
