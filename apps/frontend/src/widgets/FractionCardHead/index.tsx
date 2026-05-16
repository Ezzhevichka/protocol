import Image from "next/image";
import { Text } from "shared/ui";

import { formatFractionHours, formatPlayersAmount } from "./lib";
import type { FractionCardHeadProps } from "./model";

export const FractionCardHead = ({
  playersAmount,
  hoursAmount,
  variant = "default",
  className = "",
}: FractionCardHeadProps) => {
  const formattedHours = formatFractionHours(hoursAmount);
  const formattedPlayersAmount = formatPlayersAmount(playersAmount);
  const hoursText = `Кол-во часов на сторону: ${formattedHours}`;

  if (variant === "withPlayers") {
    return (
      <div className={`flex w-636 flex-col items-start ${className}`}>
        <div className="flex w-full items-center rounded-tl-lg rounded-tr-lg bg-fraction-card-bg px-20 pb-8 pt-12">
          <Text
            as="p"
            weight="semibold"
            className="flex-1 font-manrope text-xl leading-32 tracking-[0.4px] text-fraction-card-text-primary"
          >
            {hoursText}
          </Text>
          <div className="flex items-center justify-center rounded-md border border-fraction-card-pill-border bg-fraction-card-pill-bg px-8 py-4">
            <Text
              as="p"
              weight="semibold"
              className="font-manrope text-sm leading-16 tracking-[0.28px] text-fraction-card-text-primary"
            >
              {formattedPlayersAmount}
            </Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-636 flex-col items-start ${className}`}>
      <div className="flex w-full items-center justify-between rounded-tl-lg rounded-tr-lg bg-fraction-card-bg px-20 pb-8 pt-12">
        <div className="flex min-w-0 flex-1 items-center gap-8">
          <Image src="/general/fraction_hours_time.svg" alt="Иконка часов" width={20} height={20} />
          <Text
            as="p"
            weight="medium"
            className="font-manrope text-sm leading-16 tracking-[0.28px] text-fraction-card-text-muted"
          >
            {hoursText}
          </Text>
        </div>
        <Image src="/general/fraction_hours_info.svg" alt="Информация" width={20} height={20} />
      </div>
    </div>
  );
};
