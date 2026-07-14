'use client';

import { useState, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon, PlusSignIcon, Tick02Icon } from '@hugeicons/core-free-icons';

export type RoleCard = {
	id: string;
	label: string;
	type: string;
	color: string | null;
};

type Props = {
	initialRoles: RoleCard[];
	roleTypes: string[];
};

const ColorField = ({
	value,
	onChange,
}: {
	value: string;
	onChange: (v: string) => void;
}) => {
	const ref = useRef<HTMLInputElement>(null);
	const hex = value.startsWith('#') ? value.slice(1) : value;

	return (
		<div
			className="flex items-center gap-8 rounded-lg px-10 py-7 cursor-pointer"
			style={{
				backgroundColor: 'var(--at-bg-content)',
				border: '1px solid var(--at-border)',
				flex: 1,
			}}
			onClick={() => ref.current?.click()}
		>
			<div
				className="shrink-0 rounded"
				style={{
					width: 14,
					height: 14,
					backgroundColor: hex ? `#${hex}` : 'transparent',
					border: '1px solid rgba(255,255,255,0.2)',
				}}
			/>
			<span className="text-[12px] font-mono" style={{ color: hex ? 'var(--at-text-nav)' : 'var(--at-text-section)' }}>
				{hex || 'не задан'}
			</span>
			<input
				ref={ref}
				type="color"
				value={hex ? `#${hex}` : '#ffffff'}
				onChange={(e) => onChange(e.target.value.slice(1))}
				className="sr-only"
				tabIndex={-1}
			/>
		</div>
	);
};

type CardProps = {
	role: RoleCard;
	onSave: (id: string, label: string, color: string | null) => Promise<void>;
	onDelete: (id: string) => Promise<void>;
};

const RoleCardItem = ({ role, onSave, onDelete }: CardProps) => {
	const [label, setLabel] = useState(role.label);
	const [color, setColor] = useState(role.color ?? '');
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const dirty = label !== role.label || color !== (role.color ?? '');

	const handleSave = async () => {
		if (!label.trim()) return;
		setSaving(true);
		await onSave(role.id, label.trim(), color || null);
		setSaving(false);
	};

	const handleDelete = async () => {
		setDeleting(true);
		await onDelete(role.id);
	};

	return (
		<div
			className="flex flex-col gap-12 rounded-xl p-16"
			style={{
				backgroundColor: 'var(--at-glass-bg)',
				border: '1px solid var(--at-glass-border)',
				backdropFilter: 'var(--at-glass-blur)',
				WebkitBackdropFilter: 'var(--at-glass-blur)',
				boxShadow: 'var(--at-glass-shadow)',
				opacity: deleting ? 0.4 : 1,
				transition: 'opacity 200ms',
			}}
		>
			{/* Заголовок: тип + кнопка удалить */}
			<div className="flex items-center justify-between">
				<span
					className="rounded px-6 py-2 text-[10px] font-bold uppercase tracking-widest"
					style={{
						backgroundColor: 'var(--at-bg-badge-active)',
						border: '1px solid var(--at-border-active)',
						color: 'var(--at-text-nav-active)',
					}}
				>
					{role.type}
				</span>
				<button
					type="button"
					onClick={handleDelete}
					disabled={deleting}
					title="Удалить роль"
					className="flex items-center justify-center rounded-lg transition-colors duration-100"
					style={{
						width: 28,
						height: 28,
						backgroundColor: 'transparent',
						border: '1px solid transparent',
						color: 'var(--at-text-section)',
						cursor: deleting ? 'default' : 'pointer',
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

			{/* Название */}
			<div className="flex flex-col gap-4">
				<span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--at-text-section)' }}>
					Название
				</span>
				<input
					value={label}
					onChange={(e) => setLabel(e.target.value)}
					className="rounded-lg px-10 py-7 text-[13px] outline-none"
					style={{
						backgroundColor: 'var(--at-bg-content)',
						border: '1px solid var(--at-border)',
						color: 'var(--at-text-nav)',
					}}
					onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--at-border-active)'; }}
					onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--at-border)'; }}
				/>
			</div>

			{/* Цвет */}
			<div className="flex flex-col gap-4">
				<span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--at-text-section)' }}>
					Цвет
				</span>
				<ColorField value={color} onChange={setColor} />
			</div>

			{/* Кнопка сохранить (только если есть изменения) */}
			{dirty && (
				<button
					type="button"
					onClick={handleSave}
					disabled={saving}
					className="flex items-center justify-center gap-6 rounded-lg py-7 text-[12px] font-semibold transition-opacity"
					style={{
						color: '#fff',
						backgroundColor: 'rgba(40,130,80,0.85)',
						border: '1px solid rgba(40,130,80,0.6)',
						cursor: saving ? 'default' : 'pointer',
						opacity: saving ? 0.6 : 1,
					}}
				>
					<HugeiconsIcon icon={Tick02Icon} size={13} color="currentColor" strokeWidth={2.5} />
					{saving ? 'Сохранение...' : 'Сохранить'}
				</button>
			)}
		</div>
	);
};

