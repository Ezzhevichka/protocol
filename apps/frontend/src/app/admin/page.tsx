import { getServers, getServerPlayers } from 'shared/api';
import type { LiveTeam } from 'shared/api';
import { parseKitFromRole } from 'shared/lib';
import { AdminFractionBlock } from 'widgets/AdminFractionBlock';
import type { AdminSquad, AdminSquadPlayer } from 'widgets/AdminSquadList';

function buildAdminSquads(team: LiveTeam | undefined): AdminSquad[] {
    if (!team) return [];

    return team.squads.map((s, idx) => ({
        id: s.squad.squadId,
        number: idx + 1,
        name: s.squad.name,
        isLocked: s.squad.locked,
        maxPlayers: 9,
        players: s.players.map((p): AdminSquadPlayer => ({
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

    // Без явного выбора — берём первый доступный сервер
    let serverId: number | undefined;
    if (serverParam) {
        serverId = Number(serverParam);
    } else {
        const servers = await getServers();
        const first = servers.find((s) => s.state !== 'disabled') ?? servers[0];
        serverId = typeof first?.id === 'number' ? first.id : undefined;
    }

    const playersData = serverId ? await getServerPlayers(serverId) : null;

    const team1 = playersData?.teams[0];
    const team2 = playersData?.teams[1];

    const squads1 = buildAdminSquads(team1);
    const squads2 = buildAdminSquads(team2);
    const unassigned1 = buildAdminUnassigned(team1);
    const unassigned2 = buildAdminUnassigned(team2);

    const playerCount1 = squads1.reduce((n, s) => n + s.players.length, 0) + unassigned1.length;
    const playerCount2 = squads2.reduce((n, s) => n + s.players.length, 0) + unassigned2.length;

    return (
        <main className="flex flex-col gap-20 px-20 pb-20">
            {playersData ? (
                <div className="flex gap-16 min-h-0">
                    <AdminFractionBlock
                        teamId={team1?.teamId ?? ''}
                        playerCount={playerCount1}
                        squads={squads1}
                        unassigned={unassigned1}
                    />
                    <AdminFractionBlock
                        teamId={team2?.teamId ?? ''}
                        playerCount={playerCount2}
                        squads={squads2}
                        unassigned={unassigned2}
                    />
                </div>
            ) : (
                <p className="text-[13px]" style={{ color: 'var(--at-text-section)' }}>
                    Нет данных о игроках — сервер недоступен или пуст.
                </p>
            )}
        </main>
    );
}
