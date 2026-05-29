import { getServers, getServerPlayers, getServerState, getTopStats } from 'shared/api';
import type { LiveTeam } from 'shared/api';
import { resolveFactionFlag, resolveFactionName, parseKitFromRole } from 'shared/lib';
import { FractionCompositeCard } from 'widgets/FractionCompositeCard';
import { Jumbo } from 'widgets/Jumbo';
import { ServerSection } from 'widgets/ServerSection';
import { Stats } from 'widgets/Stats';

function buildFraction(teamId: string | undefined, team: LiveTeam | undefined) {
    const squadsPlayers = team?.squads.flatMap((s) => s.players) ?? [];
    const unassigned = team?.unassigned ?? [];

    return {
        fractionName: resolveFactionName(teamId),
        flag: resolveFactionFlag(teamId) ?? '/flags/RGFFlag.webp',
        playersAmount: squadsPlayers.length + unassigned.length,
        hoursAmount: 0,
        squads: team?.squads.map((s, i) => ({
            id: i,
            squadNumber: s.squad.squadId,
            squadName: s.squad.name,
            playersInSquad: s.players.length,
            isOpen: !s.squad.locked,
            hasCmd: false,
            players: s.players.map((p, pi) => ({
                id: pi,
                nickname: p.name,
                kitName: parseKitFromRole(p.raw?.role),
                role: parseKitFromRole(p.raw?.role),
            })),
        })) ?? [],
        notSquadPlayers: unassigned.map((p, i) => ({
            id: i,
            nickname: p.name,
            kitName: parseKitFromRole(p.raw?.role),
            role: parseKitFromRole(p.raw?.role),
        })),
    };
}

export default async function Home() {
    const [servers, serverState, stats] = await Promise.all([
        getServers(),
        getServerState(),
        getTopStats(),
    ]);

    const firstServer = servers[0];
    const playersData = firstServer ? await getServerPlayers(firstServer.id as number) : null;

    const fraction1 = buildFraction(firstServer?.teamOne, playersData?.teams[0]);
    const fraction2 = buildFraction(firstServer?.teamTwo, playersData?.teams[1]);

    return (
        <main className="relative flex min-h-screen flex-col">
            <img
                src="/images/jumbo-bg.png"
                alt=""
                aria-hidden="true"
                className="fixed inset-0 h-full w-full object-cover -z-10"
            />
            <div className="fixed inset-0 -z-10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }} />

            {/* ── Jumbo ────────────────────────────────────────────── */}
            <Jumbo discordUrl="#" vipUrl="#" />

            {/* ── Servers ──────────────────────────────────────────── */}
            <div className="relative z-10 mx-auto w-full max-w-1440 px-72 pb-39 -mt-40">
                <ServerSection servers={servers} serverState={serverState} />
            </div>

            {/* ── Players ──────────────────────────────────────────── */}
            <div className="mx-auto w-full max-w-1440 px-72 pt-48 pb-80">
                <div className="flex gap-24">
                    <FractionCompositeCard {...fraction1} />
                    <FractionCompositeCard {...fraction2} />
                </div>
            </div>

            {/* ── Stats ────────────────────────────────────────────── */}
            <Stats
                title={stats.title}
                dateRange={stats.dateRange}
                cards={stats.cards}
            />
        </main>
    );
}
