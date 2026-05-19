import { getServers, getServerState, getFractions, getTopStats } from "shared/api";
import { FractionCompositeCard } from "widgets/FractionCompositeCard";
import { Jumbo } from "widgets/Jumbo";
import { ServerSection } from "widgets/ServerSection";
import { Stats } from "widgets/Stats";

export default async function Home() {
  const [servers, serverState, fractions, stats] = await Promise.all([
    getServers(),
    getServerState(),
    getFractions(),
    getTopStats(),
  ]);

  const [fraction1, fraction2] = fractions;

  return (
    <main className="flex min-h-screen flex-col bg-background">

      {/* ── Jumbo (full-width hero) ─────────────────────────────── */}
      <Jumbo
        backgroundSrc="/images/jumbo-bg.png"
        discordUrl="#"
        vipUrl="#"
      />

      {/* ── Servers status ──────────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-1440 px-72 pb-39 -mt-40">
        <ServerSection servers={servers} serverState={serverState} />
      </div>

      {/* ── Players table ───────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-1440 px-72 pt-48 pb-80">
        <div className="flex gap-24">
          <FractionCompositeCard
            hoursAmount={fraction1.hoursAmount}
            fractionName={fraction1.fractionName}
            playersAmount={fraction1.playersAmount}
            flag={fraction1.flag}
            squads={fraction1.squads}
            notSquadPlayers={fraction1.notSquadPlayers ?? []}
          />
          <FractionCompositeCard
            hoursAmount={fraction2.hoursAmount}
            fractionName={fraction2.fractionName}
            playersAmount={fraction2.playersAmount}
            flag={fraction2.flag}
            squads={fraction2.squads}
            notSquadPlayers={fraction2.notSquadPlayers ?? []}
          />
        </div>
      </div>

      {/* ── Top players stats ────────────────────────────────────── */}
      <Stats
        title={stats.title}
        dateRange={stats.dateRange}
        cards={stats.cards}
      />
    </main>
  );
}
