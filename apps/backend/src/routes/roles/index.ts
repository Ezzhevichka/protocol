import { FastifyInstance } from 'fastify';
import { getAllRoles } from './get-all-roles';
import { getPermissions } from './get-permissions';
import { createRole } from './create-role';
import { updateRole } from './update-role';
import { deleteRole } from './delete-role';

export const rolesRoutes = async (app: FastifyInstance) => {
	await getAllRoles(app);
	await getPermissions(app);
	await createRole(app);
	await updateRole(app);
	await deleteRole(app);
};
