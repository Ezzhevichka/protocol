'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

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

    return (
        <aside
            className="flex h-full w-[220px] shrink-0 flex-col overflow-y-auto rounded-[16px]"
            style={{
                backgroundColor: 'var(--at-glass-bg)',
                border: '1px solid var(--at-glass-border)',
                backdropFilter: 'var(--at-glass-blur)',
                WebkitBackdropFilter: 'var(--at-glass-blur)',
                boxShadow: 'var(--at-glass-shadow)',
            }}
        >
            {/* Логотип */}
            <div className="flex h-[70px] shrink-0 items-center gap-10 px-20">
                <span
                    className="font-bold tracking-wider text-[20px]"
                    style={{ color: 'var(--at-text-logo)', fontFamily: 'Oswald, sans-serif' }}
                >
                    PROTOCOL
                </span>
            </div>

            {/* Навигация */}
            <nav className="flex flex-1 flex-col gap-4 px-12 pb-12">
                {NAV_SECTIONS.map((section) => (
                    <div key={section.title}>
                        {/* Заголовок раздела */}
                        <p
                            className="mb-4 mt-12 px-8 text-[10px] font-medium uppercase tracking-widest"
                            style={{ color: 'var(--at-text-section)' }}
                        >
                            {section.title}
                        </p>

                        {/* Пункты меню */}
                        <ul className="flex flex-col gap-2">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href;

                                return (
                                    <li key={item.href}>
                                        <a
                                            href={item.href}
                                            className="flex items-center gap-10 rounded-[9px] px-12 py-10 text-[13px] transition-all duration-150"
                                            style={{
                                                color: isActive ? 'var(--at-text-nav-active)' : 'var(--at-text-nav)',
                                                backgroundColor: isActive ? 'var(--at-bg-active)' : 'transparent',
                                                border: isActive
                                                    ? '1px solid var(--at-border-active)'
                                                    : '1px solid transparent',
                                            }}
                                        >
                                            <span
                                                className="shrink-0"
                                                style={{ color: isActive ? 'var(--at-text-icon-active)' : 'var(--at-text-icon)' }}
                                            >
                                                {item.icon}
                                            </span>
                                            {item.label}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Профиль пользователя */}
            <div
                className="shrink-0 px-12 pb-16"
                style={{ borderTop: '1px solid var(--at-border-section)' }}
            >
                <div
                    className="mt-12 flex items-center gap-10 rounded-[9px] px-12 py-10"
                    style={{
                        backgroundColor: 'var(--at-bg-user-card)',
                        border: '1px solid var(--at-border)',
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
                    <div className="min-w-0">
                        <p
                            className="truncate text-[14px] font-bold"
                            style={{ color: 'var(--at-text-username)' }}
                        >
                            {user?.displayName ?? 'Admin'}
                        </p>
                        <p
                            className="text-[11px]"
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
