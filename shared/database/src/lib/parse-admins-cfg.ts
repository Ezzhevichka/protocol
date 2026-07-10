import type { SitePermissions, SquadPermissions } from '../generated/enums';
import { SitePermissions as SitePermissionsEnum, SquadPermissions as SquadPermissionsEnum } from '../generated/enums';

export type ParsedAdminEntry = {
	steamId: string;
	group: string;
};

export type ParsedAdminsFile = {
	groups: Record<string, string[]>;
	admins: ParsedAdminEntry[];
};

export type ResolvedRolePermissions = {
	squadPermissions: SquadPermissions[];
	sitePermissions: SitePermissions[];
};

export type RoleDefinition = {
	name: string;
	squadPermissions: SquadPermissions[];
	sitePermissions: SitePermissions[];
};

export type UserRoleAssignment = {
	steamId: string;
	roleName: string;
};

const squadPermissionSet = new Set<string>(Object.values(SquadPermissionsEnum));
const sitePermissionSet = new Set<string>(Object.values(SitePermissionsEnum));

const parsePermissions = (value: string): string[] =>
	value.split(',').map((item) => item.trim()).filter(Boolean);

export const resolveRolePermissions = (permissions: string[]): ResolvedRolePermissions => {
	const squadPermissions: SquadPermissions[] = [];
	const sitePermissions: SitePermissions[] = [];

	for (const permission of permissions) {
		if (squadPermissionSet.has(permission)) {
			squadPermissions.push(permission as SquadPermissions);
		}

		if (sitePermissionSet.has(permission)) {
			sitePermissions.push(permission as SitePermissions);
		}
	}

	return { squadPermissions, sitePermissions };
};

export const parseAdminsCfg = (content: string): ParsedAdminsFile => {
	const groups: Record<string, string[]> = {};
	const admins: ParsedAdminEntry[] = [];

	for (const rawLine of content.split(/\r?\n/u)) {
		const line = rawLine.trim();
		if (!line || line.startsWith('//')) continue;

		const groupMatch = /^Group=([^:]+):(.+)$/u.exec(line);
		if (groupMatch) {
			groups[groupMatch[1]] = parsePermissions(groupMatch[2]);
			continue;
		}

		const adminMatch = /^Admin=(\d{17}):([^:]+)$/u.exec(line);
		if (adminMatch) {
			admins.push({
				steamId: adminMatch[1],
				group: adminMatch[2],
			});
		}
	}

	return { groups, admins };
};

export const buildRoleDefinitions = ({ groups }: ParsedAdminsFile): RoleDefinition[] =>
	Object.entries(groups).map(([name, permissions]) => {
		const { squadPermissions, sitePermissions } = resolveRolePermissions(permissions);

		return {
			name,
			squadPermissions,
			sitePermissions,
		};
	});

export const buildUserRoleAssignments = ({ groups, admins }: ParsedAdminsFile): UserRoleAssignment[] =>
	admins.map((admin) => {
		if (!groups[admin.group]) {
			throw new Error(`Unknown group "${admin.group}" for steam ID ${admin.steamId}`);
		}

		return {
			steamId: admin.steamId,
			roleName: admin.group,
		};
	});

export const getUniqueSteamIds = (admins: ParsedAdminEntry[]): string[] =>
	[...new Set(admins.map((admin) => admin.steamId))];
