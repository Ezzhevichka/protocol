'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAdminTheme, type AdminTheme } from 'shared/providers/AdminThemeProvider';

type NavItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
};

type NavSection = {
    title: string;
    items: NavItem[];
};

const IconDashboard = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.9" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.9" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.9" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.9" />
    </svg>
);

const IconPlayers = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="8" cy="6" r="3" fill="currentColor" opacity="0.9" />
        <path d="M2 16c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="15" cy="7" r="2" fill="currentColor" opacity="0.6" />
        <path d="M13 16c0-2.21.895-4.21 2.343-5.657" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
);

const IconQueue = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 5h12M4 10h8M4 15h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="15" cy="15" r="2.5" fill="currentColor" opacity="0.9" />
    </svg>
);

const IconDisconnected = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="3" fill="currentColor" opacity="0.9" />
        <path d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="3" x2="18" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="7" x2="18" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const IconModeration = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L3 5v5c0 4.418 3.134 8.559 7 9.5C13.866 18.559 17 14.418 17 10V5L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconReports = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 3h12a1 1 0 011 1v9a1 1 0 01-1 1H7l-4 3V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="7" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="7" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const IconComplaints = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="10" y1="6" x2="10" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="10" cy="14" r="1" fill="currentColor" />
    </svg>
);

const IconServers = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="3" width="16" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2" y="12" width="16" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15" cy="5.5" r="1" fill="currentColor" />
        <circle cx="15" cy="14.5" r="1" fill="currentColor" />
    </svg>
);

const IconConfig = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.343 4.343l1.414 1.414M14.243 14.243l1.414 1.414M4.343 15.657l1.414-1.414M14.243 5.757l1.414-1.414" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const IconStats = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 15l4-5 3 3 3-6 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconPlugins = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M13 3v4h4l-6 7v-4H7l6-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
);

const IconSettings = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.9" />
        <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.343 4.343l1.414 1.414M14.243 14.243l1.414 1.414M4.343 15.657l1.414-1.414M14.243 5.757l1.414-1.414" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const IconRoles = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 4l1 1.5L17 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconThemeDark = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M12 8.5A5.5 5.5 0 0 1 5.5 2a5.5 5.5 0 1 0 6.5 6.5z" fill="currentColor" opacity="0.9" />
    </svg>
);

const IconThemeLight = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="3" fill="currentColor" />
        <line x1="7.5" y1="0.5" x2="7.5" y2="2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="7.5" y1="12.5" x2="7.5" y2="14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="0.5" y1="7.5" x2="2.5" y2="7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="12.5" y1="7.5" x2="14.5" y2="7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="2.575" y1="2.575" x2="4" y2="4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="11" y1="11" x2="12.425" y2="12.425" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="11" y1="4" x2="12.425" y2="2.575" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="2.575" y1="12.425" x2="4" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);

const IconThemeBlack = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5" fill="currentColor" opacity="0.9" />
    </svg>
);

const THEMES: { value: AdminTheme; label: string; icon: React.ReactNode }[] = [
    { value: 'dark',  label: 'Тёмная',  icon: <IconThemeDark /> },
    { value: 'light', label: 'Светлая', icon: <IconThemeLight /> },
    { value: 'black', label: 'Чёрная',  icon: <IconThemeBlack /> },
];

const IconChevronLeft = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconChevronRight = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const NAV_SECTIONS: NavSection[] = [
    {
        title: 'Основное',
        items: [
            { label: 'Дашборд', href: '/admin', icon: <IconDashboard /> },
            { label: 'Игроки', href: '/admin/players', icon: <IconPlayers /> },
            { label: 'Очередь', href: '/admin/queue', icon: <IconQueue /> },
            { label: 'Отключившиеся', href: '/admin/disconnected', icon: <IconDisconnected /> },
        ],
    },
    {
        title: 'Модерация',
        items: [
            { label: 'Модерация', href: '/admin/moderation', icon: <IconModeration /> },
            { label: 'Репорты', href: '/admin/reports', icon: <IconReports /> },
            { label: 'Жалобы', href: '/admin/complaints', icon: <IconComplaints /> },
        ],
    },
    {
        title: 'Серверы',
        items: [
            { label: 'Серверы', href: '/admin/servers', icon: <IconServers /> },
            { label: 'Конфигурация', href: '/admin/config', icon: <IconConfig /> },
            { label: 'Статистика', href: '/admin/stats', icon: <IconStats /> },
        ],
    },
    {
        title: 'Настройки',
        items: [
            { label: 'Плагины', href: '/admin/plugins', icon: <IconPlugins /> },
            { label: 'Настройки', href: '/admin/settings', icon: <IconSettings /> },
            { label: 'Роли и права', href: '/admin/roles', icon: <IconRoles /> },
        ],
    },
];

