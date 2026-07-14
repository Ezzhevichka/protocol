import { FastifyInstance } from 'fastify';
import { getAllRoles } from './get-all-roles';

export const rolesRoutes = async (app: FastifyInstance) => {
	await getAllRoles(app);
};
