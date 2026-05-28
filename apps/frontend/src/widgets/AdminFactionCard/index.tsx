import Image from 'next/image';

import { resolveFactionFlag, resolveFactionName } from 'shared/lib';

/* ── Типы ─────────────────────────────────────────────────────────── */

export type AdminFactionCardStats = {
    /** Суммарное время игры, напр. "7 350ч 50м" */
    totalHours?: string;
    /** Среднее время игры, напр. "336ч 53м" */
    avgHours?: string;
    /** Метрика со стрелкой вверх, напр. "1 044 34М" */
    scoreUp?: string;
    /** Метрика со стрелкой вниз, напр. "04ч 4м" */
    scoreDown?: string;
};

export type AdminFactionCardProps = {
    /**
     * Идентификатор фракции с сервера, напр. "RGF_S_CombinedArms_Seed".
     * Флаг и название разрешаются автоматически.
     */
    teamId: string;
    /** Количество игроков на стороне */
    playerCount: number;
    /** Фоновое изображение фракции */
    backgroundSrc?: string;
    /** Статистика справа */
    stats?: AdminFactionCardStats;
    /**
     * Встроенный режим — убирает собственный glass-контейнер.
     * Используется когда карточка является частью более крупного блока.
     */
    embedded?: boolean;
};

/* ── Иконки-стрелки ───────────────────────────────────────────────── */

const IconUp = () => (
    <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
        <path d="M4 1L7 6H1L4 1Z" fill="currentColor" />
    </svg>
);

const IconDown = () => (
    <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
        <path d="M4 8L1 3H7L4 8Z" fill="currentColor" />
    </svg>
);

/* ── Компонент ────────────────────────────────────────────────────── */

export const AdminFactionCard = ({
    teamId,
    playerCount,
    backgroundSrc,
    stats,
    embedded = false,
}: AdminFactionCardProps) => {
    const flagSrc = resolveFactionFlag(teamId);
    const factionName = resolveFactionName(teamId);

    return (
        <div
            className="relative h-[107px] w-full overflow-hidden"
            style={embedded ? undefined : {
                borderRadius: 10,
                backgroundColor: 'var(--at-glass-bg)',
                border: '1px solid var(--at-glass-border)',
                backdropFilter: 'var(--at-glass-blur)',
                WebkitBackdropFilter: 'var(--at-glass-blur)',
                boxShadow: 'var(--at-glass-shadow)',
            }}
        >
            {/* Фоновое изображение фракции (справа) */}
            {backgroundSrc && (
                <>
                    <Image
                        src={backgroundSrc}
                        alt=""
                        aria-hidden="true"
                        fill
                        className="pointer-events-none object-cover object-right"
                        style={{ opacity: 0.5 }}
                    />
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background: 'linear-gradient(to right, var(--at-bg-surface) 25%, rgba(6,18,32,0.4) 55%, transparent 100%)',
                        }}
                    />
                </>
            )}

            {/* Контент */}
            <div className="relative flex h-full flex-col justify-between p-12">
                {/* Верх: флаг + счётчик игроков */}
                <div className="flex items-center gap-10">
                    {flagSrc && (
                        <Image
                            src={flagSrc}
                            alt={factionName}
                            width={32}
                            height={22}
                            className="shrink-0 rounded-[3px] object-cover"
                            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
                        />
                    )}
                    <span
                        className="text-[17px] font-bold leading-none"
                        style={{ color: 'var(--at-text-server)' }}
                    >
                        {playerCount}
                    </span>
                </div>

                {/* Низ: название фракции */}
                <span
                    className="text-[11px] font-bold"
                    style={{ color: 'var(--at-text-nav)' }}
                >
                    {factionName}
                </span>
            </div>

            {/* Колонка статистики (справа) */}
            {stats && (
                <div className="absolute right-12 top-0 flex h-full flex-col items-end justify-center gap-6">
                    {stats.totalHours && (
                        <span
                            className="text-[11px]"
                            style={{ color: 'var(--at-text-nav-active)' }}
                        >
                            {stats.totalHours}
                        </span>
                    )}
                    {stats.avgHours && (
                        <span
                            className="flex items-center gap-4 text-[9px]"
                            style={{ color: 'var(--at-text-nav)' }}
                        >
                            <span style={{ fontSize: 10 }}>≈</span>
                            {stats.avgHours}
                        </span>
                    )}
                    {stats.scoreUp && (
                        <span
                            className="flex items-center gap-4 text-[9px]"
                            style={{ color: 'var(--at-text-icon)' }}
                        >
                            <IconUp />
                            {stats.scoreUp}
                        </span>
                    )}
                    {stats.scoreDown && (
                        <span
                            className="flex items-center gap-4 text-[9px]"
                            style={{ color: 'var(--at-text-section)' }}
                        >
                            <IconDown />
                            {stats.scoreDown}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};
