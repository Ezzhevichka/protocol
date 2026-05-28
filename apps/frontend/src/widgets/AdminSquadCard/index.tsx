'use client';

import { AdminPlayerRow } from 'widgets/AdminPlayerRow';
import type { AdminPlayerRowData } from 'widgets/AdminPlayerRow';

export type AdminSquadCardData = {
    id: string | number;
    number: number;
    name: string;
    isLocked: boolean;
    maxPlayers?: number;
    players: AdminPlayerRowData[];
};

export type AdminSquadCardProps = {
    squad: AdminSquadCardData;
    /**
     * Встроенный режим — убирает собственный glass-контейнер.
     * Используется внутри AdminFractionBlock.
     */
    embedded?: boolean;
    onKickFromSquad?: (playerId: string) => void;
    onKill?: (playerId: string) => void;
    onBan?: (playerId: string) => void;
    onCopyTeleport?: (playerId: string) => void;
};

const IconLocked = () => (
    <svg width="14" height="16" viewBox="0 0 10 12" fill="none">
        <rect x="1" y="5" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M3 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

const IconUnlocked = () => (
    <svg width="14" height="16" viewBox="0 0 10 12" fill="none">
        <rect x="1" y="5" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M3 5V3.5a2 2 0 0 1 4 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

export const AdminSquadCard = ({
    squad,
    embedded = false,
    onKickFromSquad,
    onKill,
    onBan,
    onCopyTeleport,
}: AdminSquadCardProps) => {
    const content = (
        <>
            <div
                className="flex h-[42px] items-center gap-8 px-12"
                style={{
                    borderBottom: '1px solid var(--at-border-content)',
                    backgroundColor: embedded ? 'rgba(255,255,255,0.03)' : undefined,
                }}
            >
                <span
                    className="shrink-0 text-[15px] font-bold leading-none"
                    style={{ color: 'var(--at-text-server)', fontFamily: 'Oswald, sans-serif' }}
                >
                    {squad.number}
                </span>
                <span className="flex-1 truncate text-[11px]" style={{ color: 'var(--at-text-nav)' }}>
                    {squad.name}
                </span>
                <span
                    className="shrink-0"
                    style={{ color: squad.isLocked ? 'var(--at-status-offline)' : 'var(--at-text-section)' }}
                >
                    {squad.isLocked ? <IconLocked /> : <IconUnlocked />}
                </span>
                <span
                    className="shrink-0 rounded-[7px] px-10 py-4 text-[12px] font-bold tabular-nums"
                    style={{
                        backgroundColor: 'var(--at-bg-tab-active)',
                        border: '1px solid var(--at-border-tab-active)',
                        color: 'var(--at-text-nav-active)',
                        boxShadow: '0 0 8px rgba(0,60,160,0.25)',
                    }}
                >
                    {squad.players.length}/{squad.maxPlayers ?? 9}
                </span>
            </div>
            {squad.players.map((player, idx) => (
                <AdminPlayerRow
                    key={player.id}
                    player={player}
                    showDivider={idx < squad.players.length - 1}
                    onKickFromSquad={() => onKickFromSquad?.(player.id)}
                    onKill={() => onKill?.(player.id)}
                    onBan={() => onBan?.(player.id)}
                    onCopyTeleport={() => onCopyTeleport?.(player.id)}
                />
            ))}
        </>
    );

    if (embedded) return <div>{content}</div>;

    return (
        <div
            className="overflow-hidden rounded-[10px]"
            style={{
                backgroundColor: 'var(--at-glass-bg)',
                border: '1px solid var(--at-glass-border)',
                backdropFilter: 'var(--at-glass-blur)',
                WebkitBackdropFilter: 'var(--at-glass-blur)',
                boxShadow: 'var(--at-glass-shadow)',
            }}
        >
            {content}
        </div>
    );
};
