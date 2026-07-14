'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon, ArrowDown01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

type Props = {
  dateFrom: string;
  dateTo: string;
  onChange: (from: string, to: string) => void;
};

const MONTHS = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',
];
const WEEKDAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function todayISO() {
  const d = new Date();
  return isoDate(d.getFullYear(), d.getMonth(), d.getDate());
}

function getCalendarCells(year: number, month: number) {
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // 0=Пн
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();
  const prevY = month === 0 ? year - 1 : year;
  const prevM = month === 0 ? 11 : month - 1;
  const nextY = month === 11 ? year + 1 : year;
  const nextM = month === 11 ? 0 : month + 1;

  const cells: Array<{ date: string; inMonth: boolean }> = [];
  for (let i = firstDow - 1; i >= 0; i--) {
    cells.push({ date: isoDate(prevY, prevM, daysInPrev - i), inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: isoDate(year, month, d), inMonth: true });
  }
  let d = 1;
  while (cells.length < 42) {
    cells.push({ date: isoDate(nextY, nextM, d++), inMonth: false });
  }
  return cells;
}

function toStr(d: Date) {
  return isoDate(d.getFullYear(), d.getMonth(), d.getDate());
}

function getPresets() {
  const t = new Date();
  const todayStr = toStr(t);

  const yesterday = new Date(t); yesterday.setDate(t.getDate() - 1);
  const weekStart = new Date(t); weekStart.setDate(t.getDate() - ((t.getDay() + 6) % 7));
  const lastWeekEnd = new Date(weekStart); lastWeekEnd.setDate(weekStart.getDate() - 1);
  const lastWeekStart = new Date(lastWeekEnd); lastWeekStart.setDate(lastWeekEnd.getDate() - 6);
  const monthStart = new Date(t.getFullYear(), t.getMonth(), 1);
  const lastMonthEnd = new Date(t.getFullYear(), t.getMonth(), 0);
  const lastMonthStart = new Date(t.getFullYear(), t.getMonth() - 1, 1);

  return [
    { label: 'Сегодня',        from: todayStr,              to: todayStr },
    { label: 'Вчера',          from: toStr(yesterday),       to: toStr(yesterday) },
    { label: 'Эта неделя',     from: toStr(weekStart),       to: todayStr },
    { label: 'Прошлая неделя', from: toStr(lastWeekStart),   to: toStr(lastWeekEnd) },
    { label: 'Текущий месяц',  from: toStr(monthStart),      to: todayStr },
    { label: 'Прошлый месяц',  from: toStr(lastMonthStart),  to: toStr(lastMonthEnd) },
  ];
}

function formatDisplay(from: string, to: string): string {
  if (!from && !to) return 'Все даты';
  const fmt = (s: string) => s.split('-').reverse().join('.');
  if (!to || from === to) return fmt(from);
  return `${fmt(from)} – ${fmt(to)}`;
}

