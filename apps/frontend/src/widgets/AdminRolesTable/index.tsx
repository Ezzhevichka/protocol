'use client';

import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon, Cancel01Icon, PlusSignIcon, Delete02Icon } from '@hugeicons/core-free-icons';

type Permission = {
	key: string;
	label: string;
	group: string;
};

type Role = {
	id: string;
	label: string;
	permissions: string[];
	isNew?: boolean;
};

const SQUAD_PERMISSIONS: Permission[] = [
	{ key: 'startvote',        label: 'Голосование',         group: 'Игровые' },
	{ key: 'changemap',        label: 'Смена карты',         group: 'Игровые' },
	{ key: 'pause',            label: 'Пауза',               group: 'Игровые' },
	{ key: 'cheat',            label: 'Читы',                group: 'Игровые' },
	{ key: 'private',          label: 'Приватный сквад',     group: 'Игровые' },
	{ key: 'balance',          label: 'Баланс',              group: 'Игровые' },
	{ key: 'chat',             label: 'Чат',                 group: 'Игровые' },
	{ key: 'kick',             label: 'Кик',                 group: 'Модерация' },
	{ key: 'ban',              label: 'Бан',                 group: 'Модерация' },
	{ key: 'config',           label: 'Конфигурация',        group: 'Сервер' },
	{ key: 'cameraman',        label: 'Камерамен',           group: 'Сервер' },
	{ key: 'manageserver',     label: 'Управление сервером', group: 'Сервер' },
	{ key: 'featuretest',      label: 'Тестирование',        group: 'Сервер' },
	{ key: 'reserve',          label: 'Резерв (VIP слот)',   group: 'Слоты' },
	{ key: 'demos',            label: 'Демо',                group: 'Медиа' },
	{ key: 'clientdemos',      label: 'Клиентские демо',     group: 'Медиа' },
	{ key: 'debug',            label: 'Дебаг',               group: 'Медиа' },
	{ key: 'teamchange',       label: 'Смена команды',       group: 'Команда' },
	{ key: 'forceteamchange',  label: 'Принуд. смена команды', group: 'Команда' },
	{ key: 'canseeadminchat',  label: 'Видит адм. чат',     group: 'Команда' },
];

const SITE_PERMISSIONS: Permission[] = [
	{ key: 'punish', label: 'Наказания',        group: 'Сайт' },
	{ key: 'perm',   label: 'Перм-бан',         group: 'Сайт' },
	{ key: 'kick',   label: 'Кик (сайт)',        group: 'Сайт' },
];

const ALL_PERMISSIONS = [...SQUAD_PERMISSIONS, ...SITE_PERMISSIONS];
const GROUPS = [...new Set(ALL_PERMISSIONS.map((p) => p.group))];

type AdminRolesTableProps = {
	initialRoles: Role[];
};

