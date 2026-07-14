'use client';

import { useState } from 'react';
import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserMinus01Icon, UserRemove01Icon, LegalHammerIcon, Location01Icon, Tick02Icon } from '@hugeicons/core-free-icons';

import { resolveKitIcon, resolveKitIconSize } from 'shared/constants';

/* ── Типы ─────────────────────────────────────────────────────────── */

export type AdminPlayerRowData = {
	id: string;
	steamId: string;
	nickname: string;
	clanTag?: string;
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

/* ── Кнопка действия ─────────────────────────────────────────────── */

type ActionButtonProps = {
	onClick?: () => void;
	label: string;
	color: string;
	children: React.ReactNode;
};

const ActionButton = ({ onClick, label, color, children }: ActionButtonProps) => (
	<div className="group/btn relative">
		<button
			type="button"
			onClick={onClick}
			className="flex items-center justify-center rounded-[7px] px-8 py-4 transition-opacity duration-150"
			style={{
				color,
				backgroundColor: 'var(--at-bg-tab-active)',
				border: '1px solid var(--at-border-tab-active)',
				cursor: 'pointer',
				opacity: 0.75,
			}}
			onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
			onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.75'; }}
		>
			{children}
		</button>
		<span
			className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-6 -translate-x-1/2 whitespace-nowrap rounded-[5px] px-7 py-3 text-[10px] font-medium opacity-0 transition-opacity duration-150 group-hover/btn:opacity-100"
			style={{
				backgroundColor: 'var(--at-bg-tooltip)',
				border: '1px solid rgba(255,255,255,0.08)',
				color: 'rgba(255,255,255,0.85)',
				boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
			}}
		>
			{label}
		</span>
	</div>
);

/* ── Кнопка телепорта ────────────────────────────────────────────── */

const TeleportButton = ({ onClick }: { onClick?: () => void }) => {
	const [copied, setCopied] = useState(false);

	const handleClick = () => {
		if (copied) return;
		onClick?.();
		setCopied(true);
	};

	const handleMouseLeave = () => {
		setCopied(false);
	};

	return (
		<div className="group/btn relative">
			<button
				type="button"
				onClick={handleClick}
				className="flex items-center justify-center rounded-[7px] px-8 py-4 transition-opacity duration-150"
				style={{
					color: copied ? 'rgba(60, 200, 100, 0.9)' : 'rgba(60, 150, 230, 0.9)',
					backgroundColor: 'var(--at-bg-tab-active)',
					border: '1px solid var(--at-border-tab-active)',
					cursor: 'pointer',
					opacity: 0.75,
				}}
				onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
				onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.75'; handleMouseLeave(); }}
			>
				<HugeiconsIcon
					icon={copied ? Tick02Icon : Location01Icon}
					size={14}
					color="currentColor"
					strokeWidth={1.8}
				/>
			</button>
			<span
				className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-6 -translate-x-1/2 whitespace-nowrap rounded-[5px] px-7 py-3 text-[10px] font-medium opacity-0 transition-opacity duration-150 group-hover/btn:opacity-100"
				style={{
					backgroundColor: 'var(--at-bg-tooltip)',
					border: '1px solid var(--at-border)',
					color: 'var(--at-text-nav)',
					boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
				}}
			>
				{copied ? 'Скопировано!' : 'Телепорт'}
			</span>
		</div>
	);
};

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
			className="group relative cursor-pointer transition-colors duration-150 hover:bg-white/[0.04]"
			style={showDivider ? { borderBottom: '1px solid var(--at-border-content)' } : undefined}
		>
			<div className="flex h-44 items-center gap-10 px-14">
				<span className="flex size-22 shrink-0 items-center justify-center">
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

				<div className="flex min-w-0 flex-1 items-center gap-6">
					{player.clanTag && (
						<span className="shrink-0 text-(--at-text-md)" style={{ color: 'var(--at-text-section)' }}>
							{player.clanTag}
						</span>
					)}
					<span className="truncate text-(--at-text-base) font-bold" style={{ color: 'var(--at-text-nav)' }}>
						{player.nickname}
					</span>
				</div>

				{/* Кнопки — появляются в строке при наведении */}
				<div className="flex items-center gap-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
					<ActionButton label="Кикнуть" color="var(--at-text-icon)" onClick={onKickFromSquad}>
						<HugeiconsIcon icon={UserMinus01Icon} size={14} color="currentColor" strokeWidth={1.8} />
					</ActionButton>
					<ActionButton label="Убить" color="rgba(220, 70, 70, 0.9)" onClick={onKill}>
						<HugeiconsIcon icon={UserRemove01Icon} size={14} color="currentColor" strokeWidth={1.8} />
					</ActionButton>
					<ActionButton label="Наказать" color="rgba(210, 140, 40, 0.9)" onClick={onBan}>
						<HugeiconsIcon icon={LegalHammerIcon} size={14} color="currentColor" strokeWidth={1.8} />
					</ActionButton>
					<TeleportButton onClick={onCopyTeleport} />
				</div>
			</div>
		</div>
	);
};
