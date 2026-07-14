'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Mail01Icon, ArrowHorizontalIcon, EraserIcon, Cancel01Icon, SquareLock02Icon, SquareUnlock02Icon } from '@hugeicons/core-free-icons';
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
	embedded?: boolean;
	onKickFromSquad?: (playerId: string) => void;
	onKill?: (playerId: string) => void;
	onBan?: (steamId: SteamId, nickname: string) => void;
	onCopyTeleport?: (playerId: string) => void;
	onMessageSquad?: (squadId: string | number) => void;
	onSwitchSide?: (squadId: string | number) => void;
	onClearName?: (squadId: string | number) => void;
	onDisbandSquad?: (squadId: string | number) => void;
};

// Кнопка действия отряда

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

// Карточка отряда

export const AdminSquadCard = ({
	squad,
	embedded = false,
	onKickFromSquad,
	onKill,
	onBan,
	onCopyTeleport,
	onMessageSquad,
	onSwitchSide,
	onClearName,
	onDisbandSquad,
}: AdminSquadCardProps) => {
	const header = (
		<div className="group">
			<div
				className="flex h-44 items-center gap-8 px-14"
				style={squad.players.length > 0 ? { borderBottom: '1px solid var(--at-border-content)' } : undefined}
			>
				<span
					className="shrink-0 text-[15px] font-bold leading-none"
					style={{ color: 'var(--at-text-server)', fontFamily: 'Oswald, sans-serif' }}
				>
					{squad.number}
				</span>
				<span className="flex-1 truncate text-(--at-text-base)" style={{ color: 'var(--at-text-nav)' }}>
					{squad.name}
				</span>

				{/* Кнопки действий */}
				<div className="flex items-center gap-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
					<ActionButton label="Сообщение" color="var(--at-text-icon)" onClick={() => onMessageSquad?.(squad.id)}>
						<HugeiconsIcon icon={Mail01Icon} size={16} color="currentColor" strokeWidth={1.8} />
					</ActionButton>
					<ActionButton label="Сменить сторону" color="rgba(60, 150, 230, 0.9)" onClick={() => onSwitchSide?.(squad.id)}>
						<HugeiconsIcon icon={ArrowHorizontalIcon} size={16} color="currentColor" strokeWidth={1.8} />
					</ActionButton>
					<ActionButton label="Удалить название" color="rgba(210, 140, 40, 0.9)" onClick={() => onClearName?.(squad.id)}>
						<HugeiconsIcon icon={EraserIcon} size={16} color="currentColor" strokeWidth={1.8} />
					</ActionButton>
					<ActionButton label="Расформировать" color="rgba(220, 70, 70, 0.9)" onClick={() => onDisbandSquad?.(squad.id)}>
						<HugeiconsIcon icon={Cancel01Icon} size={16} color="currentColor" strokeWidth={1.8} />
					</ActionButton>
				</div>

				<span
					className="flex size-[30px] shrink-0 items-center justify-center rounded-[7px]"
					style={{
						backgroundColor: 'var(--at-bg-tab-active)',
						border: '1px solid var(--at-border-tab-active)',
						color: squad.isLocked ? 'var(--at-status-offline)' : 'var(--at-text-section)',
					}}
				>
					{squad.isLocked
						? <HugeiconsIcon icon={SquareLock02Icon} size={15} color="currentColor" strokeWidth={1.5} />
						: <HugeiconsIcon icon={SquareUnlock02Icon} size={15} color="currentColor" strokeWidth={1.5} />
					}
				</span>
				<span
					className="flex h-[30px] shrink-0 items-center justify-center rounded-[7px] px-8 text-[13px] font-bold tabular-nums"
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
		</div>
	);

	const players = squad.players.length > 0 ? (
		<ul className="m-0 list-none p-0">
			{squad.players.map((player, idx) => (
				<li key={player.id}>
					<AdminPlayerRow
						player={player}
						showDivider={idx < squad.players.length - 1}
						onKickFromSquad={() => onKickFromSquad?.(player.id)}
						onKill={() => onKill?.(player.id)}
						onBan={() => onBan?.(player.steamId, player.nickname)}
						onCopyTeleport={() => onCopyTeleport?.(player.id)}
					/>
				</li>
			))}
		</ul>
	) : null;

	if (embedded) return (
		<div
			className="relative z-0 rounded-[10px] transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:z-10 hover:shadow-[0_8px_24px_rgba(0,60,160,0.28),0_0_0_1px_var(--at-border-active)]"
			style={{ border: '1px solid var(--at-border)' }}
		>
			{/* Фон — обрезает углы, не перекрывает тултипы */}
			<div
				className="pointer-events-none absolute inset-0 overflow-hidden rounded-[9px]"
				style={{ backgroundColor: 'var(--at-bg-content)' }}
			/>
			{/* Контент */}
			<div className="relative">
				{header}
				{players}
			</div>
		</div>
	);

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
			{header}
			{players}
		</div>
	);
};
