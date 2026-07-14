'use client';

import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon, PlusSignIcon, Tick02Icon } from '@hugeicons/core-free-icons';

export type RoleData = {
	id: string;
	label: string;
	type: string;
	color: string | null;
	squadPermissions: string[];
	sitePermissions: string[];
};

type Props = {
	initialRoles: RoleData[];
	roleTypes: string[];
	squadPermissions: string[];
	sitePermissions: string[];
};

type RoleState = {
	label: string;
	color: string;
	squad: Set<string>;
	site: Set<string>;
};



const ColorField = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
	const hex = value.startsWith('#') ? value.slice(1) : value;
	return (
		<label
			className="flex items-center gap-8 rounded-lg px-10 py-6 cursor-pointer"
			style={{
				position: 'relative',
				backgroundColor: 'var(--at-bg-content)',
				border: '1px solid var(--at-border)',
				flex: 1,
				minWidth: 130,
				overflow: 'hidden',
			}}
		>
			<div
				className="shrink-0 rounded-sm"
				style={{
					width: 12,
					height: 12,
					backgroundColor: hex ? `#${hex}` : 'transparent',
					border: hex ? '1px solid rgba(255,255,255,0.3)' : '1px solid var(--at-border)',
				}}
			/>
			<span className="text-[12px] font-mono" style={{ color: hex ? 'var(--at-text-nav)' : 'var(--at-text-section)' }}>
				{hex || 'не задан'}
			</span>
			<input
				type="color"
				value={hex ? `#${hex}` : '#ffffff'}
				onChange={(e) => onChange(e.target.value.slice(1))}
				style={{
					position: 'absolute',
					inset: 0,
					width: '100%',
					height: '100%',
					opacity: 0,
					cursor: 'pointer',
				}}
			/>
		</label>
	);
};


const PermCheckbox = ({
	permKey,
	checked,
	onClick,
}: {
	permKey: string;
	checked: boolean;
	onClick: () => void;
}) => (
	<button
		type="button"
		onClick={onClick}
		className="flex items-center gap-6 py-3 text-left w-full"
		style={{ background: 'none', border: 'none', cursor: 'pointer' }}
	>
		<span
			className="flex shrink-0 items-center justify-center rounded"
			style={{
				width: 14,
				height: 14,
				backgroundColor: checked ? 'rgba(40,180,100,0.2)' : 'var(--at-bg-content)',
				border: checked ? '1px solid rgba(40,180,100,0.5)' : '1px solid var(--at-border)',
			}}
		>
			{checked && <HugeiconsIcon icon={Tick02Icon} size={9} color="rgba(60,200,110,0.95)" strokeWidth={3} />}
		</span>
		<span className="text-[11px] font-mono" style={{ color: checked ? 'var(--at-text-nav)' : 'var(--at-text-section)' }}>
			{permKey}
		</span>
	</button>
);


const CreateForm = ({
	roleTypes,
	onCreate,
	onCancel,
}: {
	roleTypes: string[];
	onCreate: (label: string, type: string, color: string | null) => Promise<void>;
	onCancel: () => void;
}) => {
	const [label, setLabel] = useState('');
	const [type, setType] = useState(roleTypes[0] ?? '');
	const [color, setColor] = useState('');
	const [saving, setSaving] = useState(false);

	const handleCreate = async () => {
		if (!label.trim()) return;
		setSaving(true);
		await onCreate(label.trim(), type, color || null);
		setSaving(false);
	};

	return (
		<div
			className="flex flex-col gap-14 p-20"
			style={{
				borderBottom: '1px solid var(--at-border-section)',
				backgroundColor: 'rgba(40,130,80,0.04)',
			}}
		>
			<span className="text-[13px] font-bold" style={{ color: 'var(--at-text-nav-active)' }}>
				Новая роль
			</span>

			<div className="flex gap-12 flex-wrap">
				{/* Type */}
				<div className="flex flex-col gap-4">
					<span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--at-text-section)' }}>
						Тип
					</span>
					<select
						value={type}
						onChange={(e) => setType(e.target.value)}
						className="rounded-lg px-10 py-6 text-[12px] outline-none"
						style={{
							backgroundColor: 'var(--at-bg-content)',
							border: '1px solid var(--at-border)',
							color: 'var(--at-text-nav)',
						}}
					>
						{roleTypes.map((t) => <option key={t} value={t}>{t}</option>)}
					</select>
				</div>

				{/* Label */}
				<div className="flex flex-col gap-4" style={{ flex: 1, minWidth: 180 }}>
					<span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--at-text-section)' }}>
						Название
					</span>
					<input
						value={label}
						onChange={(e) => setLabel(e.target.value)}
						placeholder="Введите название..."
						className="rounded-lg px-10 py-6 text-[13px] outline-none"
						style={{
							backgroundColor: 'var(--at-bg-content)',
							border: '1px solid var(--at-border)',
							color: 'var(--at-text-nav)',
						}}
						onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--at-border-active)'; }}
						onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--at-border)'; }}
						onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
						autoFocus
					/>
				</div>

				{/* Color */}
				<div className="flex flex-col gap-4">
					<span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--at-text-section)' }}>
						Цвет
					</span>
					<ColorField value={color} onChange={setColor} />
				</div>
			</div>

			<div className="flex gap-8">
				<button
					type="button"
					onClick={onCancel}
					className="rounded-lg px-16 py-7 text-[12px] font-medium"
					style={{
						backgroundColor: 'transparent',
						border: '1px solid var(--at-border)',
						color: 'var(--at-text-section)',
						cursor: 'pointer',
					}}
				>
					Отмена
				</button>
				<button
					type="button"
					onClick={handleCreate}
					disabled={saving || !label.trim()}
					className="rounded-lg px-16 py-7 text-[12px] font-semibold"
					style={{
						color: '#fff',
						backgroundColor: label.trim() ? 'rgba(40,130,80,0.85)' : 'rgba(40,130,80,0.3)',
						border: '1px solid rgba(40,130,80,0.5)',
						cursor: label.trim() && !saving ? 'pointer' : 'default',
						opacity: saving ? 0.6 : 1,
					}}
				>
					{saving ? 'Создание...' : 'Создать'}
				</button>
			</div>
		</div>
	);
};


