import { FastifyInstance, FastifyRequest } from 'fastify';
import { prisma } from '@protocol/database';

export const deleteRole = async (app: FastifyInstance) => {
	app.delete(
		'/roles/:id',
		async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
			const { id } = request.params;

			await prisma.role.delete({ where: { id } });

			return reply.status(200).send({ success: true });
		},
	);
};
