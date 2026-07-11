'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
	DashboardSquare01Icon,
	UserGroupIcon,
	Shield01Icon,
	Crown03Icon,
	AlertCircleIcon,
	UserSettings01Icon,
	ServerStack01Icon,
	Configuration01Icon,
	ChartLineData01Icon,
	Settings01Icon,
	PlugSocketIcon,
	ArrowLeft01Icon,
	ArrowRight01Icon,
	Sun03Icon,
	Moon02Icon,
	CircleIcon,
} from '@hugeicons/core-free-icons';
import { useAdminTheme, type AdminTheme } from 'shared/providers/AdminThemeProvider';
import type { AuthUser } from 'shared/types';

type NavItem = {
	label: string;
	href: string;
	icon: React.ReactNode;
};

type NavSection = {
	title: string;
	items: NavItem[];
};


/* ── Хелпер для иконки навигации ─────────────────────────────────── */

const NavIcon = ({ icon }: { icon: IconSvgElement }) => (
	<HugeiconsIcon icon={icon} size={20} color="currentColor" strokeWidth={1.5} />
);

/* ── Структура навигации ──────────────────────────────────────────── */

const THEMES: { value: AdminTheme; label: string; icon: IconSvgElement }[] = [
	{ value: 'dark',  label: 'Тёмная',  icon: Moon02Icon },
	{ value: 'light', label: 'Светлая', icon: Sun03Icon },
	{ value: 'black', label: 'Чёрная',  icon: CircleIcon },
];

const NAV_SECTIONS: NavSection[] = [
	{
		title: 'Основное',
		items: [
			{ label: 'Дашборд', href: '/admin', icon: <NavIcon icon={DashboardSquare01Icon} /> },
			{ label: 'Игроки',  href: '/admin/players', icon: <NavIcon icon={UserGroupIcon} /> },
		],
	},
	{
		title: 'Модерация',
		items: [
			{ label: 'Модерация',    href: '/admin/moderation', icon: <NavIcon icon={Shield01Icon} /> },
			{ label: 'VIP',          href: '/admin/vip',        icon: <NavIcon icon={Crown03Icon} /> },
			{ label: 'Наказания',    href: '/admin/punishments', icon: <NavIcon icon={AlertCircleIcon} /> },
			{ label: 'Роли и права', href: '/admin/roles',      icon: <NavIcon icon={UserSettings01Icon} /> },
		],
	},
	{
		title: 'Настройки',
		items: [
			{ label: 'Серверы',      href: '/admin/servers',  icon: <NavIcon icon={ServerStack01Icon} /> },
			{ label: 'Конфигурация', href: '/admin/config',   icon: <NavIcon icon={Configuration01Icon} /> },
			{ label: 'Статистика',   href: '/admin/stats',    icon: <NavIcon icon={ChartLineData01Icon} /> },
			{ label: 'Плагины',      href: '/admin/plugins',  icon: <NavIcon icon={PlugSocketIcon} /> },
			{ label: 'Настройки',    href: '/admin/settings', icon: <NavIcon icon={Settings01Icon} /> },
		],
	},
];

/* ── Компонент ────────────────────────────────────────────────────── */

type AdminSidebarProps = {
	user?: AuthUser | null;
};

