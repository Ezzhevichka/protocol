'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAdminNav } from 'shared/providers/AdminNavContext';
import type { ServerData } from 'shared/types';

type AdminServerPanelProps = {
    servers: ServerData[];
};

export const AdminServerPanel = ({ servers }: AdminServerPanelProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { startNavigation } = useAdminNav();

    const activeIdFromUrl = searchParams.get('server')
        ? Number(searchParams.get('server'))
        : servers[0]?.id;

    const [activeId, setActiveId] = useState<string | number | undefined>(activeIdFromUrl);

    useEffect(() => {
        setActiveId(activeIdFromUrl);
    }, [activeIdFromUrl]);

    const activeServer = servers.find((s) => s.id === activeId) ?? servers[0];
    const isOnline = activeServer?.state !== 'disabled';

    if (servers.length === 0) return null;

    function selectServer(id: string | number) {
        setActiveId(id);
        startNavigation();
        const params = new URLSearchParams(searchParams.toString());
        params.set('server', String(id));
        router.push(`/admin?${params.toString()}`);
    }

    return (
        <div className="flex flex-col gap-12">
            <div className="flex items-center gap-12">
                <h2
                    className="text-[20px] font-bold uppercase tracking-wide"
                    style={{ color: 'var(--at-text-server)', fontFamily: 'Oswald, sans-serif' }}
                >
                    {activeServer?.name ?? '—'}
                </h2>
                <span
                    className="rounded-[6px] px-10 py-3 text-[11px] font-semibold"
                    style={{
                        backgroundColor: isOnline ? 'var(--at-status-online-bg)' : 'var(--at-status-offline-bg)',
                        border: `1px solid ${isOnline ? 'var(--at-status-online-border)' : 'var(--at-status-offline-border)'}`,
                        color: isOnline ? 'var(--at-status-online)' : 'var(--at-status-offline)',
                    }}
                >
                    {isOnline ? 'Онлайн' : 'Оффлайн'}
                </span>
            </div>

            <div
                className="flex items-center gap-6 rounded-[12px] p-6"
                style={{
                    backgroundColor: 'var(--at-glass-bg)',
                    border: '1px solid var(--at-glass-border)',
                    backdropFilter: 'var(--at-glass-blur)',
                    WebkitBackdropFilter: 'var(--at-glass-blur)',
                    boxShadow: 'var(--at-glass-shadow)',
                }}
            >
                {servers.map((server) => {
                    const isActive = server.id === activeId;
                    const isOffline = server.state === 'disabled';
                    const playersCount = server.playersCount ?? 0;
                    const maxPlayers = server.maxPlayers ?? 100;

                    return (
                        <button
                            key={server.id}
                            type="button"
                            onClick={() => server.id !== undefined && selectServer(server.id)}
                            className="relative flex items-center gap-10 rounded-[9px] px-14 py-9 transition-all duration-200"
                            style={{
                                cursor: 'pointer',
                                backgroundColor: isActive ? 'var(--at-bg-tab-active)' : 'var(--at-bg-tab-inactive)',
                                border: isActive
                                    ? '1px solid var(--at-border-tab-active)'
                                    : '1px solid var(--at-border-tab-inactive)',
                                boxShadow: isActive ? 'var(--at-shadow-tab-active)' : 'none',
                            }}
                        >
                            {isActive && (
                                <span
                                    className="pointer-events-none absolute inset-0 rounded-[9px]"
                                    style={{
                                        background: 'radial-gradient(ellipse at 30% 50%, var(--at-accent-spotlight) 0%, transparent 70%)',
                                    }}
                                />
                            )}
                            {isOffline && (
                                <span
                                    className="relative size-[6px] shrink-0 rounded-full"
                                    style={{ backgroundColor: 'var(--at-status-offline)' }}
                                />
                            )}
                            <span
                                className="relative text-[10px] font-bold uppercase tracking-wider"
                                style={{
                                    color: isActive ? 'var(--at-text-tab-active)' : 'var(--at-text-tab)',
                                    opacity: isOffline && !isActive ? 0.6 : 1,
                                }}
                            >
                                {server.name}
                            </span>
                            <span
                                className="relative rounded-[8px] px-7 py-2 text-[10px] leading-tight"
                                style={{
                                    backgroundColor: isActive ? 'var(--at-bg-badge-active)' : 'var(--at-bg-badge-inactive)',
                                    border: isActive
                                        ? '1px solid var(--at-border-badge-active)'
                                        : '1px solid var(--at-border-badge-inactive)',
                                    color: isActive ? 'var(--at-text-badge-active)' : 'var(--at-text-badge)',
                                    opacity: isOffline && !isActive ? 0.6 : 1,
                                }}
                            >
                                {playersCount}/{maxPlayers}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
