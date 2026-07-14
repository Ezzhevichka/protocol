'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { DatabaseIcon, Radio02Icon } from '@hugeicons/core-free-icons';
import type { KillfeedMode } from 'widgets/AdminKillfeed/lib/types';

type Props = {
  value: KillfeedMode;
  onChange: (mode: KillfeedMode) => void;
};

export const AdminKillfeedModeToggle = ({ value, onChange }: Props) => {
  const modes: { id: KillfeedMode; label: string; icon: React.ComponentProps<typeof HugeiconsIcon>['icon'] }[] = [
    { id: 'history', label: 'История', icon: DatabaseIcon },
    { id: 'live',    label: 'Live',    icon: Radio02Icon },
  ];

  return (
    <div
      className="flex items-center rounded-[9px]"
      style={{ gap: 4, padding: 4, backgroundColor: 'var(--at-bg-content)', border: '1px solid var(--at-border)' }}
    >
      {modes.map(({ id, label, icon }) => {
        const isActive = value === id;
        const isLive = id === 'live';
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className="flex items-center gap-6 rounded-md px-12 py-6 text-[12px] font-medium transition-all duration-150"
            style={{
              backgroundColor: isActive ? 'var(--at-bg-active)' : 'transparent',
              border: isActive ? '1px solid var(--at-border-active)' : '1px solid transparent',
              color: isActive ? 'var(--at-text-nav-active)' : 'var(--at-text-nav)',
              cursor: 'pointer',
            }}
          >
            {isLive && isActive ? (
              <span className="relative flex size-8 shrink-0">
                <span
                  className="absolute inline-flex size-full rounded-full opacity-75 animate-ping"
                  style={{ backgroundColor: 'rgb(239 68 68)' }}
                />
                <span
                  className="relative inline-flex size-8 rounded-full"
                  style={{ backgroundColor: 'rgb(239 68 68)' }}
                />
              </span>
            ) : (
              <HugeiconsIcon icon={icon} size={13} color="currentColor" strokeWidth={1.5} />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
};
