'use client';

import { usePathname } from 'next/navigation';
import { AdminServerPanel } from 'widgets/AdminServerTabs';
import type { ServerData } from 'shared/types';

const PAGES_WITHOUT_SERVER_PANEL = [
	'/admin/roles',
	'/admin/settings',
	'/admin/config',
	'/admin/stats',
	'/admin/plugins',
];

export function AdminServerPanelWrapper({ servers }: { servers: ServerData[] }) {
	const pathname = usePathname();

	if (PAGES_WITHOUT_SERVER_PANEL.includes(pathname)) return null;

	return <AdminServerPanel servers={servers} />;
}
