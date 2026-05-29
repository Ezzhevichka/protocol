import Image from 'next/image';

import { Text } from 'shared/ui';

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
    cardBackground: '#0E1625',
    cardBorder: 'none',
    dotColor: '#00FF90',
    textColor: '#FAFAFA',
    badgeBackground: '#52525C',
    badgeText: '#FAFAFA',
    playersIcon: '/general/fraction_people.svg',
  },
  pressed: {
    cardBackground: '#1C2E4A',
    cardBorder: '2px solid #2A446F',
    dotColor: '#00FF90',
    textColor: '#FAFAFA',
    badgeBackground: '#52525C',
    badgeText: '#FAFAFA',
    playersIcon: '/general/fraction_people.svg',
  },
  disabled: {
    cardBackground: '#4D4D4D',
    cardBorder: 'none',
    dotColor: '#EB1010',
    textColor: '#A1A1A1',
    badgeBackground: 'transparent',
    badgeText: '#A1A1A1',
    playersIcon: '/general/people.svg',
  },
};

export function ServerStatusCards({
  title = 'Статус серверов',
  servers = [],
  className = '',
}: ServerStatusCardsProps) {
  const slottedServers = mapServersToSlots(servers);

  const resolvedServers = Array.from({ length: SERVER_SLOTS }, (_, index) => {
    return resolveServerBySlot(index, slottedServers[index]);
  });

  return (
    <section className={`flex flex-col gap-48 ${className}`}>
      <Text
        as="h2"
        weight="semibold"
        className="font-manrope text-[24px] leading-36 text-fraction-card-text-primary"
      >
        {title}
      </Text>

      <div className="flex w-full min-w-1296 items-center gap-24 overflow-x-auto pb-4">
        {resolvedServers.map((server) => {
          const styles = CARD_STATE_STYLES[server.state];
          const isDisabled = server.state === 'disabled';

          return (
            <button
              key={server.key}
              type="button"
              disabled={isDisabled}
              onClick={server.onClick}
              className={`flex w-306 shrink-0 flex-col items-start overflow-hidden rounded-lg px-16 py-10 text-left ${isDisabled ? 'cursor-default' : 'cursor-pointer'}`}
              style={{
                backgroundColor: styles.cardBackground,
                border: styles.cardBorder,
              }}
            >
              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full items-center gap-12">
                  <span
                    className="size-10 shrink-0 rounded-full"
                    style={{ backgroundColor: styles.dotColor }}
                  />

                  <div className="flex min-w-0 items-center gap-8">
                    <div
                      className="flex items-center justify-center rounded px-10 py-2"
                      style={{ backgroundColor: styles.badgeBackground }}
                    >
                      <Text
                        as="span"
                        size="sm"
                        weight="medium"
                        className="font-manrope leading-16 tracking-[0.28px]"
                        style={{ color: styles.badgeText }}
                      >
                        {server.badge}
                      </Text>
                    </div>

                    <Text
                      as="p"
                      weight="semibold"
                      className="max-w-200 font-manrope text-[20px] leading-32 tracking-[0.4px] whitespace-nowrap"
                      style={{ color: styles.textColor }}
                    >
                      {server.name}
                    </Text>
                  </div>
                </div>

                <div className="flex w-full items-center gap-10">
                  <span className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden">
                    <Image
                      src={styles.playersIcon}
                      alt=""
                      aria-hidden="true"
                      width={20}
                      height={13}
                      className="h-13 w-20"
                    />
                  </span>

                  <Text
                    as="p"
                    weight="semibold"
                    className="min-w-0 flex-1 font-manrope text-[20px] leading-32 tracking-[0.4px]"
                    style={{ color: styles.textColor }}
                  >
                    {server.playersLabel}
                  </Text>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
