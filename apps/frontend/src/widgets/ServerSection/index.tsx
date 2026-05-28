'use client';

import Image from "next/image";
import { useState } from "react";
import { GLASS_STYLE } from "shared/lib";
import { Button, ButtonAppearance, ButtonSize, ButtonVariant } from "shared/ui";
import type { ServerData, ServerStateData } from "shared/types";
import { CurrentMap } from "widgets/CurrentMap";
import { resolveMapImage } from "widgets/CurrentMap/lib";
import { serverLevelData, formatHours, formatPercentages } from "widgets/ServerState/lib";
import { ServerStatusCards } from "widgets/ServerStatusCards";

type ServerSectionProps = {
  servers: ServerData[];
  serverState: ServerStateData;
};

export const ServerSection = ({ servers, serverState }: ServerSectionProps) => {
  const [selectedId, setSelectedId] = useState<string | number | undefined>(servers[0]?.id);

  const selected = servers.find((s) => s.id === selectedId) ?? servers[0];

  const serversWithClick = servers.map((s) => ({
    ...s,
    state: s.id === selectedId ? ("pressed" as const) : (s.state ?? ("default" as const)),
    onClick: () => setSelectedId(s.id),
  }));

  const levelData = serverLevelData[serverState.level];
  const mapImage = resolveMapImage(selected?.currentLayer);

  return (
    <div className="rounded-xl overflow-hidden" style={GLASS_STYLE}>
      {/* ── Server cards ─────────────────────────────────────────── */}
      <ServerStatusCards servers={serversWithClick} />

      {/* ── Divider ──────────────────────────────────────────────── */}
      <div className="h-px bg-white/[0.06]" />

      {/* ── Bottom info bar ──────────────────────────────────────── */}
      <div className="flex items-center gap-x-24 px-16 py-16">

        {/* Left — current map */}
        <CurrentMap
          mapName={selected?.currentLayer ?? "—"}
          imageSrc={mapImage}
          nextMapName={selected?.nextLayer ?? null}
          nextImageSrc={resolveMapImage(selected?.nextLayer)}
        />

        <div className="h-32 w-px shrink-0 bg-white/10" />

        {/* Center — stats */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-x-24">
            <div className="flex flex-col items-center gap-y-2">
              <span className="text-[11px] font-medium uppercase tracking-widest text-[rgba(255,255,255,0.35)]">
                Игроки
              </span>
              <span className="text-[20px] font-bold text-white">
                {selected?.playersCount ?? 0}
                <span className="text-[14px] font-medium text-[rgba(255,255,255,0.38)]">
                  /{selected?.maxPlayers ?? 100}
                </span>
              </span>
            </div>

            <div className="h-32 w-px bg-white/10" />

            <div className="flex flex-col items-center gap-y-2">
              <span className="text-[11px] font-medium uppercase tracking-widest text-[rgba(255,255,255,0.35)]">
                Очередь
              </span>
              <span className="text-[20px] font-bold text-white">
                {selected?.queueCount ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Right — level pill + connect button */}
        <div className="flex items-center gap-x-24 shrink-0">
          <div
            className={`${levelData.titleClassName} flex h-[46px] items-center gap-x-10 rounded-[8px] border px-16`}
            style={{
              borderColor: "color-mix(in srgb, currentColor 40%, transparent)",
              backgroundColor: "color-mix(in srgb, currentColor 8%, transparent)",
            }}
          >
            <span className="flex h-14 w-auto items-center">
              <Image
                src={levelData.icon}
                alt={levelData.label}
                width={14}
                height={14}
                unoptimized
                className="h-full w-auto"
              />
            </span>
            <span className="text-[12px] font-bold uppercase tracking-wider">
              {levelData.label}
            </span>
            <span className={`text-[12px] font-medium ${levelData.infoClassName}`}>
              {formatHours(serverState.hoursAmount)}
            </span>
            <span
              className="h-18 w-px"
              style={{ backgroundColor: "color-mix(in srgb, currentColor 40%, transparent)" }}
            />
            <span className={`text-[12px] font-medium ${levelData.infoClassName}`}>
              {formatPercentages(serverState.openProfilePercentages)}
            </span>
          </div>

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
    </div>
  );
};
