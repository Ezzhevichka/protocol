import { FastifyInstance, FastifyRequest } from 'fastify';
import { prisma, RoleType } from '@protocol/database';

type Body = {
	label: string;
	type: string;
	color?: string | null;
};

export const createRole = async (app: FastifyInstance) => {
	app.post('/roles', async (request: FastifyRequest<{ Body: Body }>, reply) => {
		const { label, type, color } = request.body;

		if (!label?.trim()) {
			return reply.status(400).send({ error: 'label is required' });
		}

		const validType = Object.values(RoleType).includes(type as RoleType)
			? (type as RoleType)
			: null;

		if (!validType) {
			return reply.status(400).send({ error: 'invalid type' });
		}

		const role = await prisma.role.create({
			data: {
				label: label.trim(),
				type: validType,
				color: color ?? null,
				squadPermissions: [],
				sitePermissions: [],
			},
		});

		return reply.status(201).send(role);
	});
};