type CreateFormProps = {
	roleTypes: string[];
	onCreate: (label: string, type: string, color: string | null) => Promise<void>;
	onCancel: () => void;
};

const CreateForm = ({ roleTypes, onCreate, onCancel }: CreateFormProps) => {
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
			className="flex flex-col gap-12 rounded-xl p-16"
			style={{
				backgroundColor: 'var(--at-glass-bg)',
				border: '1px solid var(--at-border-active)',
				backdropFilter: 'var(--at-glass-blur)',
				WebkitBackdropFilter: 'var(--at-glass-blur)',
				boxShadow: 'var(--at-glass-shadow)',
			}}
		>
			<span className="text-[11px] font-semibold" style={{ color: 'var(--at-text-nav-active)' }}>
				Новая роль
			</span>

			{/* Тип */}
			<div className="flex flex-col gap-4">
				<span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--at-text-section)' }}>
					Тип
				</span>
				<select
					value={type}
					onChange={(e) => setType(e.target.value)}
					className="rounded-lg px-10 py-7 text-[13px] outline-none"
					style={{
						backgroundColor: 'var(--at-bg-content)',
						border: '1px solid var(--at-border)',
						color: 'var(--at-text-nav)',
					}}
				>
					{roleTypes.map((t) => (
						<option key={t} value={t}>{t}</option>
					))}
				</select>
			</div>

			{/* Название */}
			<div className="flex flex-col gap-4">
				<span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--at-text-section)' }}>
					Название
				</span>
				<input
					value={label}
					onChange={(e) => setLabel(e.target.value)}
					placeholder="Введите название..."
					className="rounded-lg px-10 py-7 text-[13px] outline-none"
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

			{/* Цвет */}
			<div className="flex flex-col gap-4">
				<span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--at-text-section)' }}>
					Цвет
				</span>
				<ColorField value={color} onChange={setColor} />
			</div>

			{/* Кнопки */}
			<div className="flex gap-8">
				<button
					type="button"
					onClick={onCancel}
					className="flex-1 rounded-lg py-7 text-[12px] font-medium"
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
					className="flex-1 rounded-lg py-7 text-[12px] font-semibold"
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

export const AdminRoleCards = ({ initialRoles, roleTypes }: Props) => {
	const [roles, setRoles] = useState<RoleCard[]>(initialRoles);
	const [creating, setCreating] = useState(false);

	const handleSave = async (id: string, label: string, color: string | null) => {
		const res = await fetch(`/api/roles/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ label, color }),
		});
		if (!res.ok) return;
		const updated = await res.json() as RoleCard;
		setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, label: updated.label, color: updated.color } : r)));
	};

	const handleDelete = async (id: string) => {
		const res = await fetch(`/api/roles/${id}`, { method: 'DELETE' });
		if (!res.ok) return;
		setRoles((prev) => prev.filter((r) => r.id !== id));
	};

	const handleCreate = async (label: string, type: string, color: string | null) => {
		const res = await fetch('/api/roles', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ label, type, color }),
		});
		if (!res.ok) return;
		const created = await res.json() as RoleCard;
		setRoles((prev) => [...prev, created]);
		setCreating(false);
	};

	return (
		<div className="px-20 pb-20 flex flex-col gap-16">
			{/* Шапка */}
			<div className="flex items-center justify-between">
				<div>
					<p className="text-[16px] font-semibold" style={{ color: 'var(--at-text-nav)' }}>
						Роли и права
					</p>
					<p className="text-[11px] mt-2" style={{ color: 'var(--at-text-section)' }}>
						{roles.length} {roles.length === 1 ? 'роль' : roles.length < 5 ? 'роли' : 'ролей'}
					</p>
				</div>
				{!creating && (
					<button
						type="button"
						onClick={() => setCreating(true)}
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
						Создать роль
					</button>
				)}
			</div>

			{/* Сетка карточек */}
			<div className="grid gap-12" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
				{roles.map((role) => (
					<RoleCardItem
						key={role.id}
						role={role}
						onSave={handleSave}
						onDelete={handleDelete}
					/>
				))}

				{creating && (
					<CreateForm
						roleTypes={roleTypes}
						onCreate={handleCreate}
						onCancel={() => setCreating(false)}
					/>
				)}
			</div>

			{roles.length === 0 && !creating && (
				<p className="text-center text-[13px] py-20" style={{ color: 'var(--at-text-section)' }}>
					Нет ролей. Создайте первую.
				</p>
			)}
		</div>
	);
};
