import Image from 'next/image';
import { Text } from 'shared/ui';

import type { StatCardData, StatsProps } from './model';

const STATS_COLORS = {
    title: '#FAFAFA',
    dateRange: '#CCCCCC',
    cardTitle: '#FFFFFF',
    playerText: '#FAFAFA',
    playerHours: '#FAFAFA',
    rankText: '#FAFAFA',
    divider: 'var(--player-card-divider, #142438)',
} as const;

const StatCard = ({ iconSrc, title, players }: StatCardData) => (
    <div className="flex flex-1 flex-col items-center gap-16 rounded-lg p-10">
        {/* Icon + title — centered */}
        <div className="flex shrink-0 items-center gap-8">
            <span className="relative h-30 w-30 shrink-0">
                <Image
                    src={iconSrc}
                    alt=""
                    aria-hidden="true"
                    fill
                    unoptimized
                    className="object-contain"
                />
            </span>
            <Text
                as="p"
                weight="semibold"
                className="font-manrope text-[20px] leading-32 tracking-[0.4px] whitespace-nowrap"
                style={{ color: STATS_COLORS.cardTitle }}
            >
                {title}
            </Text>
        </div>

        {/* Players list — full-width */}
        <div className="flex w-full flex-col items-start gap-4 px-10">
            {players.map((player) => (
                <div
                    key={player.rank}
                    className="flex w-full items-center gap-14 px-10 py-12"
                    style={{ borderBottom: `1px solid ${STATS_COLORS.divider}` }}
                >
                    {/* Left: rank + nickname */}
                    <div className="flex flex-1 flex-row items-center self-stretch">
                        <div className="flex flex-1 items-center gap-8 min-w-260">
                            <span className="shrink-0 rounded px-10 py-2">
                                <Text
                                    as="span"
                                    size="sm"
                                    weight="medium"
                                    className="font-manrope leading-16 tracking-[0.28px] whitespace-nowrap"
                                    style={{ color: STATS_COLORS.rankText }}
                                >
                                    #{player.rank}
                                </Text>
                            </span>
                            <Text
                                as="p"
                                size="base"
                                weight="normal"
                                className="flex-1 font-manrope leading-22"
                                style={{ color: STATS_COLORS.playerText }}
                            >
                                {player.nickname}
                            </Text>
                        </div>
                    </div>

                    {/* Right: hours */}
                    <div className="flex flex-1 items-center max-w-70 min-w-60">
                        <Text
                            as="p"
                            size="base"
                            weight="medium"
                            className="flex-1 font-manrope leading-22"
                            style={{ color: STATS_COLORS.playerHours }}
                        >
                            {player.hoursText}
                        </Text>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const Stats = ({
    title = 'Топ игроков за неделю',
    dateRange,
    cards,
    className = '',
}: StatsProps) => {
    const rows: StatCardData[][] = [];
    for (let i = 0; i < cards.length; i += 3) {
        rows.push(cards.slice(i, i + 3));
    }

    return (
        <section className={`w-full px-72 pt-60 pb-326 ${className}`}>
            <div className="mb-46 flex items-center gap-16">
                <Text
                    as="h2"
                    weight="semibold"
                    className="font-manrope text-[24px] leading-36 whitespace-nowrap"
                    style={{ color: STATS_COLORS.title }}
                >
                    {title}
                </Text>
                {dateRange && (
                    <Text
                        as="span"
                        weight="semibold"
                        className="font-manrope text-[20px] leading-32 tracking-[0.4px] whitespace-nowrap"
                        style={{ color: STATS_COLORS.dateRange }}
                    >
                        {dateRange}
                    </Text>
                )}
            </div>

            <div className="flex flex-col gap-24">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-start gap-24">
                        {row.map((card, cardIndex) => (
                            <StatCard key={card.id ?? `${rowIndex}-${cardIndex}`} {...card} />
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
};
