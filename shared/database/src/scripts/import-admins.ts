import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import type { RoleType, SitePermissions } from '../generated/enums';
import { SitePermissions as SP } from '../generated/enums';
import { buildRoleDefinitions, buildUserRoleAssignments, parseAdminsCfg } from '../lib/parse-admins-cfg';

loadEnv({ path: resolve(process.cwd(), '.env') });

const ROLE_TYPE_MAP: Record<string, RoleType> = {
	Admin:         'ADMIN',
	Moderator:     'MODERATOR',
	QueuePriority: 'VIP',
	Cameraman:     'CAMERA',
	Intern:        'INTERN',
};

const SITE_PERMISSIONS_MAP: Record<string, SitePermissions[]> = {
	Admin:         [SP.punish, SP.perm, SP.kick],
	Moderator:     [SP.punish, SP.kick],
	QueuePriority: [],
	Cameraman:     [],
	Intern:        [],
};

const main = async () => {
	const { prisma } = await import('../client');

	const filePath = process.argv[2] ?? resolve(process.cwd(), '../../config/Admins.cfg');
	const content = await readFile(filePath, 'utf8');
	const parsed = parseAdminsCfg(content);
	const roleDefinitions = buildRoleDefinitions(parsed);
	const assignments = buildUserRoleAssignments(parsed);

	console.log(`Upserting ${roleDefinitions.length} roles...`);

	const roleIdByName: Record<string, string> = {};

	for (const role of roleDefinitions) {
		const type = ROLE_TYPE_MAP[role.name];
		if (!type) {
			console.warn(`  Skipping unknown group "${role.name}"`);
			continue;
		}

		const record = await prisma.role.upsert({
			where: { label: role.name },
			update: {
				squadPermissions: role.squadPermissions,
				sitePermissions: SITE_PERMISSIONS_MAP[role.name] ?? [],
			},
			create: {
				label: role.name,
				type,
				squadPermissions: role.squadPermissions,
				sitePermissions: SITE_PERMISSIONS_MAP[role.name] ?? [],
			},
		});

		roleIdByName[role.name] = record.id;
		console.log(`  Role "${role.name}" → ${record.id}`);
	}

	console.log(`\nUpserting ${assignments.length} users...`);

	for (const { steamId, roleName } of assignments) {
		const roleId = roleIdByName[roleName];
		if (!roleId) continue;

		await prisma.user.upsert({
			where:  { steamId },
			update: { roleId },
			create: {
				steamId,
				name:      '',
				avatarUrl: '',
				roleId,
			},
		});
	}

	console.log('Done.');
	await prisma.$disconnect();
};

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
