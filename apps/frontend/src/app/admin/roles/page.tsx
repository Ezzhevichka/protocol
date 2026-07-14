import { AdminRoleManager, type RoleData } from 'widgets/AdminRoleManager';

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type ApiRole = {
	id: string;
	label: string;
	type: string;
	color: string | null;
	squadPermissions: string[];
	sitePermissions: string[];
};

type PermissionsData = {
	squad: string[];
	site: string[];
	roleTypes: string[];
};

async function getRoles(): Promise<ApiRole[]> {
	try {
		const res = await fetch(`${API_URL}/roles`, { cache: 'no-store' });
		if (!res.ok) return [];
		return res.json() as Promise<ApiRole[]>;
	} catch {
		return [];
	}
}

async function getPermissions(): Promise<PermissionsData> {
	try {
		const res = await fetch(`${API_URL}/permissions`, { cache: 'no-store' });
		if (!res.ok) return { squad: [], site: [], roleTypes: [] };
		return res.json() as Promise<PermissionsData>;
	} catch {
		return { squad: [], site: [], roleTypes: [] };
	}
}

export default async function RolesPage() {
	const [roles, permissions] = await Promise.all([getRoles(), getPermissions()]);

	const roleData: RoleData[] = roles.map((r) => ({
		id: r.id,
		label: r.label,
		type: r.type,
		color: r.color,
		squadPermissions: r.squadPermissions,
		sitePermissions: r.sitePermissions,
	}));

	return (
		<main className="flex flex-1 flex-col min-h-0 overflow-y-auto">
			<AdminRoleManager
				initialRoles={roleData}
				roleTypes={permissions.roleTypes}
				squadPermissions={permissions.squad}
				sitePermissions={permissions.site}
			/>
		</main>
	);
}
