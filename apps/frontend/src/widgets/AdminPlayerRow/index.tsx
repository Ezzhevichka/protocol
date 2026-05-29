'use client';

import Image from 'next/image';

import { resolveKitIcon, resolveKitIconSize } from 'shared/constants';

/* ── Типы ─────────────────────────────────────────────────────────── */

export type AdminPlayerRowData = {
    id: string;
    steamId?: string;
    nickname: string;
    /** Клановый тег, напр. "[RFA]" */
    clanTag?: string;
    /** Название кита/роли */
    role?: string;
    kitIcon?: string;
    isLeader?: boolean;
};

export type AdminPlayerRowProps = {
    player: AdminPlayerRowData;
    showDivider?: boolean;
    onKickFromSquad?: () => void;
    onKill?: () => void;
    onBan?: () => void;
    onCopyTeleport?: () => void;
};

/* ── Иконки действий ──────────────────────────────────────────────── */

const IconKick = () => (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
        <circle cx="5" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1 10c0-2.21 1.79-4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M9 7l2 2-2 2M11 9H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconKill = () => (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M4.5 4.5l3 3M7.5 4.5l-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M4 9.5h4M5 9.5V11M7 9.5V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

const IconBan = () => (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2.8 2.8l6.4 6.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

const IconTeleport = () => (
    <svg width="12" height="13" viewBox="0 0 11 12" fill="none">
        <path d="M5.5 1C3.567 1 2 2.567 2 4.5c0 2.5 3.5 6.5 3.5 6.5s3.5-4 3.5-6.5C9 2.567 7.433 1 5.5 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="5.5" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="1.1" />
    </svg>
);

/* ── Кнопка действия с тултипом ───────────────────────────────────── */

type ActionButtonProps = {
    onClick?: () => void;
    label: string;
    color: string;
    children: React.ReactNode;
};

const ActionButton = ({ onClick, label, color, children }: ActionButtonProps) => (
    <div className="group/btn relative">
        {/* Тултип над кнопкой */}
        <span
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[5px] px-6 py-3 text-[9px] font-medium opacity-0 transition-opacity duration-150 group-hover/btn:opacity-100"
            style={{
                bottom: 'calc(100% + 5px)',
                backgroundColor: 'rgba(5, 12, 22, 0.92)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(220, 228, 240, 0.9)',
            }}
        >
            {label}
        </span>

        <button
            type="button"
            onClick={onClick}
            className="flex shrink-0 items-center justify-center rounded-[6px] opacity-0 transition-all duration-150 group-hover:opacity-100 group-hover/btn:opacity-100 hover:-translate-y-[2px]"
            style={{
                width: 26,
                height: 26,
                cursor: 'pointer',
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color,
                boxShadow: 'none',
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
            }}
        >
            {children}
        </button>
    </div>
);

/* ── Компонент ────────────────────────────────────────────────────── */

export const AdminPlayerRow = ({
    player,
    showDivider = true,
    onKickFromSquad,
    onKill,
    onBan,
    onCopyTeleport,
}: AdminPlayerRowProps) => {
    const resolvedIcon = player.kitIcon ?? resolveKitIcon(player.role ?? '');
    const iconSize = resolveKitIconSize(player.role ?? '');

    return (
        <div
            className="group flex h-[36px] items-center gap-8 px-12"
            style={showDivider ? { borderBottom: '1px solid var(--at-border-content)' } : undefined}
        >
            {/* Иконка кита */}
            <span className="flex size-[22px] shrink-0 items-center justify-center">
                <Image
                    src={resolvedIcon}
                    alt=""
                    aria-hidden="true"
                    width={iconSize.width}
                    height={iconSize.height}
                    unoptimized
                    className="block h-auto w-auto"
                />
            </span>

            {/* Клантег + ник */}
            <div className="flex min-w-0 flex-1 items-center gap-6">
                {player.clanTag && (
                    <span
                        className="shrink-0 text-[10px]"
                        style={{ color: 'var(--at-text-section)' }}
                    >
                        {player.clanTag}
                    </span>
                )}
                <span
                    className="truncate text-[11px] font-bold"
                    style={{ color: 'var(--at-text-nav)' }}
                >
                    {player.nickname}
                </span>
            </div>

            {/* Кнопки управления — появляются при наведении на строку */}
            <div className="flex shrink-0 items-center gap-4">
                <ActionButton
                    label="Кикнуть из сквада"
                    color="var(--at-text-icon)"
                    onClick={onKickFromSquad}
                >
                    <IconKick />
                </ActionButton>
                <ActionButton
                    label="Убить"
                    color="rgba(220, 70, 70, 0.9)"
                    onClick={onKill}
                >
                    <IconKill />
                </ActionButton>
                <ActionButton
                    label="Забанить"
                    color="rgba(210, 140, 40, 0.9)"
                    onClick={onBan}
                >
                    <IconBan />
                </ActionButton>
                <ActionButton
                    label="Телепорт"
                    color="rgba(60, 150, 230, 0.9)"
                    onClick={onCopyTeleport}
                >
                    <IconTeleport />
                </ActionButton>
            </div>
        </div>
    );
};
