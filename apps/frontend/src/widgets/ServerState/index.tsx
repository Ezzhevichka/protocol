import Image from "next/image";
import { Text } from "shared/ui";

import { formatHours, formatPercentages, serverLevelData } from "./lib";
import type { ServerStateProps } from "./model";

export const ServerState = ({
  hoursAmount,
  openProfilePercentages,
  level = "nightmare",
  title = "Ожидаемый уровень игры:",
  className = "",
}: ServerStateProps) => {
  const currentLevelData = serverLevelData[level];

  return (
    <div className={`flex w-416 items-start gap-x-24 ${className}`}>
      <Text as="p" size="base" weight="medium" className="flex-1 text-white">
        {title}
      </Text>

      <div className="flex w-160 min-w-160 flex-col items-start justify-center gap-y-4">
        <div className="flex w-full items-center gap-x-8">
          <span className="flex size-24 shrink-0 items-center justify-center overflow-hidden">
            <Image src={currentLevelData.icon} alt={currentLevelData.label} width={24} height={24} unoptimized className="block h-auto w-auto" />
          </span>
          <Text as="p" size="base" weight="semibold" className={`flex-1 ${currentLevelData.titleClassName}`}>
            {currentLevelData.label}
          </Text>
        </div>

        <div className="flex w-full items-center gap-x-8 pl-32">
          <Text as="span" size="base" weight="medium" className={currentLevelData.infoClassName}>
            {formatHours(hoursAmount)}
          </Text>
          <span className={`size-4 rounded-full bg-current ${currentLevelData.infoClassName}`} />
          <Text as="span" size="base" weight="medium" className={currentLevelData.infoClassName}>
            {formatPercentages(openProfilePercentages)}
          </Text>
        </div>
      </div>
    </div>
  );
};
