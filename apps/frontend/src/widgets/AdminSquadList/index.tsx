'use client';

import { AdminSquadCard } from 'widgets/AdminSquadCard';
import type { AdminSquadCardData } from 'widgets/AdminSquadCard';
import { AdminPlayerRow } from 'widgets/AdminPlayerRow';
import type { AdminPlayerRowData } from 'widgets/AdminPlayerRow';

export type { AdminSquadCardData as AdminSquad, AdminPlayerRowData as AdminSquadPlayer };

export type AdminSquadListProps = {
    squads: AdminSquadCardData[];
    unassigned?: AdminPlayerRowData[];
    /**
     * Встроенный режим — убирает glass-обёртку вокруг каждого сквада.
     * Используется внутри AdminFractionBlock.
     */
    embedded?: boolean;
    onKickFromSquad?: (playerId: string) => void;
    onKill?: (playerId: string) => void;
    onBan?: (playerId: string) => void;
    onCopyTeleport?: (playerId: string) => void;
};

const IconUnassigned = () => (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5.5 3v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

type UnassignedSectionProps = {
    players: AdminPlayerRowData[];
    headerBg?: string;
    onKickFromSquad?: (playerId: string) => void;
    onKill?: (playerId: string) => void;
    onBan?: (playerId: string) => void;
    onCopyTeleport?: (playerId: string) => void;
};

const UnassignedSection = (
    { players, headerBg, onKickFromSquad, onKill, onBan, onCopyTeleport }: UnassignedSectionProps
) => (
    <>
        <div
            className="flex h-[36px] items-center gap-8 px-12"
            style={{
                borderBottom: '1px solid var(--at-border-content)',
                backgroundColor: headerBg,
            }}
        >
            <span style={{ color: 'var(--at-text-section)' }}>
                <IconUnassigned />
            </span>
            <span className="flex-1 text-[11px]" style={{ color: 'var(--at-text-section)' }}>
                Нераспределённые игроки
            </span>
            <span
                className="shrink-0 rounded-[6px] px-8 py-3 text-[11px] font-semibold tabular-nums"
                style={{
                    backgroundColor: 'var(--at-bg-tab-active)',
                    border: '1px solid var(--at-border-tab-active)',
                    color: 'var(--at-text-nav-active)',
                }}
            >
                {players.length}
            </span>
        </div>
        {players.map((player, idx) => (
            <AdminPlayerRow
                key={player.id}
                player={player}
                showDivider={idx < players.length - 1}
                onKickFromSquad={() => onKickFromSquad?.(player.id)}
                onKill={() => onKill?.(player.id)}
                onBan={() => onBan?.(player.id)}
                onCopyTeleport={() => onCopyTeleport?.(player.id)}
            />
        ))}
    </>
);

export const AdminSquadList = ({
    squads,
    unassigned = [],
    embedded = false,
    onKickFromSquad,
    onKill,
    onBan,
    onCopyTeleport,
}: AdminSquadListProps) => {
    const hasUnassigned = unassigned.length > 0;

    if (embedded) {
        return (
            <div>
                {squads.map((squad, idx) => (
                    <div
                        key={squad.id}
                        style={idx > 0 ? { borderTop: '1px solid var(--at-border-section)' } : undefined}
                    >
                        <AdminSquadCard
                            squad={squad}
                            embedded
                            onKickFromSquad={onKickFromSquad}
                            onKill={onKill}
                            onBan={onBan}
                            onCopyTeleport={onCopyTeleport}
                        />
                    </div>
                ))}
                {hasUnassigned && (
                    <div style={{ borderTop: '1px solid var(--at-border-section)' }}>
                        <UnassignedSection
                            players={unassigned}
                            headerBg="rgba(255,255,255,0.015)"
                            onKickFromSquad={onKickFromSquad}
                            onKill={onKill}
                            onBan={onBan}
                            onCopyTeleport={onCopyTeleport}
                        />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {squads.map((squad) => (
                <AdminSquadCard
                    key={squad.id}
                    squad={squad}
                    onKickFromSquad={onKickFromSquad}
                    onKill={onKill}
                    onBan={onBan}
                    onCopyTeleport={onCopyTeleport}
                />
            ))}
            {hasUnassigned && (
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
                    <UnassignedSection
                        players={unassigned}
                        onKickFromSquad={onKickFromSquad}
                        onKill={onKill}
                        onBan={onBan}
                        onCopyTeleport={onCopyTeleport}
                    />
                </div>
            )}
        </div>
    );
};
