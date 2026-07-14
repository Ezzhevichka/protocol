'use client';

import { useState, useRef, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Search01Icon,
  Cancel01Icon,
  Delete02Icon,
  ArrowDown01Icon,
} from '@hugeicons/core-free-icons';
import { AdminKillfeedDatePicker } from 'widgets/AdminKillfeedDatePicker';
import type { FilterState, KillfeedServer } from 'widgets/AdminKillfeed/lib/types';

type Props = {
  filter: FilterState;
  weapons: string[];
  servers: KillfeedServer[];
  onChange: (f: FilterState) => void;
  onReset: () => void;
};

const W_EXPANDED  = 272;
const W_COLLAPSED = 40;

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--at-text-section)',
};

// ─── SearchInput ─────────────────────────────────────────────────────────────
const SearchInput = ({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) => (
  <div className="relative">
    <HugeiconsIcon
      icon={Search01Icon}
      size={13}
      color="var(--at-text-section)"
      strokeWidth={1.5}
      className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none"
    />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg py-7 pl-28 pr-28 text-[12px] outline-none"
      style={{
        backgroundColor: 'var(--at-bg-content)',
        border: '1px solid var(--at-border)',
        color: 'var(--at-text-nav)',
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--at-border-active)'; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--at-border)'; }}
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        className="absolute right-8 top-1/2 -translate-y-1/2"
        style={{ color: 'var(--at-text-section)', cursor: 'pointer' }}
      >
        <HugeiconsIcon icon={Cancel01Icon} size={12} color="currentColor" strokeWidth={2} />
      </button>
    )}
  </div>
);

// ─── MultiSelect — inline, как в модалке с банами ─────────────────────────────
type MultiSelectOption = { id: string; label: string };

type MultiSelectProps = {
  options: MultiSelectOption[];
  selected: string[];
  placeholder: string;
  searchable?: boolean;
  onToggle: (id: string) => void;
  onClear: () => void;
};

