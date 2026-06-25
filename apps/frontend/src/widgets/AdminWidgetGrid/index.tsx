'use client';

import { Fragment, useCallback, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type WidgetSlot = {
    key: string;
    node: ReactNode;
    /** Занимает всю строку, игнорирует columns */
    fullRow?: boolean;
};

const CARD_W      = 190;
const GAP         = 12;
const W_MIN       = 110;
const H_MIN       = 80;
const H_DEFAULT   = 220;

/* ── Иконки ──────────────────────────────────────────────────────── */

const IconExpand = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path
            d="M1 4V1h3M6 1h3v3M9 6v3H6M4 9H1V6"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const IconCollapse = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path
            d="M4 1v3H1M9 4H6V1M6 9V6h3M1 6h3v3"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const IconReset = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M1.5 5a3.5 3.5 0 1 0 .7-2.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M1.5 2v2.5h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/** Три диагональные черты — стандартный resize grip */
const IconResize = () => (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
        <path d="M3 8L8 3M6 8L8 6M8 8H8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
);

/* ── Типы состояния ──────────────────────────────────────────────── */

type SlotDims = {
    w: number;
    h: number | null; // null = авто (по контенту)
};

type DimsMap = Record<string, SlotDims>;

/* ── Хук перетаскивания ──────────────────────────────────────────── */

function useDragResize(
    slotKey: string,
    row: WidgetSlot[],
    totalW: number,
    dims: DimsMap,
    slotRefs: React.MutableRefObject<Map<string, HTMLDivElement>>,
    onDimsChange: (updates: Partial<DimsMap>) => void,
    onExpandClear: () => void
) {
    return useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        onExpandClear();

        const startX     = e.clientX;
        const startY     = e.clientY;
        const startW     = dims[slotKey]?.w ?? CARD_W;
        const startH     = slotRefs.current.get(slotKey)?.offsetHeight ?? 150;
        const neighborKey = row.length > 1 ? row.find((s) => s.key !== slotKey)?.key : undefined;
        const _startNW   = neighborKey ? (dims[neighborKey]?.w ?? CARD_W) : 0;

        document.body.style.cursor     = 'nwse-resize';
        document.body.style.userSelect = 'none';

        const onMove = (ev: MouseEvent) => {
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;

            const updates: Partial<DimsMap> = {};

            // Высота текущего слота
            const newH = Math.max(H_MIN, startH + dy);
            updates[slotKey] = {
                w: dims[slotKey]?.w ?? CARD_W,
                h: newH,
            };

            // Ширина: двигаем только если есть сосед в строке
            if (neighborKey) {
                const newW  = Math.max(W_MIN, Math.min(totalW - W_MIN - GAP, startW + dx));
                const newNW = totalW - GAP - newW;
                updates[slotKey]!.w         = newW;
                updates[neighborKey] = {
                    w: newNW,
                    h: dims[neighborKey]?.h ?? null,
                };
            }

            onDimsChange(updates);
        };

        const onUp = () => {
            document.body.style.cursor     = '';
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }, [slotKey, row, totalW, dims, slotRefs, onDimsChange, onExpandClear]);
}

/* ── Слот ────────────────────────────────────────────────────────── */

type SlotProps = {
    slot: WidgetSlot;
    row: WidgetSlot[];
    totalW: number;
    dims: DimsMap;
    slotRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
    expandedKey: string | null;
    isCollapsed: boolean;
    onExpand: () => void;
    onDimsChange: (updates: Partial<DimsMap>) => void;
    onExpandClear: () => void;
};

function GridSlot({
    slot, row, totalW, dims, slotRefs,
    expandedKey, isCollapsed,
    onExpand, onDimsChange, onExpandClear,
}: SlotProps) {
    const { key, node } = slot;
    const isExpanded    = expandedKey === key;
    const d             = dims[key];
    const slotW         = d?.w ?? CARD_W;
    const slotH         = d?.h ?? undefined;

    const startDrag = useDragResize(
        key, row, totalW, dims, slotRefs, onDimsChange, onExpandClear
    );

    return (
        <div
            ref={(el) => {
                if (el) slotRefs.current.set(key, el);
                else slotRefs.current.delete(key);
            }}
            style={{
                width: isCollapsed ? 0 : slotW,
                height: slotH,
                flexShrink: 0,
                overflow: 'hidden',
                opacity: isCollapsed ? 0 : 1,
                transition: 'width 280ms ease, opacity 200ms ease',
                position: 'relative',
            }}
        >
            {/* Контент карточки */}
            <div style={{ width: '100%', height: slotH ? '100%' : undefined }}>
                {node}
            </div>

            {/* Кнопка expand/collapse — только если в строке > 1 слота */}
            {row.length > 1 && (
                <button
                    type="button"
                    title={isExpanded ? 'Свернуть' : 'Развернуть'}
                    onClick={onExpand}
                    style={{
                        position: 'absolute', top: 9, right: 10,
                        width: 20, height: 20,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', borderRadius: 3,
                        background: 'transparent',
                        color: 'var(--at-text-section)',
                        opacity: 0.5, cursor: 'pointer',
                        transition: 'opacity 150ms ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
                >
                    {isExpanded ? <IconCollapse /> : <IconExpand />}
                </button>
            )}

            {/* Resize grip */}
            {row.length === 1 ? (
                /* Одиночная строка — горизонтальная полоса внизу по центру */
                <div
                    onMouseDown={startDrag}
                    title="Изменить высоту"
                    style={{
                        position: 'absolute', bottom: 0, left: '50%',
                        transform: 'translateX(-50%)',
                        width: 48, height: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 's-resize',
                    }}
                >
                    <div
                        style={{
                            width: 32, height: 3, borderRadius: 2,
                            backgroundColor: 'var(--at-border-divider)',
                            opacity: 0.4,
                            transition: 'opacity 150ms ease, width 150ms ease',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget.style.opacity = '0.9');
                            (e.currentTarget.style.width = '44px');
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget.style.opacity = '0.4');
                            (e.currentTarget.style.width = '32px');
                        }}
                    />
                </div>
            ) : (
                /* Несколько колонок — угловой grip */
                <div
                    onMouseDown={startDrag}
                    title="Изменить размер"
                    style={{
                        position: 'absolute', bottom: 4, right: 4,
                        width: 14, height: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 2,
                        color: 'var(--at-text-section)',
                        opacity: 0.35,
                        cursor: 'nwse-resize',
                        transition: 'opacity 150ms ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.35')}
                >
                    <IconResize />
                </div>
            )}
        </div>
    );
}

