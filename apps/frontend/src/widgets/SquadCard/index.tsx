import Image from 'next/image';

import { Text } from 'shared/ui';
import { PlayerCard } from 'widgets/PlayerCard';

import { formatSquadPlayersCount, normalizeSquadPlayers } from './lib';

import type { SquadCardProps } from './model';

const TEXT_COLOR = '#FAFAFA';

const CMD_BG       = 'rgba(153, 116, 0, 0.08)';
const CMD_BORDER   = 'rgba(153, 116, 0, 0.35)';
const CMD_HEADER   = 'rgba(153, 116, 0, 0.12)';
const CMD_BADGE    = 'rgba(204, 155, 0, 0.3)';

const BASE_BG      = 'rgba(255, 255, 255, 0.03)';
const BASE_BORDER  = 'rgba(255, 255, 255, 0.08)';
const BASE_HEADER  = 'rgba(255, 255, 255, 0.05)';
const BASE_BADGE   = 'rgba(255, 255, 255, 0.1)';

const COUNTER_BG     = 'rgba(255, 255, 255, 0.06)';
const COUNTER_BORDER = 'rgba(255, 255, 255, 0.1)';
const INSET_SHADOW   = 'inset 0 1px 0 rgba(255,255,255,0.05)';

export function SquadCard({
  playersInSquad,
  isOpen,
  hasCmd,
  cmd,
  fullWidth = false,
  players,
  squadNumber = 1,
  squadName = 'Squad',
  className = '',
}: SquadCardProps) {
  const isCmd = cmd ?? hasCmd;
  const widthClass = fullWidth ? 'w-full' : 'w-336';
  const resolvedPlayers = normalizeSquadPlayers(players);
  const playersCountLabel = formatSquadPlayersCount(playersInSquad);
  const squadStatusIcon = isOpen ? '/general/squad_unlocked.svg' : '/general/squad_locked_red.svg';

  return (
    <><div
      className={`flex ${widthClass} flex-col overflow-hidden rounded-lg ${className}`}
      style={{
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        background: isCmd ? CMD_BG : BASE_BG,
        border: `1px solid ${isCmd ? CMD_BORDER : BASE_BORDER}`,
        boxShadow: INSET_SHADOW,
      }}
    >
      <div
        className="flex w-full items-center justify-between rounded-tl-lg rounded-tr-lg px-10 py-8"
        style={{ background: isCmd ? CMD_HEADER : BASE_HEADER }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-12">
          <div
            className="flex items-center justify-center rounded px-10 py-2"
            style={{ backgroundColor: isCmd ? CMD_BADGE : BASE_BADGE }}
          >
            <Text
              as="span"
              size="sm"
              weight="medium"
              className="font-manrope leading-16 tracking-[0.28px]"
              style={{ color: TEXT_COLOR }}
            >
              {squadNumber}
            </Text>
          </div>

          <Text
            as="p"
            size="base"
            weight="semibold"
            className="font-manrope leading-22"
            style={{ color: TEXT_COLOR }}
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
            className="flex items-center justify-center rounded-md px-8 py-4"
            style={{ border: `1px solid ${COUNTER_BORDER}`, backgroundColor: COUNTER_BG }}
          >
            <Text
              as="span"
              size="sm"
              weight="semibold"
              className="font-manrope leading-16 tracking-[0.28px]"
              style={{ color: TEXT_COLOR }}
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
              showDivider
            />
          </li>
        ))}
      </ul>
    </div><div className="flex shrink-0 items-center gap-14">
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
          borderColor: '#000', // TODO: SQUAD_COLORS.playersBorder
          backgroundColor: isCmd
            ? '#000' // TODO: SQUAD_COLORS.playersBackgroundCmd
            : '#000', // TODO: SQUAD_COLORS.playersBackgroundDefault
        }}
      >
        <Text
          as="span"
          size="sm"
          weight="semibold"
          className="font-manrope leading-16 tracking-[0.28px]"
          style={{ color: '#000' }} // TODO: SQUAD_COLORS.text
        >
          {playersCountLabel}
        </Text>
      </div>
    </div><ul>
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
            showDivider
          />
        </li>
      ))}
    </ul>
    </>
  );
}