export const AdminKillfeedDatePicker = ({ dateFrom, dateTo, onChange }: Props) => {
  const [open, setOpen]         = useState(false);
  const [mounted, setMounted]   = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    const d = dateFrom ? new Date(dateFrom) : new Date();
    return d.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const d = dateFrom ? new Date(dateFrom) : new Date();
    return d.getMonth();
  });
  const [rangeStart, setRangeStart] = useState(dateFrom);
  const [rangeEnd,   setRangeEnd]   = useState(dateTo);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});

  useEffect(() => setMounted(true), []);

  const getPortalTarget = () =>
    document.querySelector('[data-admin-theme]') ?? document.body;

  // Sync external changes
  useEffect(() => { setRangeStart(dateFrom); }, [dateFrom]);
  useEffect(() => { setRangeEnd(dateTo); }, [dateTo]);

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popupWidth = 292;
      const left = Math.max(8, rect.left - popupWidth - 8);
      setPopupStyle({ position: 'fixed', top: rect.top, left, width: popupWidth, zIndex: 9999 });
    }
    setRangeStart(dateFrom);
    setRangeEnd(dateTo);
    setOpen(true);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const handleDayClick = (date: string) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd('');
    } else {
      if (date >= rangeStart) {
        setRangeEnd(date);
      } else {
        setRangeEnd(rangeStart);
        setRangeStart(date);
      }
    }
  };

  const handlePreset = ({ from, to }: { from: string; to: string }) => {
    setRangeStart(from);
    setRangeEnd(to);
    const d = new Date(from);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const handleConfirm = () => {
    onChange(rangeStart, rangeEnd || rangeStart);
    setOpen(false);
  };

  const handleCancel = () => {
    setRangeStart(dateFrom);
    setRangeEnd(dateTo);
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('[data-kf-datepicker]') || triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const cells   = getCalendarCells(viewYear, viewMonth);
  const presets = getPresets();
  const today   = todayISO();

  const effectiveEnd = rangeEnd || rangeStart;

  const popup = open && (
    <div
      data-kf-datepicker
      style={{
        ...popupStyle,
        backgroundColor: 'var(--at-bg-tooltip)',
        border: '1px solid var(--at-glass-border)',
        boxShadow: 'var(--at-glass-shadow)',
        borderRadius: 14,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* Month navigation */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          type="button"
          onClick={prevMonth}
          style={{ padding: '4px 6px', borderRadius: 8, cursor: 'pointer', color: 'var(--at-text-section)', background: 'none', border: 'none' }}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={15} color="currentColor" strokeWidth={1.5} />
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--at-text-nav)' }}>
          {MONTHS[viewMonth]} {viewYear}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          style={{ padding: '4px 6px', borderRadius: 8, cursor: 'pointer', color: 'var(--at-text-section)', background: 'none', border: 'none' }}
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={15} color="currentColor" strokeWidth={1.5} />
        </button>
      </div>

      {/* Weekday header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            style={{
              textAlign: 'center',
              fontSize: 10,
              fontWeight: 500,
              padding: '4px 2px',
              color: 'var(--at-text-section)',
              backgroundColor: 'var(--at-bg-tab-active)',
              borderRadius: 6,
            }}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map(({ date, inMonth }) => {
          const isStart   = date === rangeStart;
          const isEnd     = date === effectiveEnd;
          const isActive  = isStart || isEnd;
          const inRange   = rangeStart && effectiveEnd && date > rangeStart && date < effectiveEnd;
          const isToday   = date === today;
          const dayNum    = parseInt(date.split('-')[2], 10);

          return (
            <button
              key={date}
              type="button"
              onClick={() => handleDayClick(date)}
              style={{
                textAlign: 'center',
                fontSize: 12,
                padding: '5px 2px',
                borderRadius: 6,
                border: isToday && !isActive ? '1px solid var(--at-border-active)' : '1px solid transparent',
                cursor: 'pointer',
                backgroundColor: isActive
                  ? 'var(--at-bg-active)'
                  : inRange
                    ? 'var(--at-bg-badge-active)'
                    : 'transparent',
                color: isActive
                  ? 'var(--at-text-nav-active)'
                  : inMonth
                    ? 'var(--at-text-nav)'
                    : 'var(--at-text-section)',
                opacity: inMonth ? 1 : 0.35,
              }}
            >
              {dayNum}
            </button>
          );
        })}
      </div>

      {/* Preset chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => handlePreset(p)}
            style={{
              fontSize: 11,
              padding: '3px 8px',
              borderRadius: 4,
              border: '1px solid var(--at-border)',
              backgroundColor: 'transparent',
              color: 'var(--at-text-nav)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={handleCancel}
          style={{
            flex: 1,
            padding: '7px 12px',
            borderRadius: 8,
            border: '1px solid var(--at-border)',
            backgroundColor: 'var(--at-bg-content)',
            color: 'var(--at-text-nav)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Отменить
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!rangeStart}
          style={{
            flex: 1,
            padding: '7px 12px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: rangeStart ? 'var(--at-bg-active)' : 'var(--at-bg-tab-active)',
            color: rangeStart ? 'var(--at-text-nav-active)' : 'var(--at-text-section)',
            fontSize: 12,
            fontWeight: 500,
            cursor: rangeStart ? 'pointer' : 'default',
          }}
        >
          Выбрать
        </button>
      </div>
    </div>
  );

  const hasValue = dateFrom || dateTo;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center justify-between rounded-lg px-10 py-7 text-[12px] text-left outline-none"
        style={{
          backgroundColor: 'var(--at-bg-content)',
          border: `1px solid ${hasValue ? 'var(--at-border-active)' : 'var(--at-border)'}`,
          color: hasValue ? 'var(--at-text-nav)' : 'var(--at-text-section)',
          cursor: 'pointer',
        }}
      >
        <span className="truncate">{formatDisplay(dateFrom, dateTo)}</span>
        <div className="flex items-center gap-4 shrink-0 ml-4">
          {hasValue && (
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); onChange('', ''); }}
              style={{ color: 'var(--at-text-section)', cursor: 'pointer', display: 'flex' }}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={11} color="currentColor" strokeWidth={2} />
            </span>
          )}
          <HugeiconsIcon icon={ArrowDown01Icon} size={12} color="var(--at-text-section)" strokeWidth={1.5} />
        </div>
      </button>
      {mounted && createPortal(popup, getPortalTarget())}
    </div>
  );
};