/* ── Строка ──────────────────────────────────────────────────────── */

type RowProps = {
    row: WidgetSlot[];
    totalW: number;
    dims: DimsMap;
    slotRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
    expandedKey: string | null;
    onExpand: (key: string | null) => void;
    onDimsChange: (updates: Partial<DimsMap>) => void;
};

function GridRow({ row, totalW, dims, slotRefs, expandedKey, onExpand, onDimsChange }: RowProps) {
    const rowExpandedKey = row.find((s) => s.key === expandedKey)?.key ?? null;

    // Ширина с учётом expand
    const resolveW = (key: string): number => {
        if (row.length === 1) return totalW;
        const explicit = dims[key]?.w ?? CARD_W;
        if (!rowExpandedKey) return explicit;
        if (rowExpandedKey === key) return totalW;
        return 0;
    };

    return (
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
            {row.map(({ key, node }, idx) => {
                const isCollapsed = !!rowExpandedKey && rowExpandedKey !== key;
                const d = dims[key];
                const slotW = resolveW(key);

                return (
                    <Fragment key={key}>
                        {idx > 0 && (
                            <div
                                aria-hidden="true"
                                style={{
                                    width: rowExpandedKey ? 0 : GAP,
                                    flexShrink: 0,
                                    transition: 'width 280ms ease',
                                }}
                            />
                        )}
                        <GridSlot
                            slot={{ key, node }}
                            row={row}
                            totalW={totalW}
                            dims={{ ...dims, [key]: { ...(d ?? { w: CARD_W, h: null }), w: slotW } }}
                            slotRefs={slotRefs}
                            expandedKey={expandedKey}
                            isCollapsed={isCollapsed}
                            onExpand={() => onExpand(rowExpandedKey === key ? null : key)}
                            onDimsChange={onDimsChange}
                            onExpandClear={() => onExpand(null)}
                        />
                    </Fragment>
                );
            })}
        </div>
    );
}

/* ── Грид ────────────────────────────────────────────────────────── */

type AdminWidgetGridProps = {
    slots: WidgetSlot[];
    columns?: number;
};

export function AdminWidgetGrid({ slots, columns = 2 }: AdminWidgetGridProps) {
    const [expandedKey, setExpandedKey] = useState<string | null>(null);
    const [dims, setDims] = useState<DimsMap>(() =>
        Object.fromEntries(slots.map((s) => [s.key, { w: CARD_W, h: H_DEFAULT }]))
    );
    const slotRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const totalW = CARD_W * columns + GAP * (columns - 1);

    const rows: WidgetSlot[][] = [];
    let currentRow: WidgetSlot[] = [];
    for (const slot of slots) {
        if (slot.fullRow) {
            if (currentRow.length > 0) { rows.push(currentRow); currentRow = []; }
            rows.push([slot]);
        } else {
            currentRow.push(slot);
            if (currentRow.length === columns) { rows.push(currentRow); currentRow = []; }
        }
    }
    if (currentRow.length > 0) rows.push(currentRow);

    const handleDimsChange = useCallback((updates: Partial<DimsMap>) => {
        setDims((prev) => ({ ...prev, ...updates }) as DimsMap);
    }, []);

    const isDirty = expandedKey !== null
        || slots.some((s) => {
            const d = dims[s.key];
            return d && (d.w !== CARD_W || d.h !== H_DEFAULT);
        });

    const handleReset = () => {
        setExpandedKey(null);
        setDims(Object.fromEntries(slots.map((s) => [s.key, { w: CARD_W, h: H_DEFAULT }])));
    };

    return (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: GAP, width: totalW, flexShrink: 0 }}>
            {/* Кнопка сброса — абсолютно позиционирована, не влияет на layout */}
            {isDirty && (
                <button
                    type="button"
                    onClick={handleReset}
                    title="Сбросить размеры"
                    style={{
                        position: 'absolute', top: -20, right: 0,
                        display: 'flex', alignItems: 'center', gap: 5,
                        background: 'transparent', border: 'none',
                        color: 'var(--at-text-section)',
                        fontSize: 9, cursor: 'pointer',
                        opacity: 0.6,
                        transition: 'opacity 150ms ease',
                        padding: 0,
                        whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
                >
                    <IconReset />
                    Сбросить
                </button>
            )}

            {rows.map((row, rowIdx) => (
                <GridRow
                    key={rowIdx}
                    row={row}
                    totalW={totalW}
                    dims={dims}
                    slotRefs={slotRefs}
                    expandedKey={expandedKey}
                    onExpand={setExpandedKey}
                    onDimsChange={handleDimsChange}
                />
            ))}
        </div>
    );
}