export const AdminRolesTable = ({ initialRoles }: AdminRolesTableProps) => {
	const [roles, setRoles] = useState<Role[]>(initialRoles);
	const [dirty, setDirty] = useState(false);

	const toggle = (roleId: string, permKey: string) => {
		setRoles((prev) =>
			prev.map((r) => {
				if (r.id !== roleId) return r;
				const has = r.permissions.includes(permKey);
				return { ...r, permissions: has ? r.permissions.filter((p) => p !== permKey) : [...r.permissions, permKey] };
			}),
		);
		setDirty(true);
	};

	const addRole = () => {
		const id = `new-${Date.now()}`;
		setRoles((prev) => [...prev, { id, label: 'Новая роль', permissions: [], isNew: true }]);
		setDirty(true);
	};

	const deleteRole = (roleId: string) => {
		setRoles((prev) => prev.filter((r) => r.id !== roleId));
		setDirty(true);
	};

	const renameRole = (roleId: string, label: string) => {
		setRoles((prev) => prev.map((r) => (r.id === roleId ? { ...r, label } : r)));
		setDirty(true);
	};

	const handleSave = () => {
		// TODO: отправить на бек
		console.log('[roles] save', roles);
		setDirty(false);
	};

	return (
		<div className="flex flex-col gap-16 px-20 pb-20">
			{/* Шапка */}
			<div className="flex items-center justify-between">
				<div>
					<p className="text-[16px] font-semibold" style={{ color: 'var(--at-text-nav)' }}>Роли и права</p>
					<p className="text-[11px] mt-2" style={{ color: 'var(--at-text-section)' }}>
						Управление правами доступа для каждой роли
					</p>
				</div>
				<div className="flex items-center gap-8">
					<button
						type="button"
						onClick={addRole}
						className="flex items-center gap-6 rounded-lg px-12 py-7 text-[12px] font-medium transition-colors duration-150"
						style={{
							color: 'var(--at-text-section)',
							backgroundColor: 'transparent',
							border: '1px solid var(--at-border)',
							cursor: 'pointer',
						}}
						onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--at-bg-content)'; }}
						onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
					>
						<HugeiconsIcon icon={PlusSignIcon} size={13} color="currentColor" strokeWidth={2} />
						Добавить роль
					</button>
					<button
						type="button"
						onClick={handleSave}
						disabled={!dirty}
						className="flex items-center gap-6 rounded-lg px-14 py-7 text-[12px] font-semibold transition-opacity duration-150"
						style={{
							color: '#fff',
							backgroundColor: dirty ? 'rgba(40,130,80,0.85)' : 'rgba(40,130,80,0.35)',
							border: dirty ? '1px solid rgba(40,130,80,0.6)' : '1px solid rgba(40,130,80,0.2)',
							cursor: dirty ? 'pointer' : 'default',
						}}
					>
						<HugeiconsIcon icon={Tick02Icon} size={13} color="currentColor" strokeWidth={2.5} />
						Сохранить
					</button>
				</div>
			</div>

			{/* Таблица */}
			<div
				className="overflow-auto rounded-xl"
				style={{
					backgroundColor: 'var(--at-glass-bg)',
					border: '1px solid var(--at-glass-border)',
					backdropFilter: 'var(--at-glass-blur)',
					WebkitBackdropFilter: 'var(--at-glass-blur)',
					boxShadow: 'var(--at-glass-shadow)',
				}}
			>
				<table className="w-full border-collapse" style={{ minWidth: `${220 + roles.length * 110}px` }}>
					<thead>
						<tr>
							{/* Угловая ячейка */}
							<th
								className="sticky left-0 z-20 px-16 py-12 text-left text-[11px] font-medium"
								style={{
									width: 220,
									minWidth: 220,
									backgroundColor: 'var(--at-bg-tab-active)',
									borderBottom: '1px solid var(--at-border-section)',
									borderRight: '1px solid var(--at-border-section)',
									color: 'var(--at-text-section)',
								}}
							>
								Право / Роль
							</th>
							{/* Заголовки ролей */}
							{roles.map((role) => (
								<th
									key={role.id}
									className="px-10 py-10 text-center"
									style={{
										minWidth: 110,
										backgroundColor: 'var(--at-bg-tab-active)',
										borderBottom: '1px solid var(--at-border-section)',
										borderRight: '1px solid var(--at-border)',
									}}
								>
									<div className="flex flex-col items-center gap-6">
										<input
											value={role.label}
											onChange={(e) => renameRole(role.id, e.target.value)}
											className="w-full rounded-md px-6 py-3 text-center text-[11px] font-semibold outline-none"
											style={{
												backgroundColor: 'transparent',
												border: '1px solid transparent',
												color: 'var(--at-text-nav)',
												caretColor: 'var(--at-text-nav-active)',
											}}
											onFocus={(e) => { e.currentTarget.style.border = '1px solid var(--at-border-active)'; e.currentTarget.style.backgroundColor = 'var(--at-bg-content)'; }}
											onBlur={(e) => { e.currentTarget.style.border = '1px solid transparent'; e.currentTarget.style.backgroundColor = 'transparent'; }}
										/>
										<button
											type="button"
											onClick={() => deleteRole(role.id)}
											className="flex items-center justify-center rounded-md transition-colors duration-100"
											style={{
												width: 22,
												height: 22,
												color: 'var(--at-text-section)',
												backgroundColor: 'transparent',
												border: '1px solid transparent',
												cursor: 'pointer',
												opacity: 0.5,
											}}
											onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(220,70,70,0.9)'; e.currentTarget.style.opacity = '1'; e.currentTarget.style.border = '1px solid rgba(220,70,70,0.3)'; }}
											onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--at-text-section)'; e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.border = '1px solid transparent'; }}
										>
											<HugeiconsIcon icon={Delete02Icon} size={11} color="currentColor" strokeWidth={2} />
										</button>
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{GROUPS.map((group, gi) => {
							const perms = ALL_PERMISSIONS.filter((p) => p.group === group);
							return perms.map((perm, pi) => {
								const isGroupHeader = pi === 0;
								const isLastInGroup = pi === perms.length - 1;
								const isLastGroup = gi === GROUPS.length - 1;

								return (
									<tr
										key={perm.key}
										style={{ backgroundColor: gi % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}
									>
										{/* Название права */}
										<td
											className="sticky left-0 z-10 px-16"
											style={{
												height: 38,
												backgroundColor: gi % 2 === 0 ? 'var(--at-bg-tab-active)' : 'color-mix(in srgb, var(--at-bg-tab-active) 90%, white 10%)',
												borderBottom: isLastInGroup && !isLastGroup ? '1px solid var(--at-border-section)' : '1px solid var(--at-border-content)',
												borderRight: '1px solid var(--at-border-section)',
											}}
										>
											<div className="flex items-center gap-8">
												{isGroupHeader && (
													<span
														className="rounded px-5 py-1 text-[9px] font-bold uppercase tracking-wider"
														style={{
															backgroundColor: 'var(--at-bg-badge-active)',
															border: '1px solid var(--at-border-active)',
															color: 'var(--at-text-nav-active)',
														}}
													>
														{group}
													</span>
												)}
												{!isGroupHeader && <span style={{ width: 0 }} />}
												<span className="text-[11px]" style={{ color: 'var(--at-text-nav)', marginLeft: isGroupHeader ? 0 : 44 }}>
													{perm.label}
												</span>
											</div>
										</td>
										{/* Чекбоксы */}
										{roles.map((role) => {
											const has = role.permissions.includes(perm.key);
											return (
												<td
													key={role.id}
													className="text-center"
													style={{
														borderBottom: isLastInGroup && !isLastGroup ? '1px solid var(--at-border-section)' : '1px solid var(--at-border-content)',
														borderRight: '1px solid var(--at-border)',
													}}
												>
													<button
														type="button"
														onClick={() => toggle(role.id, perm.key)}
														className="mx-auto flex items-center justify-center rounded-md transition-all duration-100"
														style={{
															width: 22,
															height: 22,
															backgroundColor: has ? 'rgba(40,130,80,0.2)' : 'var(--at-bg-content)',
															border: has ? '1px solid rgba(40,130,80,0.5)' : '1px solid var(--at-border)',
															cursor: 'pointer',
														}}
														onMouseEnter={(e) => { if (!has) e.currentTarget.style.borderColor = 'var(--at-border-active)'; }}
														onMouseLeave={(e) => { if (!has) e.currentTarget.style.borderColor = 'var(--at-border)'; }}
													>
														{has && (
															<HugeiconsIcon icon={Tick02Icon} size={12} color="rgba(60,180,100,0.95)" strokeWidth={2.5} />
														)}
														{!has && (
															<HugeiconsIcon icon={Cancel01Icon} size={10} color="rgba(255,255,255,0.12)" strokeWidth={2} />
														)}
													</button>
												</td>
											);
										})}
									</tr>
								);
							});
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};
