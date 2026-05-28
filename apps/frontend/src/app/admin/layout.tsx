import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import type { ReactNode } from 'react';

import { getMe, getServers } from 'shared/api';
import { AdminThemeProvider } from 'shared/providers/AdminThemeProvider';
import { AdminNavProvider } from 'shared/providers/AdminNavContext';
import { AdminSidebar } from 'widgets/AdminSidebar';
import { AdminTopBar } from 'widgets/AdminTopBar';
import { AdminServerPanel } from 'widgets/AdminServerTabs';
import { AdminContentArea } from './AdminContentArea';

import './admin-theme.css';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const [user, servers] = await Promise.all([getMe(), getServers()]);

    if (!user || !user.isAdmin) {
        redirect('/');
    }

    return (
        <AdminThemeProvider>
            <AdminNavProvider>
                <div
                    className="flex h-screen overflow-hidden p-16 gap-16"
                    style={{ background: 'var(--at-bg-gradient)' }}
                >
                    <AdminSidebar user={user} />
                    <div
                        className="flex flex-1 flex-col overflow-hidden rounded-[16px]"
                        style={{
                            backgroundColor: 'var(--at-bg-content)',
                            border: '1px solid var(--at-border-content)',
                        }}
                    >
                        <AdminTopBar user={user} />
                        <div className="flex flex-1 flex-col overflow-y-auto min-h-0 gap-20">
                            <div className="px-20 pt-20">
                                <Suspense fallback={null}>
                                    <AdminServerPanel servers={servers} />
                                </Suspense>
                            </div>
                            <AdminContentArea>
                                {children}
                            </AdminContentArea>
                        </div>
                    </div>
                </div>
            </AdminNavProvider>
        </AdminThemeProvider>
    );
}