export const AdminSidebar = ({ user }: AdminSidebarProps) => {
	const pathname = usePathname();
	const [collapsed, setCollapsed] = useState(false);
	const { theme, setTheme } = useAdminTheme();

	const W_EXPANDED  = 220;
	const W_COLLAPSED = 56;

	return (
		<aside
			className="flex h-full shrink-0 flex-col overflow-y-auto overflow-x-hidden rounded-2xl"
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
			<div className="flex h-70 shrink-0 items-center px-16" style={{ gap: collapsed ? 0 : 8 }}>
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

				<button
					type="button"
					onClick={() => setCollapsed((c) => !c)}
					title={collapsed ? 'Показать меню' : 'Скрыть меню'}
					className="flex items-center justify-center rounded-md transition-all duration-150"
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
					<HugeiconsIcon icon={collapsed ? ArrowRight01Icon : ArrowLeft01Icon} size={14} color="currentColor" strokeWidth={1.5} />
				</button>
			</div>

			{/* Навигация */}
			<nav className="flex flex-1 flex-col gap-4 pb-12" style={{ padding: collapsed ? '0 8px 12px' : '0 12px 12px' }}>
				{NAV_SECTIONS.map((section) => (
					<div key={section.title}>
						<div style={{ height: collapsed ? 8 : 'auto', overflow: 'hidden', transition: 'height 200ms ease' }}>
							<p
								className="mb-4 mt-12 px-8 text-[10px] font-medium uppercase tracking-widest whitespace-nowrap"
								style={{ color: 'var(--at-text-section)' }}
							>
								{section.title}
							</p>
						</div>

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
												border: isActive ? '1px solid var(--at-border-active)' : '1px solid transparent',
											}}
										>
											<span style={{ color: isActive ? 'var(--at-text-icon-active)' : 'var(--at-text-icon)' }}>
												{item.icon}
											</span>
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
			<div className="shrink-0" style={{ borderTop: '1px solid var(--at-border-section)', padding: collapsed ? '10px 8px' : '10px 12px' }}>
				{collapsed ? (
					<div
						className="flex items-center justify-center rounded-[9px]"
						style={{ height: 38, backgroundColor: 'var(--at-bg-content)', border: '1px solid var(--at-border)', color: 'var(--at-text-nav-active)' }}
					>
						{(() => { const t = THEMES.find((t) => t.value === theme); return t ? <HugeiconsIcon icon={t.icon} size={16} color="currentColor" strokeWidth={1.5} /> : null; })()}
					</div>
				) : (
					<div
						className="flex items-center rounded-[9px]"
						style={{ gap: 4, padding: '4px', backgroundColor: 'var(--at-bg-content)', border: '1px solid var(--at-border)' }}
					>
						{THEMES.map((t) => {
							const isActive = theme === t.value;
							return (
								<button
									key={t.value}
									type="button"
									title={t.label}
									onClick={() => setTheme(t.value)}
									className="flex items-center justify-center rounded-md transition-all duration-150"
									style={{
										flex: 1,
										height: 30,
										minWidth: 0,
										backgroundColor: isActive ? 'var(--at-bg-active)' : 'transparent',
										border: isActive ? '1px solid var(--at-border-active)' : '1px solid transparent',
										color: isActive ? 'var(--at-text-nav-active)' : 'var(--at-text-icon)',
										cursor: 'pointer',
										opacity: isActive ? 1 : 0.55,
									}}
									onMouseEnter={(e) => !isActive && (e.currentTarget.style.opacity = '0.9')}
									onMouseLeave={(e) => !isActive && (e.currentTarget.style.opacity = '0.55')}
								>
									<HugeiconsIcon icon={t.icon} size={16} color="currentColor" strokeWidth={1.5} />
								</button>
							);
						})}
					</div>
				)}
			</div>

			{/* Профиль */}
			<div className="shrink-0 pb-16" style={{ padding: collapsed ? '0 8px 16px' : '0 12px 16px' }}>
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
						<Image src={user.avatarUrl} alt="" width={36} height={36} className="shrink-0 rounded-full" />
					) : (
						<div className="size-36 shrink-0 rounded-full" style={{ backgroundColor: 'var(--at-bg-avatar)' }} />
					)}
					<div
						className="min-w-0 overflow-hidden"
						style={{ maxWidth: collapsed ? 0 : 140, opacity: collapsed ? 0 : 1, transition: 'max-width 220ms ease, opacity 180ms ease' }}
					>
						<p className="truncate text-[14px] font-bold whitespace-nowrap" style={{ color: 'var(--at-text-username)' }}>
							{user?.displayName ?? 'Admin'}
						</p>
						<p className="text-[11px] whitespace-nowrap" style={{ color: 'var(--at-text-role)' }}>
							Суперадмин
						</p>
					</div>
				</div>
			</div>
		</aside>
	);
};
