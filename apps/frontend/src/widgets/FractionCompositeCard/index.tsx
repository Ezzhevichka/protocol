import { GLASS_STYLE } from 'shared/lib';
import { Text } from 'shared/ui';
import { Fraction } from 'widgets/Fraction';
import { PlayerCard } from 'widgets/PlayerCard';
import { SquadCard } from 'widgets/SquadCard';

import type { FractionCompositeCardProps } from './model';

export function FractionCompositeCard({
  hoursAmount: _hoursAmount,
  fractionName,
  playersAmount,
  flag,
  squads,
  notSquadPlayers = [],
  className = '',
}: FractionCompositeCardProps) {
  return (
    <section
      className={`w-636 overflow-hidden rounded-xl ${className}`}
      style={GLASS_STYLE}
    >
      <div className="flex w-full flex-col gap-30 p-20">
        <Fraction
          playersAmount={playersAmount}
          fractionName={fractionName}
          doctrine=""
          flag={flag}
          variant="large"
        />

        <div className="flex w-full flex-col gap-15">
          {squads.map((squad, index) => (
            <SquadCard
              key={squad.id ?? `${squad.squadName}-${index}`}
              playersInSquad={squad.playersInSquad}
              isOpen={squad.isOpen ?? true}
              hasCmd={squad.hasCmd ?? false}
              players={squad.players}
              squadNumber={squad.squadNumber}
              squadName={squad.squadName}
              fullWidth
            />
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col gap-16 p-20">
        <div className="flex w-full items-center gap-20">
          <div className="h-px flex-1 bg-white/10" />
          <Text
            as="p"
            size="base"
            weight="medium"
            className="w-149 text-center font-manrope tracking-[0.32px] text-white"
          >
            Игроки без сквада
          </Text>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid w-full grid-cols-2">
          {notSquadPlayers.map((player, index) => (
            <PlayerCard
              key={player.id ?? `${player.nickname}-${index}`}
              kitName={player.kitName ?? player.role}
              kitIcon={player.kitIcon}
              nickname={player.nickname}
              caption={player.caption}
              role={player.role}
              hashNumber={player.hashNumber}
              variant="extended"
              showDivider={false}
              className="w-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
