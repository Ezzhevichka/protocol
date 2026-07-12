import { getServers, getServerPlayers, getMe } from 'shared/api';
import type { LiveTeam } from 'shared/api';
import { parseKitFromRole } from 'shared/lib';
import { AdminPlayersSection } from 'widgets/AdminPlayersSection';
import type { AdminSquad, AdminSquadPlayer } from 'widgets/AdminSquadList';
import { AdminQueueCard } from 'widgets/AdminQueueCard';
import { AdminDisconnectedCard } from 'widgets/AdminDisconnectedCard';
import { AdminChatCard } from 'widgets/AdminChatCard';
import { AdminMapCard } from 'widgets/AdminMapCard';
import { HugeiconsIcon } from '@hugeicons/react';
import { Leaf03Icon } from '@hugeicons/core-free-icons';

export const dynamic = 'force-dynamic';

function buildAdminSquads(team: LiveTeam | undefined): AdminSquad[] {
	if (!team) return [];

	return team.squads.map((s, idx) => ({
		id: s.squad.squadId,
		number: idx + 1,
		name: s.squad.name,
		isLocked: s.squad.locked,
		maxPlayers: 9,
		players: s.players
			.slice()
			.sort((a, b) => (b.raw?.isLeader ? 1 : 0) - (a.raw?.isLeader ? 1 : 0))
			.map((p): AdminSquadPlayer => ({
				id: p.steamId || p.eosId,
				steamId: p.steamId,
				nickname: p.name,
				role: parseKitFromRole(p.raw?.role),
				isLeader: p.raw?.isLeader ?? false,
			})),
	}));
}

function buildAdminUnassigned(team: LiveTeam | undefined): AdminSquadPlayer[] {
	if (!team) return [];

	return team.unassigned.map((p): AdminSquadPlayer => ({
		id: p.steamId || p.eosId,
		steamId: p.steamId,
		nickname: p.name,
		role: parseKitFromRole(p.raw?.role),
	}));
}

type AdminPageProps = {
	searchParams: Promise<{ server?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
	const { server: serverParam } = await searchParams;

	const test = await getMe();

	let serverId: Nullable<string> = null;
	if (serverParam) {
		serverId = serverParam;
	} else {
		const servers = await getServers();
		const first = servers.find((s) => s.state !== 'disabled') ?? servers[0];
		serverId = first?.id ? String(first.id) : null;
	}

	const playersData = serverId ? await getServerPlayers(serverId) : null;

	const team1 = playersData?.teams[0];
	const team2 = playersData?.teams[1];

	const squads1 = buildAdminSquads(team1);
	const squads2 = buildAdminSquads(team2);
	const unassigned1 = buildAdminUnassigned(team1);
	const unassigned2 = buildAdminUnassigned(team2);

	const playerCount1 = team1?.playersCount ?? 0;
	const playerCount2 = team2?.playersCount ?? 0;

	return (
		<main className="flex flex-1 gap-16 px-20 pb-20 min-h-0">
			{/* Левая часть: блоки фракций */}
			<div className="flex flex-[7] gap-16 min-h-0 min-w-0">
				{playersData && playersData.playersCount > 0 ? (
					<AdminPlayersSection
						serverId={serverId}
						userId={test?.steamId ?? null}
						team1={{ teamId: team1?.teamId ?? '', playerCount: playerCount1, squads: squads1, unassigned: unassigned1 }}
						team2={{ teamId: team2?.teamId ?? '', playerCount: playerCount2, squads: squads2, unassigned: unassigned2 }}
					/>
				) : (
					<div
						className="flex flex-1 flex-col items-center justify-center gap-14 rounded-2xl"
						style={{
							backgroundColor: 'var(--at-glass-bg)',
							border: '1px solid var(--at-glass-border)',
							backdropFilter: 'var(--at-glass-blur)',
							WebkitBackdropFilter: 'var(--at-glass-blur)',
							boxShadow: 'var(--at-glass-shadow)',
						}}
					>
						<div
							className="flex size-56 items-center justify-center rounded-2xl"
							style={{
								backgroundColor: 'rgba(40, 160, 80, 0.1)',
								border: '1px solid rgba(40, 160, 80, 0.2)',
							}}
						>
							<HugeiconsIcon icon={Leaf03Icon} size={26} color="rgba(40,180,90,0.85)" strokeWidth={1.5} />
						</div>
						<div className="flex flex-col items-center gap-4">
							<p className="text-[14px] font-semibold" style={{ color: 'var(--at-text-nav)' }}>
								На сервере сейчас пусто
							</p>
							<p className="text-[12px]" style={{ color: 'var(--at-text-section)' }}>
								Идёт SEED
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Правая часть: 4 виджета в столбик */}
			<div className="flex flex-[3] min-w-0 min-h-0 flex-col gap-12 overflow-y-auto">
				<AdminQueueCard queueCount={playersData?.queueCount ?? 0} />
				<AdminDisconnectedCard />
				<AdminChatCard />
				<AdminMapCard
					layerName={playersData?.currentLayer}
					nextLayerName={playersData?.nextLayer}
				/>
			</div>
		</main>
	);
}
