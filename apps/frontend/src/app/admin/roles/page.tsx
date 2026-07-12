import { AdminRolesTable } from 'widgets/AdminRolesTable';

export const dynamic = 'force-dynamic';

// TODO: заменить на fetch из БД
const MOCK_ROLES = [
	{
		id: 'admin',
		label: 'Admin',
		permissions: [
			'startvote','changemap','pause','cheat','private','balance','chat',
			'kick','ban','config','cameraman','manageserver','featuretest',
			'reserve','demos','clientdemos','debug','teamchange','forceteamchange',
			'canseeadminchat','punish','perm',
		],
	},
	{
		id: 'moderator',
		label: 'Moderator',
		permissions: [
			'startvote','cheat','private','balance','chat','kick','ban',
			'cameraman','reserve','teamchange','canseeadminchat','punish',
		],
	},
	{
		id: 'intern',
		label: 'Intern',
		permissions: ['balance','chat','cameraman','reserve','teamchange','forceteamchange','canseeadminchat'],
	},
	{
		id: 'cameraman',
		label: 'Cameraman',
		permissions: ['balance','cameraman','reserve','teamchange'],
	},
	{
		id: 'vip',
		label: 'VIP',
		permissions: ['reserve','teamchange'],
	},
];

export default function RolesPage() {
	return (
		<main className="flex flex-1 flex-col min-h-0">
			<AdminRolesTable initialRoles={MOCK_ROLES} />
		</main>
	);
}