type AdminSidebarProps = {
    user?: {
        displayName: string | null;
        avatarUrl: string | null;
    };
};

export const AdminSidebar = ({ user }: AdminSidebarProps) => {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const { theme, setTheme } = useAdminTheme();

    const W_EXPANDED  = 220;
    const W_COLLAPSED = 56;

    return (
        <aside
            className="flex h-full shrink-0 flex-col overflow-y-auto overflow-x-hidden rounded-[16px]"
            style={{
                width: collapsed ? W_COLLAPSED : W_EXPANDED,
                transition: 'width 240ms ease',
                backgroundColor: 'var(--at-glass-bg)',
                border: '1px solid var(--at-glass-border)',
                backdropFilter: 'var(--at-glass-blur)',
                WebkitBackdropFilter: 'var(--at-glass-blur)',
                boxShadow: 'var(--at-glass-shadow)',
            }}
        >
            {/* Логотип + кнопка свернуть */}
            <div className="flex h-[70px] shrink-0 items-center px-16" style={{ gap: collapsed ? 0 : 8 }}>
                {/* Логотип */}
                <span
                    className="font-bold tracking-wider overflow-hidden whitespace-nowrap"
                    style={{
                        color: 'var(--at-text-logo)',
                        fontFamily: 'Oswald, sans-serif',
                        fontSize: collapsed ? 16 : 20,
                        maxWidth: collapsed ? 24 : 200,
                        transition: 'max-width 240ms ease, font-size 240ms ease',
                        display: 'block',
                    }}
                >
                    {collapsed ? 'P' : 'PROTOCOL'}
                </span>

                {/* Кнопка скрыть/показать */}
                <button
                    type="button"
                    onClick={() => setCollapsed((c) => !c)}
                    title={collapsed ? 'Показать меню' : 'Скрыть меню'}
                    className="flex items-center justify-center rounded-[6px] transition-all duration-150"
                    style={{
                        marginLeft: 'auto',
                        width: 24,
                        height: 24,
                        flexShrink: 0,
                        border: '1px solid var(--at-border)',
                        backgroundColor: 'var(--at-bg-content)',
                        color: 'var(--at-text-section)',
                        cursor: 'pointer',
                        opacity: 0.7,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                >
                    {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
                </button>
            </div>

            {/* Навигация */}
            <nav className="flex flex-1 flex-col gap-4 pb-12" style={{ padding: collapsed ? '0 8px 12px' : '0 12px 12px' }}>
                {NAV_SECTIONS.map((section) => (
                    <div key={section.title}>
                        {/* Заголовок раздела */}
                        <div
                            style={{
                                height: collapsed ? 8 : 'auto',
                                overflow: 'hidden',
                                transition: 'height 200ms ease',
                            }}
                        >
                            <p
                                className="mb-4 mt-12 px-8 text-[10px] font-medium uppercase tracking-widest whitespace-nowrap"
                                style={{ color: 'var(--at-text-section)' }}
                            >
                                {section.title}
                            </p>
                        </div>

                        {/* Пункты меню */}
                        <ul className="flex flex-col gap-2">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href;

                                return (
                                    <li key={item.href}>
                                        <a
                                            href={item.href}
                                            title={collapsed ? item.label : undefined}
                                            className="flex items-center rounded-[9px] transition-all duration-150"
                                            style={{
                                                gap: collapsed ? 0 : 10,
                                                padding: collapsed ? '10px 0' : '10px 12px',
                                                justifyContent: collapsed ? 'center' : 'flex-start',
                                                color: isActive ? 'var(--at-text-nav-active)' : 'var(--at-text-nav)',
                                                backgroundColor: isActive ? 'var(--at-bg-active)' : 'transparent',
                                                border: isActive
                                                    ? '1px solid var(--at-border-active)'
                                                    : '1px solid transparent',
                                            }}
                                        >
                                            <span
                                                className="shrink-0"
                                                style={{
                                                    color: isActive ? 'var(--at-text-icon-active)' : 'var(--at-text-icon)',
                                                }}
                                            >
                                                {item.icon}
                                            </span>

                                            {/* Лейбл — скрывается плавно */}
                                            <span
                                                className="overflow-hidden whitespace-nowrap text-[13px]"
                                                style={{
                                                    maxWidth: collapsed ? 0 : 160,
                                                    opacity: collapsed ? 0 : 1,
                                                    transition: 'max-width 220ms ease, opacity 180ms ease',
                                                    display: 'block',
                                                }}
                                            >
                                                {item.label}
                                            </span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Выбор темы */}
            <div
                className="shrink-0"
                style={{
                    borderTop: '1px solid var(--at-border-section)',
                    padding: collapsed ? '10px 8px' : '10px 12px',
                }}
            >
                {collapsed ? (
                    /* Свёрнуто — только иконка активной темы */
                    <div
                        className="flex items-center justify-center rounded-[9px]"
                        style={{
                            height: 38,
                            backgroundColor: 'var(--at-bg-content)',
                            border: '1px solid var(--at-border)',
                            color: 'var(--at-text-nav-active)',
                        }}
                    >
                        {THEMES.find((t) => t.value === theme)?.icon}
                    </div>
                ) : (
                    /* Развёрнуто — все три кнопки */
                    <div
                        className="flex items-center rounded-[9px]"
                        style={{
                            gap: 4,
                            padding: '4px',
                            backgroundColor: 'var(--at-bg-content)',
                            border: '1px solid var(--at-border)',
                        }}
                    >
                        {THEMES.map((t) => {
                            const isActive = theme === t.value;
                            return (
                                <button
                                    key={t.value}
                                    type="button"
                                    title={t.label}
                                    onClick={() => setTheme(t.value)}
                                    className="flex items-center justify-center rounded-[6px] transition-all duration-150"
                                    style={{
                                        flex: 1,
                                        height: 30,
                                        minWidth: 0,
                                        backgroundColor: isActive ? 'var(--at-bg-active)' : 'transparent',
                                        border: isActive ? '1px solid var(--at-border-active)' : '1px solid transparent',
                                        color: isActive ? 'var(--at-text-nav-active)' : 'var(--at-text-icon)',
                                        cursor: 'pointer',
                                        opacity: isActive ? 1 : 0.55,
                                        transition: 'background-color 150ms ease, opacity 150ms ease',
                                    }}
                                    onMouseEnter={(e) => !isActive && (e.currentTarget.style.opacity = '0.9')}
                                    onMouseLeave={(e) => !isActive && (e.currentTarget.style.opacity = '0.55')}
                                >
                                    {t.icon}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Профиль пользователя */}
            <div
                className="shrink-0 pb-16"
                style={{
                    padding: collapsed ? '0 8px 16px' : '0 12px 16px',
                }}
            >
                <div
                    className="mt-12 flex items-center rounded-[9px] overflow-hidden"
                    style={{
                        gap: collapsed ? 0 : 10,
                        padding: collapsed ? '10px 0' : '10px 12px',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        backgroundColor: 'var(--at-bg-user-card)',
                        border: '1px solid var(--at-border)',
                        transition: 'padding 240ms ease, gap 240ms ease',
                    }}
                >
                    {user?.avatarUrl ? (
                        <Image
                            src={user.avatarUrl}
                            alt=""
                            width={36}
                            height={36}
                            className="shrink-0 rounded-full"
                        />
                    ) : (
                        <div
                            className="size-36 shrink-0 rounded-full"
                            style={{ backgroundColor: 'var(--at-bg-avatar)' }}
                        />
                    )}

                    {/* Имя и роль */}
                    <div
                        className="min-w-0 overflow-hidden"
                        style={{
                            maxWidth: collapsed ? 0 : 140,
                            opacity: collapsed ? 0 : 1,
                            transition: 'max-width 220ms ease, opacity 180ms ease',
                        }}
                    >
                        <p
                            className="truncate text-[14px] font-bold whitespace-nowrap"
                            style={{ color: 'var(--at-text-username)' }}
                        >
                            {user?.displayName ?? 'Admin'}
                        </p>
                        <p
                            className="text-[11px] whitespace-nowrap"
                            style={{ color: 'var(--at-text-role)' }}
                        >
                            Суперадмин
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
