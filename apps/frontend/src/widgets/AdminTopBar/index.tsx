'use client';

import Image from 'next/image';

import { useAdminTheme, type AdminTheme } from 'shared/providers/AdminThemeProvider';
import type { AuthUser } from 'shared/types';

const IconChat = () => (
    <svg width="13" height="12" viewBox="0 0 13 12" fill="none">
        <path d="M1 1h11v7.5H7.5L4.5 11V8.5H1V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
);

const IconPlayers = () => (
    <svg width="12" height="13" viewBox="0 0 12 13" fill="none">
        <circle cx="4.5" cy="4" r="2.2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1 11c0-2 1.567-3.5 3.5-3.5S8 9 8 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="9" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.1" opacity="0.6" />
        <path d="M8 11c0-1.2.5-2.3 1.3-3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.6" />
    </svg>
);

const IconTools = () => (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
        <path d="M8 1.5a3 3 0 0 1 0 4.2L3.5 10.5a1.5 1.5 0 1 1-2.1-2.1L6.3 3.5A3 3 0 0 1 8 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M9.5 1L11 2.5 9 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconJournal = () => (
    <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
        <rect x="1" y="1" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <line x1="3" y1="4.5" x2="8" y2="4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="3" y1="7" x2="8" y2="7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="3" y1="9.5" x2="6" y2="9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
);

const IconClans = () => (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
        <path d="M6 1L1 3.5v4c0 3 2.4 5.5 5 6 2.6-.5 5-3 5-6v-4L6 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
);

const IconIP = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6 1c-1.5 1.5-2 3-2 5s.5 3.5 2 5M6 1c1.5 1.5 2 3 2 5s-.5 3.5-2 5M1 6h10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
);

const THEMES: { value: AdminTheme; label: string }[] = [
    { value: 'dark', label: 'Dark' },
    { value: 'black', label: 'Black' },
    { value: 'light', label: 'Light' },
];

const NAV_ITEMS = [
    { label: 'Чат', icon: <IconChat /> },
    { label: 'Игроки', icon: <IconPlayers /> },
    { label: 'Инструменты', icon: <IconTools /> },
    { label: 'Журнал', icon: <IconJournal /> },
    { label: 'Кланы', icon: <IconClans /> },
    { label: 'IP', icon: <IconIP /> },
] as const;

type AdminTopBarProps = {
    user: AuthUser | null;
};

export const AdminTopBar = ({ user }: AdminTopBarProps) => {
    const { theme, setTheme } = useAdminTheme();

    return (
        <div
            className="flex h-[38px] shrink-0 items-center justify-between px-20"
            style={{
                borderBottom: '1px solid var(--at-border-topbar)',
                backgroundColor: 'var(--at-bg-topbar)',
            }}
        >
            {/* Слева: название страницы */}
            <span
                className="text-[13px] font-normal"
                style={{ color: 'var(--at-text-label)' }}
            >
                Панель управления сервером
            </span>

            {/* Справа: навигация + переключатель тем + пользователь */}
            <div className="flex items-center gap-20">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.label}
                        type="button"
                        className="flex items-center gap-6 transition-opacity duration-150 hover:opacity-80"
                        style={{ color: 'var(--at-text-label)' }}
                    >
                        <span className="shrink-0">{item.icon}</span>
                        <span className="text-[13px] font-normal">{item.label}</span>
                    </button>
                ))}

                {/* Разделитель */}
                <span
                    className="h-[14px] w-px"
                    style={{ backgroundColor: 'var(--at-border-divider)' }}
                />

                {/* Переключатель темы */}
                <div className="flex items-center gap-4">
                    {THEMES.map((t) => (
                        <button
                            key={t.value}
                            type="button"
                            onClick={() => setTheme(t.value)}
                            className="rounded-[6px] px-8 py-3 text-[11px] font-medium transition-all duration-150"
                            style={{
                                backgroundColor: theme === t.value
                                    ? 'var(--at-bg-active)'
                                    : 'transparent',
                                color: theme === t.value
                                    ? 'var(--at-text-nav-active)'
                                    : 'var(--at-text-icon)',
                                border: theme === t.value
                                    ? '1px solid var(--at-border-active)'
                                    : '1px solid transparent',
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Разделитель */}
                <span
                    className="h-[14px] w-px"
                    style={{ backgroundColor: 'var(--at-border-divider)' }}
                />

                {/* Пользователь */}
                <div className="flex items-center gap-8">
                    {user?.avatarUrl ? (
                        <Image
                            src={user.avatarUrl}
                            alt=""
                            width={19}
                            height={19}
                            className="shrink-0 rounded-full"
                        />
                    ) : (
                        <span
                            className="size-[19px] shrink-0 rounded-full"
                            style={{ backgroundColor: 'var(--at-bg-avatar)' }}
                        />
                    )}
                    <span
                        className="text-[13px] font-bold"
                        style={{ color: 'var(--at-text-username)' }}
                    >
                        {user?.displayName ?? 'Admin'}
                    </span>
                </div>
            </div>
        </div>
    );
};
