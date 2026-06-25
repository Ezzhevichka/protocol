import Image from 'next/image';

export type AdminMapCardProps = {
    layerName?: string | null;
    nextLayerName?: string | null;
    mapImageSrc?: string | null;
};

const IconMap = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path
            d="M1 2.5 3.5 1.5l3 1.5 2.5-1v6L6.5 9l-3-1.5L1 8.5V2.5Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
        />
        <path d="M3.5 1.5v6M6.5 3v6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
);

export const AdminMapCard = ({
    layerName,
    nextLayerName,
    mapImageSrc,
}: AdminMapCardProps) => (
    <div
        className="flex h-full w-full flex-col overflow-hidden rounded-[6px]"
        style={{
            backgroundColor: 'var(--at-glass-bg)',
            border: '1px solid var(--at-glass-border)',
            backdropFilter: 'var(--at-glass-blur)',
            WebkitBackdropFilter: 'var(--at-glass-blur)',
            boxShadow: 'var(--at-glass-shadow)',
        }}
    >
        {/* Заголовок */}
        <div
            className="flex items-center gap-8 px-14 py-10"
            style={{ borderBottom: '1px solid var(--at-border-content)' }}
        >
            <span style={{ color: 'var(--at-text-section)' }}>
                <IconMap />
            </span>
            <span
                className="text-[12px] font-semibold uppercase tracking-wider"
                style={{ color: 'var(--at-text-nav)' }}
            >
                Карта
            </span>

            {/* Имя текущего слоя */}
            {layerName && (
                <span
                    className="ml-auto max-w-[120px] truncate rounded-[3px] px-8 py-3 text-[9px]"
                    style={{
                        backgroundColor: 'var(--at-bg-tab-inactive)',
                        border: '1px solid var(--at-border-tab-inactive)',
                        color: 'var(--at-text-nav)',
                    }}
                    title={layerName}
                >
                    {layerName}
                </span>
            )}
        </div>

        {/* Превью карты */}
        <div className="relative flex-1 overflow-hidden" style={{ minHeight: 80 }}>
            {mapImageSrc ? (
                <Image
                    src={mapImageSrc}
                    alt={layerName ?? 'Карта'}
                    fill
                    sizes="190px"
                    className="object-cover opacity-80"
                    unoptimized
                />
            ) : (
                <div
                    className="flex h-full w-full items-center justify-center"
                    style={{ backgroundColor: 'var(--at-bg-content)' }}
                >
                    <span className="text-[10px]" style={{ color: 'var(--at-text-section)' }}>
                        {layerName ?? 'Нет данных'}
                    </span>
                </div>
            )}

            {/* Следующий слой — плашка поверх изображения */}
            {nextLayerName && (
                <div
                    className="absolute bottom-8 right-8 max-w-[130px] truncate rounded-[3px] px-6 py-3 text-[8px]"
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.55)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'var(--at-text-section)',
                        backdropFilter: 'blur(4px)',
                    }}
                    title={`Следующая: ${nextLayerName}`}
                >
                    → {nextLayerName}
                </div>
            )}
        </div>
    </div>
);
