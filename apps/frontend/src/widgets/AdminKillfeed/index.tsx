'use client';

import { useState, useEffect } from 'react';
import { AdminKillfeedModeToggle }  from 'widgets/AdminKillfeedModeToggle';
import { AdminKillfeedTableHead }   from 'widgets/AdminKillfeedTableHead';
import { AdminKillfeedRow }         from 'widgets/AdminKillfeedRow';
import { AdminKillfeedStatusBar }   from 'widgets/AdminKillfeedStatusBar';
import { AdminKillfeedPagination }  from 'widgets/AdminKillfeedPagination';
import { AdminKillfeedFilterPanel } from 'widgets/AdminKillfeedFilterPanel';
import { useCircularBuffer }        from './lib/useCircularBuffer';
import { MOCK_KILL_EVENTS, MOCK_WEAPONS, MOCK_SERVERS } from './lib/mockData';
import type { KillfeedMode, SortKey, SortState, FilterState, KillEvent } from './lib/types';

const PAGE_SIZE    = 20;
const MAX_LIVE     = 300;

const DEFAULT_SORT: SortState  = { key: 'timestamp', dir: 'desc' };
const DEFAULT_FILTER: FilterState = {
  attackerSearch: '',
  victimSearch: '',
  weapons: [],
  serverIds: [],
  dateFrom: '',
  dateTo: '',
};

function applyFilter(events: KillEvent[], f: FilterState): KillEvent[] {
  return events.filter((e) => {
    const aq = f.attackerSearch.toLowerCase();
    const vq = f.victimSearch.toLowerCase();

    const matchAttacker = aq === '' ||
      e.attackerName.toLowerCase().includes(aq) ||
      e.attackerSteamId.includes(aq);

    const matchVictim = vq === '' ||
      e.victimName.toLowerCase().includes(vq) ||
      e.victimSteamId.includes(vq);

    const matchWeapon = f.weapons.length === 0 || f.weapons.includes(e.weapon);
    const matchServer = f.serverIds.length === 0 || f.serverIds.includes(e.serverId);

    const matchDateFrom = f.dateFrom === '' || e.date >= f.dateFrom;
    const matchDateTo   = f.dateTo   === '' || e.date <= f.dateTo;

    return matchAttacker && matchVictim && matchWeapon && matchServer && matchDateFrom && matchDateTo;
  });
}

function applySort(events: KillEvent[], s: SortState): KillEvent[] {
  return [...events].sort((a, b) => {
    const va = a[s.key];
    const vb = b[s.key];
    const cmp = typeof va === 'number' && typeof vb === 'number'
      ? va - vb
      : String(va).localeCompare(String(vb));
    return s.dir === 'asc' ? cmp : -cmp;
  });
}

export const AdminKillfeed = () => {
  const [mode,   setMode]   = useState<KillfeedMode>('history');
  const [sort,   setSort]   = useState<SortState>(DEFAULT_SORT);
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [page,   setPage]   = useState(1);

  const { items: liveItems, total: liveTotal, push, clear } = useCircularBuffer<KillEvent>(MAX_LIVE);

  // Demo live simulation: add an event every 2 seconds
  useEffect(() => {
    if (mode !== 'live') return;
    clear();
    let idx = 0;
    const id = setInterval(() => {
      const base = MOCK_KILL_EVENTS[idx % MOCK_KILL_EVENTS.length];
      push({ ...base, id: `live-${Date.now()}-${idx}`, timestamp: new Date().toLocaleTimeString('ru') });
      idx += 1;
    }, 2000);
    return () => clearInterval(id);
  }, [mode, push, clear]);

  const handleModeChange = (m: KillfeedMode) => {
    setMode(m);
    setPage(1);
  };

  const handleSort = (key: SortKey) => {
    setSort((prev) => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
    setPage(1);
  };

  const handleFilterChange = (f: FilterState) => {
    setFilter(f);
    setPage(1);
  };

  // History: filter + sort + paginate
  const filtered  = applyFilter(MOCK_KILL_EVENTS, filter);
  const sorted    = applySort(filtered, sort);
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const historyRows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Live: apply same filter logic
  const liveFiltered = applyFilter(liveItems, filter);

  const rows = mode === 'history' ? historyRows : liveFiltered;

  const addServer = (id: string) => {
    if (!filter.serverIds.includes(id)) {
      handleFilterChange({ ...filter, serverIds: [...filter.serverIds, id] });
    }
  };

  const addWeapon = (weapon: string) => {
    if (!filter.weapons.includes(weapon)) {
      handleFilterChange({ ...filter, weapons: [...filter.weapons, weapon] });
    }
  };

  return (
    <div className="flex h-full flex-col gap-16 px-20 pb-20 min-h-0">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between">
        <div>
          <p className="text-[16px] font-semibold" style={{ color: 'var(--at-text-nav)' }}>Килфид</p>
          <p className="mt-2 text-[11px]" style={{ color: 'var(--at-text-section)' }}>
            {mode === 'history' ? `История убийств · ${filtered.length} событий` : 'Прямой эфир убийств'}
          </p>
        </div>
        <AdminKillfeedModeToggle value={mode} onChange={handleModeChange} />
      </div>

      {/* Main block: table + filter panel */}
      <div className="flex flex-1 gap-16 min-h-0 overflow-hidden">
        {/* Table */}
        <div
          className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl"
          style={{
            backgroundColor: 'var(--at-glass-bg)',
            border: '1px solid var(--at-glass-border)',
            backdropFilter: 'var(--at-glass-blur)',
            WebkitBackdropFilter: 'var(--at-glass-blur)',
            boxShadow: 'var(--at-glass-shadow)',
          }}
        >
          <div className="flex-1 overflow-auto min-h-0">
            <table className="w-full border-collapse" style={{ minWidth: 640 }}>
              <AdminKillfeedTableHead
                sort={sort}
                onSort={handleSort}
                sortable={mode === 'history'}
              />
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-40 text-center text-[13px]"
                      style={{ color: 'var(--at-text-section)' }}
                    >
                      {mode === 'live' ? 'Ожидаем события…' : 'Нет данных'}
                    </td>
                  </tr>
                ) : (
                  rows.map((e, i) => (
                    <AdminKillfeedRow
                      key={e.id}
                      event={e}
                      isEven={i % 2 === 0}
                      onServerClick={addServer}
                      onWeaponClick={addWeapon}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {mode === 'live' && (
            <AdminKillfeedStatusBar shown={liveFiltered.length} total={liveTotal} maxRows={MAX_LIVE} />
          )}

          {mode === 'history' && (
            <AdminKillfeedPagination page={page} pageCount={pageCount} onChange={setPage} />
          )}
        </div>

        {/* Filter panel */}
        <AdminKillfeedFilterPanel
          filter={filter}
          weapons={MOCK_WEAPONS}
          servers={MOCK_SERVERS}
          onChange={handleFilterChange}
          onReset={() => { setFilter(DEFAULT_FILTER); setPage(1); }}
        />
      </div>
    </div>
  );
};
