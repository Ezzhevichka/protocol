import { Text } from 'shared/ui';
import { Fraction } from 'widgets/Fraction';
import { FractionCardHead } from 'widgets/FractionCardHead';
import { PlayerCard } from 'widgets/PlayerCard';
import { SquadCard } from 'widgets/SquadCard';

import type { FractionCompositeCardProps } from './model';

const FRACTION_COMPOSITE_COLORS = {
    background: 'var(--fraction-composite-bg, #04070B)',
    sectionDivider: 'var(--fraction-composite-divider, #121E30)',
    notSquadTitle: 'var(--fraction-composite-title, #FFFFFF)',
} as const;

export const FractionCompositeCard = ({
    hoursAmount,
    fractionName,
    playersAmount,
    flag,
    squads,
    notSquadPlayers = [],
    className = '',
}: FractionCompositeCardProps) => {
    return (
        <section
            className={`w-636 overflow-hidden rounded-lg ${className}`}
            style={{ backgroundColor: FRACTION_COMPOSITE_COLORS.background }}
        >
            <FractionCardHead hoursAmount={hoursAmount} playersAmount={playersAmount} variant="default" />

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
                            fullWidth={true}
                        />
                    ))}
                </div>
            </div>

            <div className="flex h-166 w-full flex-col gap-16 p-20">
                <div className="flex w-full items-center gap-20">
                    <div
                        className="h-px flex-1"
                        style={{ backgroundColor: FRACTION_COMPOSITE_COLORS.sectionDivider }}
                    />
                    <Text
                        as="p"
                        size="base"
                        weight="medium"
                        className="w-149 text-center font-manrope tracking-[0.32px]"
                        style={{ color: FRACTION_COMPOSITE_COLORS.notSquadTitle }}
                    >
                        Игроки без сквада
                    </Text>
                    <div
                        className="h-px flex-1"
                        style={{ backgroundColor: FRACTION_COMPOSITE_COLORS.sectionDivider }}
                    />
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
};
