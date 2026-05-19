import Image from 'next/image';
import { Text } from 'shared/ui';
import { PlayerCard } from 'widgets/PlayerCard';

import { formatSquadPlayersCount, normalizeSquadPlayers } from './lib';
import type { SquadCardProps } from './model';

const SQUAD_COLORS = {
    background: 'var(--squad-card-bg, #04070B)',
    borderDefault: 'var(--squad-card-border-default, #142438)',
    borderCmd: 'var(--squad-card-border-cmd, #997400)',
    headerBackground: 'var(--squad-card-header-bg, #152338)',
    badgeDefault: 'var(--squad-card-badge-default, #52525C)',
    badgeCmd: 'var(--squad-card-badge-cmd, #CC9B00)',
    playersBorder: 'var(--squad-card-players-border, #18181B)',
    playersBackgroundDefault: 'var(--squad-card-players-bg-default, #1D2D49)',
    playersBackgroundCmd: 'var(--squad-card-players-bg-cmd, #0E1725)',
    text: '#FAFAFA',
} as const;

export const SquadCard = ({
    playersInSquad,
    isOpen,
    hasCmd,
    cmd,
    fullWidth = false,
    players,
    squadNumber = 1,
    squadName = 'VERT',
    className = '',
}: SquadCardProps) => {
    const isCmd = cmd ?? hasCmd;
    const widthClass = fullWidth ? 'w-full' : 'w-336';
    const resolvedPlayers = normalizeSquadPlayers(players);
    const playersCountLabel = formatSquadPlayersCount(playersInSquad);
    const squadStatusIcon = isOpen ? '/general/squad_unlocked.svg' : '/general/squad_locked_red.svg';

    return (
        <div
            className={`flex ${widthClass} flex-col overflow-hidden rounded-lg border ${className}`}
            style={{
                backgroundColor: SQUAD_COLORS.background,
                borderColor: isCmd ? SQUAD_COLORS.borderCmd : SQUAD_COLORS.borderDefault,
            }}
        >
            <div
                className="flex w-full items-center justify-between rounded-tl-lg rounded-tr-lg px-10 py-8"
                style={{ backgroundColor: SQUAD_COLORS.headerBackground }}
            >
                <div className="flex min-w-0 flex-1 items-center gap-12">
                    <div
                        className="flex items-center justify-center rounded px-10 py-2"
                        style={{ backgroundColor: isCmd ? SQUAD_COLORS.badgeCmd : SQUAD_COLORS.badgeDefault }}
                    >
                        <Text
                            as="span"
                            size="sm"
                            weight="medium"
                            className="font-manrope leading-16 tracking-[0.28px]"
                            style={{ color: SQUAD_COLORS.text }}
                        >
                            {squadNumber}
                        </Text>
                    </div>

                    <Text
                        as="p"
                        size="base"
                        weight="semibold"
                        className="font-manrope leading-22"
                        style={{ color: SQUAD_COLORS.text }}
                    >
                        {squadName}
                    </Text>
                </div>

                <div className="flex shrink-0 items-center gap-14">
                    <span className="flex h-22 w-22 items-center justify-center overflow-hidden">
                        <Image
                            src={squadStatusIcon}
                            alt={isOpen ? 'Сквад открыт' : 'Сквад закрыт'}
                            width={17}
                            height={20}
                            className="h-20 w-17 object-contain"
                        />
                    </span>

                    <div
                        className="flex items-center justify-center rounded-md border px-8 py-4"
                        style={{
                            borderColor: SQUAD_COLORS.playersBorder,
                            backgroundColor: isCmd
                                ? SQUAD_COLORS.playersBackgroundCmd
                                : SQUAD_COLORS.playersBackgroundDefault,
                        }}
                    >
                        <Text
                            as="span"
                            size="sm"
                            weight="semibold"
                            className="font-manrope leading-16 tracking-[0.28px]"
                            style={{ color: SQUAD_COLORS.text }}
                        >
                            {playersCountLabel}
                        </Text>
                    </div>
                </div>
            </div>

            <ul>
                {resolvedPlayers.map((player, index) => (
                    <li key={player.id ?? `${player.nickname}-${index}`}>
                        <PlayerCard
                            kitName={player.kitName ?? player.role}
                            kitIcon={player.kitIcon}
                            nickname={player.nickname}
                            caption={player.caption}
                            role={player.role}
                            hashNumber={player.hashNumber}
                            variant="default"
                            showDivider={true}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};
