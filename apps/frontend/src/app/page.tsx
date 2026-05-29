import { getServers, getCurrentMap, getServerState, getFractions, getTopStats } from 'shared/api';
import { Button, ButtonAppearance, ButtonSize, ButtonVariant } from 'shared/ui';
import { CurrentMap } from 'widgets/CurrentMap';
import { FractionCompositeCard } from 'widgets/FractionCompositeCard';
import { Jumbo } from 'widgets/Jumbo';
import { ServerInfo } from 'widgets/ServerInfo';
import { ServerState } from 'widgets/ServerState';
import { ServerStatusCards } from 'widgets/ServerStatusCards';
import { Stats } from 'widgets/Stats';

export default async function Home() {
  const [servers, currentMap, serverState, fractions, stats] = await Promise.all([
    getServers(),
    getCurrentMap(),
    getServerState(),
    getFractions(),
    getTopStats(),
  ]);

  const [fraction1, fraction2] = fractions;

  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* ── Jumbo (full-width hero) ─────────────────────────────── */}
      <Jumbo backgroundSrc="/images/jumbo-bg.png" discordUrl="#" vipUrl="#" />

      {/* ── Servers status ──────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-1440 px-72 pt-60 pb-39">
        <ServerStatusCards servers={servers} />
        <div className="mt-26 h-px bg-fraction-composite-divider" />
        <div className="mt-30 flex items-center justify-between">
          <CurrentMap mapName={currentMap.mapName} imageSrc={currentMap.imageSrc} />
          <ServerState
            level={serverState.level}
            hoursAmount={serverState.hoursAmount}
            openProfilePercentages={serverState.openProfilePercentages}
          />
          <Button
            variant={ButtonVariant.Primary}
            appearance={ButtonAppearance.Positive}
            size={ButtonSize.L}
            className="w-306"
          >
            Подключиться
          </Button>
        </div>
      </div>

      {/* ── Players table ───────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-1440 px-72 pt-48 pb-80">
        <ServerInfo
          badge="Invasion"
          title="#1 Protocol Squad"
          mapName={currentMap.mapName}
          className="ml-20"
        />
        <div className="mt-36 flex gap-24">
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
      <Stats title={stats.title} dateRange={stats.dateRange} cards={stats.cards} />
    </main>
  );
}
