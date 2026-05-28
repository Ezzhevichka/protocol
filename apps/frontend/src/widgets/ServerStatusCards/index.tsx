import Image from 'next/image';

import { mapServersToSlots, resolveServerBySlot, SERVER_SLOTS } from './lib';
import type { ServerStatusCardsProps, ServerStatusState } from './model';

const CARD_STATE_STYLES: Record<
    ServerStatusState,
    {
        cardBackground: string;
        cardBorder: string;
        dotColor: string;
        textColor: string;
        badgeBackground: string;
        badgeText: string;
        playersIcon: string;
    }
> = {
    default: {
        cardBackground: 'rgba(255, 255, 255, 0.05)',
        cardBorder: '1px solid rgba(255,255,255,0.08)',
        dotColor: '#00FF90',
        textColor: '#FAFAFA',
        badgeBackground: 'rgba(180,130,50,0.2)',
        badgeText: '#C9A84C',
        playersIcon: '/general/fraction_people.svg',
    },
    pressed: {
        cardBackground: 'rgba(255, 255, 255, 0.12)',
        cardBorder: '1px solid rgba(255,255,255,0.18)',
        dotColor: '#00FF90',
        textColor: '#FAFAFA',
        badgeBackground: 'rgba(180,130,50,0.2)',
        badgeText: '#C9A84C',
        playersIcon: '/general/fraction_people.svg',
    },
    disabled: {
        cardBackground: 'rgba(255, 255, 255, 0.02)',
        cardBorder: '1px solid rgba(255,255,255,0.05)',
        dotColor: '#EB1010',
        textColor: '#A1A1A1',
        badgeBackground: 'transparent',
        badgeText: '#A1A1A1',
        playersIcon: '/general/people.svg',
    },
};

export const ServerStatusCards = ({
    servers = [],
    className = '',
}: ServerStatusCardsProps) => {
    const slottedServers = mapServersToSlots(servers);

    const resolvedServers = Array.from({ length: SERVER_SLOTS }, (_, index) => {
        return resolveServerBySlot(index, slottedServers[index]);
    });

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* top highlight */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)' }}
            />

            <div className="flex w-full items-center gap-16 px-16 py-16">
                {resolvedServers.map((server) => {
                    const styles = CARD_STATE_STYLES[server.state];
                    const isDisabled = server.state === 'disabled';

                    return (
                        <button
                            key={server.key}
                            type="button"
                            disabled={isDisabled}
                            onClick={server.onClick}
                            className={`flex w-full flex-col items-start gap-8 rounded-lg px-16 py-12 text-left transition-all duration-200 ${
                                isDisabled
                                    ? 'cursor-default'
                                    : 'cursor-pointer hover:-translate-y-[3px] hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_4px_24px_rgba(0,255,144,0.08)]'
                            }`}
                            style={{
                                backgroundColor: styles.cardBackground,
                                border: styles.cardBorder,
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                            }}
                        >
                            {/* Row 1: dot + server name */}
                            <div className="flex w-full items-center gap-8">
                                <span
                                    className="size-8 shrink-0 rounded-full"
                                    style={{ backgroundColor: styles.dotColor }}
                                />
                                <span
                                    className="min-w-0 truncate text-[13px] font-medium leading-tight"
                                    style={{ color: styles.textColor }}
                                >
                                    {server.name}
                                </span>
                            </div>

                            {/* Row 2: people icon + players badge */}
                            <div className="flex items-center gap-8">
                                <Image
                                    src={styles.playersIcon}
                                    alt=""
                                    aria-hidden="true"
                                    width={16}
                                    height={11}
                                />
                                <span
                                    className="rounded px-8 py-2 text-[12px] font-medium leading-tight"
                                    style={{
                                        backgroundColor: styles.badgeBackground,
                                        color: styles.badgeText,
                                    }}
                                >
                                    {server.playersLabel}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
