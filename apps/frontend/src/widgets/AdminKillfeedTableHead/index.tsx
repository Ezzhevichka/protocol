import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, ArrowUp01Icon } from '@hugeicons/core-free-icons';
import type { SortKey, SortState } from 'widgets/AdminKillfeed/lib/types';

type Props = {
  sort: SortState;
  onSort: (key: SortKey) => void;
  sortable: boolean;
};

type Column = { key: SortKey | null; label: string };

const COLUMNS: Column[] = [
  { key: 'date',         label: 'Дата' },
  { key: 'timestamp',    label: 'Время' },
  { key: 'serverName',   label: 'Сервер' },
  { key: 'attackerName', label: 'Убийца' },
  { key: 'weapon',       label: 'Оружие' },
  { key: 'victimName',   label: 'Жертва' },
  { key: 'damage',       label: 'Урон' },
];

const thStyle: React.CSSProperties = {
  padding: '10px 16px',
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'var(--at-text-section)',
  backgroundColor: 'var(--at-bg-tab-active)',
  borderBottom: '1px solid var(--at-border-section)',
  whiteSpace: 'nowrap',
};

export const AdminKillfeedTableHead = ({ sort, onSort, sortable }: Props) => (
  <thead>
    <tr>
      {COLUMNS.map(({ key, label }) => {
        const isActive = sortable && key !== null && sort.key === key;
        return (
          <th
            key={label}
            style={{
              ...thStyle,
              cursor: sortable && key ? 'pointer' : 'default',
            }}
            onClick={() => { if (sortable && key) onSort(key); }}
          >
            <span className="inline-flex items-center gap-4">
              {label}
              {isActive && (
                <HugeiconsIcon
                  icon={sort.dir === 'asc' ? ArrowUp01Icon : ArrowDown01Icon}
                  size={11}
                  color="var(--at-text-nav-active)"
                  strokeWidth={2}
                />
              )}
            </span>
          </th>
        );
      })}
    </tr>
  </thead>
);