export const AdminRoleManager = ({ initialRoles, roleTypes, squadPermissions, sitePermissions }: Props) => {
	const [roles, setRoles] = useState<RoleData[]>(initialRoles);
	const [state, setState] = useState<Record<string, RoleState>>(() =>
		Object.fromEntries(
			initialRoles.map((r) => [
				r.id,
				{
					label: r.label,
					color: r.color ?? '',
					squad: new Set(r.squadPermissions),
					site: new Set(r.sitePermissions),
				},
			]),
		)
	);
	const [saving, setSaving] = useState<string | null>(null);
	const [creating, setCreating] = useState(false);

	const isDirty = (id: string): boolean => {
		const role = roles.find((r) => r.id === id);
		const s = state[id];
		if (!role || !s) return false;
		if (s.label !== role.label || s.color !== (role.color ?? '')) return true;
		if (
			s.squad.size !== role.squadPermissions.length ||
			role.squadPermissions.some((p) => !s.squad.has(p)) ||
			[...s.squad].some((p) => !role.squadPermissions.includes(p))
		) return true;
		if (
			s.site.size !== role.sitePermissions.length ||
			role.sitePermissions.some((p) => !s.site.has(p)) ||
			[...s.site].some((p) => !role.sitePermissions.includes(p))
		) return true;
		return false;
	};

	const togglePerm = (id: string, key: string, section: 'squad' | 'site') => {
		setState((prev) => {
			const cur = prev[id];
			const next = new Set(cur[section]);
			if (next.has(key)) next.delete(key); else next.add(key);
			return { ...prev, [id]: { ...cur, [section]: next } };
		});
	};

	const handleSave = async (id: string) => {
		setSaving(id);
		const s = state[id];
		try {
			const res = await fetch(`/api/roles/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					label: s.label,
					color: s.color || null,
					squadPermissions: [...s.squad],
					sitePermissions: [...s.site],
				}),
			});
			if (res.ok) {
				setRoles((prev) => prev.map((r) => r.id === id ? {
					...r,
					label: s.label,
					color: s.color || null,
					squadPermissions: [...s.squad],
					sitePermissions: [...s.site],
				} : r));
			}
		} finally {
			setSaving(null);
		}
	};

	const handleDelete = async (id: string) => {
		await fetch(`/api/roles/${id}`, { method: 'DELETE' });
		setRoles((prev) => prev.filter((r) => r.id !== id));
		setState((prev) => {
			const next = { ...prev };
			delete next[id];
			return next;
		});
	};

	const handleCreate = async (label: string, type: string, color: string | null) => {
		const res = await fetch('/api/roles', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ label, type, color }),
		});
		if (!res.ok) return;
		const created = await res.json() as RoleData;
		setRoles((prev) => [...prev, created]);
		setState((prev) => ({
			...prev,
			[created.id]: {
				label: created.label,
				color: created.color ?? '',
				squad: new Set(created.squadPermissions ?? []),
				site: new Set(created.sitePermissions ?? []),
			},
		}));
		setCreating(false);
	};

	return (
		<div className="flex flex-col">
			{/* Page header */}
			<div
				className="flex items-center justify-between px-20 py-16"
				style={{ borderBottom: '1px solid var(--at-border-section)' }}
			>
				<div>
					<p className="text-[16px] font-semibold" style={{ color: 'var(--at-text-nav)' }}>Роли и права</p>
					<p className="text-[11px] mt-1" style={{ color: 'var(--at-text-section)' }}>
						{roles.length} {roles.length === 1 ? 'роль' : roles.length < 5 ? 'роли' : 'ролей'}
					</p>
				</div>
				{!creating && (
					<button
						type="button"
						onClick={() => setCreating(true)}
						className="flex items-center gap-6 rounded-lg px-12 py-7 text-[12px] font-medium"
						style={{
							color: 'var(--at-text-section)',
							backgroundColor: 'transparent',
							border: '1px solid var(--at-border)',
							cursor: 'pointer',
						}}
						onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--at-bg-content)'; }}
						onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
					>
						<HugeiconsIcon icon={PlusSignIcon} size={12} color="currentColor" strokeWidth={2} />
						Создать роль
					</button>
				)}
			</div>

			{/* Create form */}
			{creating && (
				<CreateForm
					roleTypes={roleTypes}
					onCreate={handleCreate}
					onCancel={() => setCreating(false)}
				/>
			)}

			{/* Role blocks */}
			{roles.map((role) => {
				const s = state[role.id];
				if (!s) return null;
				const dirty = isDirty(role.id);
				const isSaving = saving === role.id;

				return (
					<div
						key={role.id}
						className="px-20 py-20"
						style={{ borderBottom: '1px solid var(--at-border-section)' }}
					>
						{/* Type heading + delete */}
						<div className="flex items-center justify-between mb-16">
							<span className="text-[15px] font-bold" style={{ color: 'var(--at-text-nav)' }}>
								{role.type}
							</span>
							<button
								type="button"
								onClick={() => handleDelete(role.id)}
								className="flex items-center justify-center rounded-lg"
								style={{
									width: 28,
									height: 28,
									backgroundColor: 'transparent',
									border: '1px solid transparent',
									color: 'var(--at-text-section)',
									cursor: 'pointer',
									transition: 'color 100ms, background-color 100ms, border-color 100ms',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.color = 'rgba(220,70,70,0.9)';
									e.currentTarget.style.backgroundColor = 'rgba(220,70,70,0.1)';
									e.currentTarget.style.borderColor = 'rgba(220,70,70,0.3)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.color = 'var(--at-text-section)';
									e.currentTarget.style.backgroundColor = 'transparent';
									e.currentTarget.style.borderColor = 'transparent';
								}}
							>
								<HugeiconsIcon icon={Delete02Icon} size={14} color="currentColor" strokeWidth={2} />
							</button>
						</div>

						{/* Name + Color */}
						<div className="flex gap-16 mb-20 flex-wrap">
							<div className="flex flex-col gap-4" style={{ flex: 1, minWidth: 180 }}>
								<span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--at-text-section)' }}>
									Название
								</span>
								<input
									value={s.label}
									onChange={(e) => {
										const val = e.target.value;
										setState((prev) => ({ ...prev, [role.id]: { ...prev[role.id], label: val } }));
									}}
									className="rounded-lg px-10 py-6 text-[13px] outline-none"
									style={{
										backgroundColor: 'var(--at-bg-content)',
										border: '1px solid var(--at-border)',
										color: 'var(--at-text-nav)',
									}}
									onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--at-border-active)'; }}
									onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--at-border)'; }}
								/>
							</div>
							<div className="flex flex-col gap-4" style={{ flex: 1, minWidth: 140 }}>
								<span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--at-text-section)' }}>
									Цвет
								</span>
								<ColorField
									value={s.color}
									onChange={(v) => setState((prev) => ({ ...prev, [role.id]: { ...prev[role.id], color: v } }))}
								/>
							</div>
						</div>

						{/* Squad permissions */}
						<div>
							<span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--at-text-section)' }}>
								Права
							</span>
							<div className="grid grid-cols-3 mt-8" style={{ gap: '2px 8px' }}>
								{squadPermissions.map((key) => (
									<PermCheckbox
										key={key}
										permKey={key}
										checked={s.squad.has(key)}
										onClick={() => togglePerm(role.id, key, 'squad')}
									/>
								))}
							</div>

							{sitePermissions.length > 0 && (
								<>
									<span
										className="text-[9px] font-bold uppercase tracking-widest mt-12 mb-4 block"
										style={{ color: 'var(--at-text-section)', opacity: 0.55 }}
									>
										Site
									</span>
									<div className="grid grid-cols-3" style={{ gap: '2px 8px' }}>
										{sitePermissions.map((key) => (
											<PermCheckbox
												key={`site-${key}`}
												permKey={key}
												checked={s.site.has(key)}
												onClick={() => togglePerm(role.id, key, 'site')}
											/>
										))}
									</div>
								</>
							)}
						</div>

						{/* Save button — shown only when dirty */}
						{dirty && (
							<div className="mt-16">
								<button
									type="button"
									onClick={() => handleSave(role.id)}
									disabled={isSaving}
									className="flex items-center gap-6 rounded-lg px-16 py-7 text-[12px] font-semibold"
									style={{
										color: '#fff',
										backgroundColor: 'rgba(40,130,80,0.85)',
										border: '1px solid rgba(40,130,80,0.6)',
										cursor: isSaving ? 'default' : 'pointer',
										opacity: isSaving ? 0.6 : 1,
									}}
								>
									<HugeiconsIcon icon={Tick02Icon} size={12} color="currentColor" strokeWidth={2.5} />
									{isSaving ? 'Сохранение...' : 'Сохранить'}
								</button>
							</div>
						)}
					</div>
				);
			})}

			{roles.length === 0 && !creating && (
				<p className="text-center text-[13px] py-20 px-20" style={{ color: 'var(--at-text-section)' }}>
					Нет ролей. Создайте первую.
				</p>
			)}
		</div>
	);
};
