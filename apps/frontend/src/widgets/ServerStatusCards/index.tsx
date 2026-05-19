import Image from "next/image";
import { Text } from "shared/ui";

import { mapServersToSlots, resolveServerBySlot, SERVER_SLOTS } from "./lib";
import type { ServerStatusCardsProps, ServerStatusState } from "./model";

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
    cardBackground: "rgba(14, 22, 37, 0.55)",
    cardBorder: "1px solid rgba(255,255,255,0.07)",
    dotColor: "#00FF90",
    textColor: "#FAFAFA",
    badgeBackground: "rgba(82,82,92,0.7)",
    badgeText: "#FAFAFA",
    playersIcon: "/general/fraction_people.svg",
  },
  pressed: {
    cardBackground: "rgba(28, 46, 74, 0.6)",
    cardBorder: "2px solid #2A446F",
    dotColor: "#00FF90",
    textColor: "#FAFAFA",
    badgeBackground: "rgba(82,82,92,0.7)",
    badgeText: "#FAFAFA",
    playersIcon: "/general/fraction_people.svg",
  },
  disabled: {
    cardBackground: "rgba(77,77,77,0.4)",
    cardBorder: "1px solid rgba(255,255,255,0.05)",
    dotColor: "#EB1010",
    textColor: "#A1A1A1",
    badgeBackground: "transparent",
    badgeText: "#A1A1A1",
    playersIcon: "/general/people.svg",
  },
};

export const ServerStatusCards = ({
  title = "Статус серверов",
  servers = [],
  className = "",
}: ServerStatusCardsProps) => {
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

      <div className="flex w-full items-center gap-24 py-[16px]">
        {resolvedServers.map((server) => {
          const styles = CARD_STATE_STYLES[server.state];
          const isDisabled = server.state === "disabled";

          return (
            <button
              key={server.key}
              type="button"
              disabled={isDisabled}
              onClick={server.onClick}
              className={`flex w-306 shrink-0 flex-col items-start rounded-lg px-16 py-10 text-left transition-all duration-200 ${
                isDisabled
                  ? "cursor-default"
                  : "cursor-pointer hover:-translate-y-[3px] hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_4px_24px_rgba(0,255,144,0.08)]"
              }`}
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
                      className="flex shrink-0 items-center justify-center rounded px-10 py-2"
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
                      className="min-w-0 font-manrope text-[14px] leading-20 tracking-[0.2px]"
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
                    weight="medium"
                    className="min-w-0 flex-1 font-manrope text-[13px] leading-20 tracking-[0.2px]"
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
};