const MultiSelect = ({ options, selected, placeholder, searchable, onToggle, onClear }: MultiSelectProps) => {
  const [open, setOpen]   = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Закрываем при клике вне компонента
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const visible = searchable && search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const selectedLabels = options.filter((o) => selected.includes(o.id));

  return (
    <div ref={wrapperRef}>
      {/* Триггер */}
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); if (open) setSearch(''); }}
        className="w-full flex items-start justify-between gap-8 px-10 py-8 text-left outline-none"
        style={{
          backgroundColor: 'var(--at-bg-content)',
          border: `1px solid ${open || selected.length > 0 ? 'var(--at-border-active)' : 'var(--at-border)'}`,
          borderRadius: open ? '8px 8px 0 0' : '8px',
          cursor: 'pointer',
          minHeight: 34,
        }}
      >
        {/* Чипы или плейсхолдер */}
        <div className="flex flex-wrap gap-4 flex-1">
          {selectedLabels.length > 0 ? (
            selectedLabels.map((o) => (
              <span
                key={o.id}
                className="inline-flex items-center gap-4 rounded px-6 py-1 text-[10px] font-medium"
                style={{
                  backgroundColor: 'var(--at-bg-badge-active)',
                  border: '1px solid var(--at-border-active)',
                  color: 'var(--at-text-nav-active)',
                }}
              >
                {o.label}
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); onToggle(o.id); }}
                  style={{ cursor: 'pointer', display: 'flex' }}
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={9} color="currentColor" strokeWidth={2.5} />
                </span>
              </span>
            ))
          ) : (
            <span className="text-[12px] py-1" style={{ color: 'var(--at-text-section)' }}>
              {placeholder}
            </span>
          )}
        </div>

        {/* Правая часть */}
        <div className="flex items-center gap-6 shrink-0 mt-1">
          {selected.length > 0 && (
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="text-[10px] hover:opacity-70 transition-opacity"
              style={{ color: 'rgba(239,68,68,0.8)', cursor: 'pointer' }}
            >
              Очистить
            </span>
          )}
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={12}
            color="var(--at-text-section)"
            strokeWidth={1.5}
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
          />
        </div>
      </button>

      {/* Список — inline под кнопкой */}
      {open && (
        <div
          style={{
            backgroundColor: 'var(--at-bg-content)',
            border: '1px solid var(--at-border-active)',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
          }}
        >
          {searchable && (
            <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--at-border)' }}>
              <div className="relative">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={12}
                  color="var(--at-text-section)"
                  strokeWidth={1.5}
                  className="absolute left-7 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Поиск…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded py-5 pl-24 pr-8 text-[11px] outline-none"
                  style={{
                    backgroundColor: 'var(--at-bg-content)',
                    border: '1px solid var(--at-border)',
                    color: 'var(--at-text-nav)',
                  }}
                  autoFocus
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--at-border-active)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--at-border)'; }}
                />
              </div>
            </div>
          )}

          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {visible.length === 0 ? (
              <p className="px-10 py-8 text-[11px]" style={{ color: 'var(--at-text-section)' }}>
                Не найдено
              </p>
            ) : visible.map((o) => {
              const active = selected.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => onToggle(o.id)}
                  className="flex w-full items-center gap-8 px-10 py-8 text-left text-[12px]"
                  style={{
                    borderBottom: '1px solid var(--at-border-content)',
                    cursor: 'pointer',
                    color: active ? 'var(--at-text-nav-active)' : 'var(--at-text-nav)',
                    backgroundColor: active ? 'var(--at-bg-active)' : 'transparent',
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <span
                    className="shrink-0 size-10 rounded border"
                    style={{
                      backgroundColor: active ? 'var(--at-bg-active)' : 'transparent',
                      borderColor: active ? 'var(--at-border-active)' : 'var(--at-border)',
                    }}
                  />
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── AdminKillfeedFilterPanel ─────────────────────────────────────────────────
export const AdminKillfeedFilterPanel = ({ filter, weapons, servers, onChange, onReset }: Props) => {
  const [collapsed, setCollapsed] = useState(false);

  const serverOptions = servers.map((s) => ({ id: s.id,  label: s.name }));
  const weaponOptions = weapons.map((w) => ({ id: w,     label: w }));

  const hasActiveFilters =
    filter.attackerSearch !== '' ||
    filter.victimSearch !== '' ||
    filter.weapons.length > 0 ||
    filter.serverIds.length > 0 ||
    filter.dateFrom !== '' ||
    filter.dateTo !== '';

  return (
    <aside
      className="flex h-full shrink-0 flex-col rounded-2xl"
      style={{
        width: collapsed ? W_COLLAPSED : W_EXPANDED,
        backgroundColor: 'var(--at-glass-bg)',
        border: '1px solid var(--at-glass-border)',
        backdropFilter: 'var(--at-glass-blur)',
        WebkitBackdropFilter: 'var(--at-glass-blur)',
        boxShadow: 'var(--at-glass-shadow)',
        transition: 'width 240ms ease',
        overflow: 'hidden',
      }}
    >
      {/* Хедер */}
      <div
        className="flex shrink-0 items-center"
        style={{
          height: 48,
          padding: collapsed ? '0 8px' : '0 12px',
          gap: collapsed ? 0 : 8,
          borderBottom: '1px solid var(--at-border-section)',
        }}
      >
        {!collapsed && (
          <span
            className="flex-1 text-[12px] font-semibold uppercase tracking-widest whitespace-nowrap overflow-hidden"
            style={{ color: 'var(--at-text-section)' }}
          >
            Фильтры
          </span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center justify-center rounded-md transition-all duration-150"
          style={{
            width: 24,
            height: 24,
            flexShrink: 0,
            border: '1px solid var(--at-border)',
            backgroundColor: 'var(--at-bg-content)',
            color: 'var(--at-text-section)',
            cursor: 'pointer',
            marginLeft: collapsed ? 'auto' : undefined,
          }}
        >
          <HugeiconsIcon
            icon={collapsed ? ArrowLeft01Icon : ArrowRight01Icon}
            size={13}
            color="currentColor"
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* Содержимое */}
      <div
        className="flex flex-1 flex-col gap-16 overflow-y-auto"
        style={{
          padding: collapsed ? 0 : '12px',
          maxWidth: collapsed ? 0 : W_EXPANDED,
          opacity: collapsed ? 0 : 1,
          transition: 'opacity 180ms ease',
          pointerEvents: collapsed ? 'none' : undefined,
        }}
      >
        {/* Убийца */}
        <div className="flex flex-col gap-6">
          <label style={labelStyle}>Убийца</label>
          <SearchInput
            placeholder="Ник или Steam ID…"
            value={filter.attackerSearch}
            onChange={(v) => onChange({ ...filter, attackerSearch: v })}
          />
        </div>

        {/* Жертва */}
        <div className="flex flex-col gap-6">
          <label style={labelStyle}>Жертва</label>
          <SearchInput
            placeholder="Ник или Steam ID…"
            value={filter.victimSearch}
            onChange={(v) => onChange({ ...filter, victimSearch: v })}
          />
        </div>

        {/* Сервер */}
        <div className="flex flex-col gap-6">
          <label style={labelStyle}>Сервер</label>
          <MultiSelect
            options={serverOptions}
            selected={filter.serverIds}
            placeholder="Все серверы"
            onToggle={(id) => {
              const next = filter.serverIds.includes(id)
                ? filter.serverIds.filter((x) => x !== id)
                : [...filter.serverIds, id];
              onChange({ ...filter, serverIds: next });
            }}
            onClear={() => onChange({ ...filter, serverIds: [] })}
          />
        </div>

        {/* Оружие */}
        <div className="flex flex-col gap-6">
          <label style={labelStyle}>Оружие</label>
          <MultiSelect
            options={weaponOptions}
            selected={filter.weapons}
            placeholder="Все оружия"
            searchable
            onToggle={(w) => {
              const next = filter.weapons.includes(w)
                ? filter.weapons.filter((x) => x !== w)
                : [...filter.weapons, w];
              onChange({ ...filter, weapons: next });
            }}
            onClear={() => onChange({ ...filter, weapons: [] })}
          />
        </div>

        {/* Дата */}
        <div className="flex flex-col gap-6">
          <label style={labelStyle}>Дата</label>
          <AdminKillfeedDatePicker
            dateFrom={filter.dateFrom}
            dateTo={filter.dateTo}
            onChange={(from, to) => onChange({ ...filter, dateFrom: from, dateTo: to })}
          />
        </div>

        {/* Сброс */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-6 rounded-lg px-10 py-7 text-[12px] font-medium"
            style={{
              color: 'rgba(239,68,68,0.8)',
              border: '1px solid rgba(239,68,68,0.25)',
              backgroundColor: 'rgba(239,68,68,0.06)',
              cursor: 'pointer',
            }}
          >
            <HugeiconsIcon icon={Delete02Icon} size={13} color="currentColor" strokeWidth={1.5} />
            Сбросить фильтры
          </button>
        )}
      </div>
    </aside>
  );
};
