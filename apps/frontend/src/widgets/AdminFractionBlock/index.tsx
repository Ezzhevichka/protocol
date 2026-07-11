'use client';

import { AdminFactionCard } from 'widgets/AdminFactionCard';
import type { AdminFactionCardStats } from 'widgets/AdminFactionCard';
import { AdminSquadList } from 'widgets/AdminSquadList';
import type { AdminSquad, AdminSquadPlayer } from 'widgets/AdminSquadList';

/* ── Типы ─────────────────────────────────────────────────────────── */

export type AdminFractionBlockProps = {
	teamId: string;
	playerCount: number;
	backgroundSrc?: string;
	stats?: AdminFactionCardStats;
	squads: AdminSquad[];
	unassigned?: AdminSquadPlayer[];
	onKickFromSquad?: (playerId: string) => void;
	onKill?: (playerId: string) => void;
	onBan?: (playerId: string) => void;
	onCopyTeleport?: (playerId: string) => void;
	onMessageSquad?: (squadId: string | number) => void;
	onSwitchSide?: (squadId: string | number) => void;
	onClearName?: (squadId: string | number) => void;
	onDisbandSquad?: (squadId: string | number) => void;
};

/* ── Компонент ────────────────────────────────────────────────────── */

export const AdminFractionBlock = ({
	teamId,
	playerCount,
	backgroundSrc,
	stats,
	squads,
	unassigned,
	onKickFromSquad,
	onKill,
	onBan,
	onCopyTeleport,
	onMessageSquad,
	onSwitchSide,
	onClearName,
	onDisbandSquad,
}: AdminFractionBlockProps) => (
	<div
		className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[14px]"
		style={{
			backgroundColor: 'var(--at-glass-bg)',
			border: '1px solid var(--at-glass-border)',
			backdropFilter: 'var(--at-glass-blur)',
			WebkitBackdropFilter: 'var(--at-glass-blur)',
			boxShadow: 'var(--at-glass-shadow)',
		}}
	>
		<AdminFactionCard
			teamId={teamId}
			playerCount={playerCount}
			backgroundSrc={backgroundSrc}
			stats={stats}
			embedded
		/>

		<div style={{ borderTop: '1px solid var(--at-border-section)' }} />

		{/* Список сквадов — кастомный тонкий скроллбар */}
		<div className="at-scroll flex-1 min-h-0">
			<AdminSquadList
				squads={squads}
				unassigned={unassigned}
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
		</div>
	</div>
);
