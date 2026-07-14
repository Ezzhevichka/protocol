'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { UserQuestion01Icon } from '@hugeicons/core-free-icons';
import { AdminSquadCard } from 'widgets/AdminSquadCard';
import type { AdminSquadCardData } from 'widgets/AdminSquadCard';
import { AdminPlayerRow } from 'widgets/AdminPlayerRow';
import type { AdminPlayerRowData } from 'widgets/AdminPlayerRow';

export type { AdminSquadCardData as AdminSquad, AdminPlayerRowData as AdminSquadPlayer };

export type AdminSquadListProps = {
	squads: AdminSquadCardData[];
	unassigned?: AdminPlayerRowData[];
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

type UnassignedSectionProps = {
	players: AdminPlayerRowData[];
	headerBg?: string;
	onKickFromSquad?: (playerId: string) => void;
	onKill?: (playerId: string) => void;
	onBan?: (steamId: SteamId, nickname: string) => void;
	onCopyTeleport?: (playerId: string) => void;
};

const UnassignedSection = (
	{ players, headerBg, onKickFromSquad, onKill, onBan, onCopyTeleport }: UnassignedSectionProps
) => (
	<>
		<div
			className="flex h-46 items-center gap-8 px-14"
			style={{
				borderBottom: players.length > 0 ? '1px solid var(--at-border-content)' : undefined,
				backgroundColor: headerBg,
			}}
		>
			<span style={{ color: 'var(--at-text-section)' }}>
				<HugeiconsIcon icon={UserQuestion01Icon} size={16} color="currentColor" strokeWidth={1.5} />
			</span>
			<span className="flex-1 text-[11px]" style={{ color: 'var(--at-text-section)' }}>
				Нераспределённые игроки
			</span>
			<span
				className="flex items-center justify-center rounded-[7px] px-8 py-4 text-[9px] font-bold tabular-nums"
				style={{
					backgroundColor: 'var(--at-bg-tab-active)',
					border: '1px solid var(--at-border-tab-active)',
					color: 'var(--at-text-nav-active)',
					boxShadow: '0 0 8px rgba(0,60,160,0.25)',
				}}
			>
				{players.length}
			</span>
		</div>
		<ul className="m-0 list-none p-0">
			{players.map((player, idx) => (
				<li key={player.id}>
					<AdminPlayerRow
						player={player}
						showDivider={idx < players.length - 1}
						onKickFromSquad={() => onKickFromSquad?.(player.id)}
						onKill={() => onKill?.(player.id)}
						onBan={() => onBan?.(player.steamId, player.nickname)}
						onCopyTeleport={() => onCopyTeleport?.(player.id)}
					/>
				</li>
			))}
		</ul>
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
	onMessageSquad,
	onSwitchSide,
	onClearName,
	onDisbandSquad,
}: AdminSquadListProps) => {
	const hasUnassigned = unassigned.length > 0;

	if (embedded) {
		return (
			<ul className="m-0 flex list-none flex-col gap-8 p-10 pt-32">
				{squads.map((squad) => (
					<li key={squad.id}>
						<AdminSquadCard
							squad={squad}
							embedded
							onKickFromSquad={onKickFromSquad}
							onKill={onKill}
							onBan={onBan}
							onCopyTeleport={onCopyTeleport}
							onMessageSquad={onMessageSquad}
							onSwitchSide={onSwitchSide}
							onClearName={onClearName}
							onDisbandSquad={onDisbandSquad}
						/>
					</li>
				))}
				{hasUnassigned && (
					<li
						className="overflow-hidden rounded-[10px]"
						style={{
							backgroundColor: 'var(--at-bg-content)',
							border: '1px solid var(--at-border)',
						}}
					>
						<UnassignedSection
							players={unassigned}
							onKickFromSquad={onKickFromSquad}
							onKill={onKill}
							onBan={onBan}
							onCopyTeleport={onCopyTeleport}
						/>
					</li>
				)}
			</ul>
		);
	}

	return (
		<ul className="m-0 flex list-none flex-col gap-8 p-0">
			{squads.map((squad) => (
				<li key={squad.id}>
					<AdminSquadCard
						squad={squad}
						onKickFromSquad={onKickFromSquad}
						onKill={onKill}
						onBan={onBan}
						onCopyTeleport={onCopyTeleport}
					/>
				</li>
			))}
			{hasUnassigned && (
				<li
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
				</li>
			)}
		</ul>
	);
};
