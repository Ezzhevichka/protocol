// import { readFile } from 'node:fs/promises';
// import { resolve } from 'node:path';

// import { config as loadEnv } from 'dotenv';

// loadEnv({ path: resolve(process.cwd(), '.env') });

// const main = async () => {
// 	const { prisma } = await import('../client');
// 	const {
// 		buildRoleDefinitions,
// 		buildUserRoleAssignments,
// 		parseAdminsCfg,
// 	} = await import('../lib/parse-admins-cfg');

// 	const filePath = process.argv[2] ?? resolve(process.cwd(), '../../config/Admins.cfg');
// 	const content = await readFile(filePath, 'utf8');
// 	const parsed = parseAdminsCfg(content);
// 	const roleDefinitions = buildRoleDefinitions(parsed);
// 	const userAssignments = buildUserRoleAssignments(parsed);

// 	if (userAssignments.length === 0) {
// 		console.log('No admin entries found in file:', filePath);
// 		return;
// 	}

// 	let rolesCreated = 0;
// 	let rolesUpdated = 0;
// 	const roleIdsByName = new Map<string, string>();

// 	for (const roleDefinition of roleDefinitions) {
// 		const existing = await prisma.role.findUnique({
// 			where: { name: roleDefinition.name },
// 			select: { id: true },
// 		});

// 		const role = await prisma.role.upsert({
// 			where: { name: roleDefinition.name },
// 			create: {
// 				name: roleDefinition.name,
// 				squadPermissions: roleDefinition.squadPermissions,
// 				sitePermissions: roleDefinition.sitePermissions,
// 			},
// 			update: {
// 				squadPermissions: roleDefinition.squadPermissions,
// 				sitePermissions: roleDefinition.sitePermissions,
// 			},
// 		});

// 		roleIdsByName.set(role.name, role.id);

// 		if (existing) {
// 			rolesUpdated += 1;
// 		} else {
// 			rolesCreated += 1;
// 		}
// 	}

// 	let usersCreated = 0;
// 	let usersUpdated = 0;

// 	for (const assignment of userAssignments) {
// 		const roleId = roleIdsByName.get(assignment.roleName);

// 		if (!roleId) {
// 			throw new Error(`Role "${assignment.roleName}" was not created`);
// 		}

// 		const existing = await prisma.user.findUnique({
// 			where: { steamId: assignment.steamId },
// 			select: { id: true },
// 		});

// 		await prisma.user.upsert({
// 			where: { steamId: assignment.steamId },
// 			create: {
// 				steamId: assignment.steamId,
// 				roleId,
// 			},
// 			update: {
// 				roleId,
// 			},
// 		});

// 		if (existing) {
// 			usersUpdated += 1;
// 		} else {
// 			usersCreated += 1;
// 		}
// 	}

// 	console.log(`Imported from ${filePath}`);
// 	console.log(`Roles — total: ${roleDefinitions.length}, created: ${rolesCreated}, updated: ${rolesUpdated}`);
// 	console.log(`Users — total: ${userAssignments.length}, created: ${usersCreated}, updated: ${usersUpdated}`);
// };

// main()
// 	.catch((error) => {
// 		console.error(error);
// 		process.exit(1);
// 	})
// 	.finally(async () => {
// 		const { prisma } = await import('../client');
// 		await prisma.$disconnect();
// 	});
