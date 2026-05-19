'use client';

import Image from "next/image";
import { useState } from "react";
import { ServerStatusCards } from "widgets/ServerStatusCards";
import { CurrentMap } from "widgets/CurrentMap";
import { resolveMapImage } from "widgets/CurrentMap/lib";
import { serverLevelData, formatHours, formatPercentages } from "widgets/ServerState/lib";
import { Button, ButtonAppearance, ButtonSize, ButtonVariant } from "shared/ui";
import type { ServerData, ServerStateData } from "shared/types";

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
    <>
      <ServerStatusCards servers={serversWithClick} />

      <div className="mt-26 h-px bg-fraction-composite-divider" />

      {/* ── Bottom info bar ─────────────────────────────────────── */}
      <div className="mt-30 flex items-center gap-x-24">

        {/* Left — current map */}
        <CurrentMap
          mapName={selected?.currentLayer ?? "—"}
          imageSrc={mapImage}
        />

        {/* Center — server name + layer (takes remaining space) */}
        <div className="flex flex-1 flex-col gap-y-4">
          <span className="text-[15px] font-bold leading-tight text-white">
            {selected?.name ?? "—"}
          </span>
          <span className="text-[12px] font-medium text-[rgba(255,255,255,0.38)]">
            {selected?.currentLayer ?? "—"}
          </span>
        </div>

        {/* Right group — level indicator + connect button */}
        <div className="flex items-center gap-x-24 shrink-0">

          {/* Level indicator pill */}
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

          {/* Connect button */}
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
    </>
  );
};
