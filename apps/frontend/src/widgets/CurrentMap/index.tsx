import Image from 'next/image';

import type { CurrentMapProps } from './model';

export function CurrentMap({
  mapName,
  imageSrc,
  nextMapName,
  nextImageSrc,
  className = '',
}: CurrentMapProps) {
  return (
    <div className={`flex flex-col gap-y-8 shrink-0 ${className}`}>
      <span className="text-[11px] font-medium uppercase tracking-widest text-[rgba(255,255,255,0.35)]">
        Текущая карта
      </span>

      <div className="flex items-end gap-8">
        {/* Current map — large */}
        {imageSrc ? (
          <div className="group relative h-120 w-220 overflow-hidden rounded-lg">
            <Image
              src={imageSrc}
              alt={mapName}
              fill
              sizes="220px"
              quality={50}
              className="object-cover opacity-60 transition-all duration-300 group-hover:opacity-85 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-8 left-10 text-[11px] font-medium text-white/70 leading-tight">
              {mapName}
            </span>
          </div>
        ) : (
          <div className="flex h-120 w-220 items-center justify-center rounded-lg bg-white/5">
            <span className="text-[12px] text-white/30">{mapName}</span>
          </div>
        )}

        {/* Next map — small */}
        {nextMapName ? (
          <div className="flex flex-col gap-y-4">
            <span className="text-[10px] font-medium uppercase tracking-widest text-[rgba(255,255,255,0.25)]">
              Следующая
            </span>
            {nextImageSrc ? (
              <div className="group relative h-72 w-130 overflow-hidden rounded-md">
                <Image
                  src={nextImageSrc}
                  alt={nextMapName}
                  fill
                  sizes="130px"
                  quality={40}
                  className="object-cover opacity-40 transition-all duration-300 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-6 left-8 text-[10px] font-medium text-white/50 leading-tight">
                  {nextMapName}
                </span>
              </div>
            ) : (
              <div className="flex h-72 w-130 items-center justify-center rounded-md bg-white/5">
                <span className="text-[10px] text-white/25">{nextMapName}</span>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
