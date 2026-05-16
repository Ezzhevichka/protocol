import Image from "next/image";
import { Text } from "shared/ui";

import { formatPlayersAmount } from "./lib";
import type { FractionProps } from "./model";

const Flag = ({ src, size }: { src: string; size: "large" | "small" }) => {
  if (size === "small") {
    return (
      <div className="h-29 w-60 shrink-0 overflow-hidden rounded">
        <Image src={src} alt="Флаг фракции" width={60} height={29} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className="h-48 w-100 shrink-0 overflow-hidden rounded-lg">
      <Image src={src} alt="Флаг фракции" width={100} height={48} className="h-full w-full object-cover" />
    </div>
  );
};

const PlayersBadge = ({ playersAmount }: { playersAmount: number | string }) => {
  return (
    <div className="flex shrink-0 items-center gap-8 rounded-md border border-fraction-team-players-border bg-fraction-team-players-bg px-8 py-4">
      <span className="flex h-24 w-24 items-center justify-center overflow-hidden">
        <Image src="/general/fraction_people.svg" alt="Игроки" width={20} height={13} className="h-13 w-20" />
      </span>
      <Text as="p" size="base" weight="semibold" className="font-manrope leading-22 text-fraction-card-text-primary">
        {formatPlayersAmount(playersAmount)}
      </Text>
    </div>
  );
};

export const Fraction = ({
  playersAmount,
  fractionName,
  doctrine,
  flag,
  variant = "large",
  smallSide = "left",
  className = "",
}: FractionProps) => {
  if (variant === "small") {
    return (
      <div className={`flex w-215 items-center gap-8 ${className}`}>
        {smallSide === "left" ? <Flag src={flag} size="small" /> : null}

        <div className={`flex min-w-0 flex-1 flex-col justify-center gap-2 ${smallSide === "right" ? "items-end" : "items-start"}`}>
          <Text as="p" size="base" weight="medium" className="font-manrope leading-22 whitespace-nowrap text-fraction-card-text-primary">
            {fractionName}
          </Text>
          <Text as="p" size="sm" weight="medium" className="font-manrope leading-16 tracking-[0.28px] whitespace-nowrap text-disabled-light">
            {doctrine}
          </Text>
        </div>

        {smallSide === "right" ? <Flag src={flag} size="small" /> : null}
      </div>
    );
  }

  return (
    <div className={`flex w-588 items-center gap-16 ${className}`}>
      <div className="flex min-w-0 flex-1 items-center gap-16">
        <Flag src={flag} size="large" />
        <Text as="p" weight="medium" className="font-manrope text-[28px] leading-32 text-fraction-card-text-primary">
          {fractionName}
        </Text>
      </div>
      <PlayersBadge playersAmount={playersAmount} />
    </div>
  );
};
