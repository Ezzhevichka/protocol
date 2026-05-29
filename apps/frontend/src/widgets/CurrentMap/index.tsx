import Image from 'next/image';

import { Text } from 'shared/ui';

import type { CurrentMapProps } from './model';

export function CurrentMap({ mapName, imageSrc, className = '' }: CurrentMapProps) {
  return (
    <div className={`flex items-start gap-24 ${className}`}>
      <div className="flex w-196 shrink-0 flex-col gap-4">
        <Text
          as="p"
          size="base"
          weight="medium"
          className="font-manrope leading-24 tracking-[0.32px] text-fraction-card-text-primary whitespace-nowrap"
        >
          Текущая карта
        </Text>

        <Text
          as="p"
          size="sm"
          weight="semibold"
          className="font-manrope leading-20 tracking-[0.28px] whitespace-nowrap"
          style={{ color: '#A1A1A1' }}
        >
          {mapName}
        </Text>
      </div>

      {imageSrc ? (
        <div className="relative h-80 w-196 shrink-0 overflow-hidden rounded-lg">
          <Image src={imageSrc} alt={mapName} fill className="object-cover opacity-50" />
        </div>
      ) : null}
    </div>
  );
}
