import { FastifyInstance, FastifyRequest } from 'fastify';
import { prisma, SquadPermissions, SitePermissions } from '@protocol/database';

type Body = {
	label?: string;
	color?: string | null;
	squadPermissions?: string[];
	sitePermissions?: string[];
};

export const updateRole = async (app: FastifyInstance) => {
	app.put(
		'/roles/:id',
		async (request: FastifyRequest<{ Params: { id: string }; Body: Body }>, reply) => {
			const { id } = request.params;
			const { label, color, squadPermissions, sitePermissions } = request.body;

			const validSquad = squadPermissions?.filter(
				(p): p is SquadPermissions => p in SquadPermissions,
			);
			const validSite = sitePermissions?.filter(
				(p): p is SitePermissions => p in SitePermissions,
			);

			const role = await prisma.role.update({
				where: { id },
				data: {
					...(label !== undefined && { label: label.trim() }),
					...(color !== undefined && { color: color ?? null }),
					...(validSquad !== undefined && { squadPermissions: validSquad }),
					...(validSite !== undefined && { sitePermissions: validSite }),
				},
			});

			return reply.status(200).send(role);
		},
	);
};
