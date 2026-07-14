'use client';

import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';

export type PermMeta = string;

export type RoleWithPerms = {
	id: string;
	label: string;
	squadPermissions: string[];
	sitePermissions: string[];
};

type Props = {
	roles: RoleWithPerms[];
	squadPermissions: string[];
	sitePermissions: string[];
};

type PermState = Record<string, { squad: Set<string>; site: Set<string>; dirty: boolean }>;

const RolePermTable = ({
	role,
	squad,
	site,
	perms,
	onToggle,
	onSave,
	saving,
}: {
	role: RoleWithPerms;
	squad: Set<string>;
	site: Set<string>;
	perms: { squad: string[]; site: string[] };
	onToggle: (key: string, section: 'squad' | 'site') => void;
	onSave: () => void;
	saving: boolean;
}) => {
	const dirty = squad.size !== role.squadPermissions.length ||
		role.squadPermissions.some((p) => !squad.has(p)) ||
		[...squad].some((p) => !role.squadPermissions.includes(p)) ||
		site.size !== role.sitePermissions.length ||
		role.sitePermissions.some((p) => !site.has(p)) ||
		[...site].some((p) => !role.sitePermissions.includes(p));

	return (
		<div
			className="flex flex-col rounded-xl overflow-hidden"
			style={{
				backgroundColor: 'var(--at-glass-bg)',
				border: '1px solid var(--at-glass-border)',
				backdropFilter: 'var(--at-glass-blur)',
				WebkitBackdropFilter: 'var(--at-glass-blur)',
				boxShadow: 'var(--at-glass-shadow)',
				minWidth: 200,
			}}
		>
			{/* Шапка роли */}
			<div
				className="flex items-center justify-between px-12 py-8"
				style={{ borderBottom: '1px solid var(--at-border-section)' }}
			>
				<span className="text-[12px] font-semibold" style={{ color: 'var(--at-text-nav)' }}>
					{role.label}
				</span>
				{dirty && (
					<button
						type="button"
						onClick={onSave}
						disabled={saving}
						className="rounded px-8 py-3 text-[10px] font-semibold"
						style={{
							color: '#fff',
							backgroundColor: 'rgba(40,130,80,0.85)',
							border: '1px solid rgba(40,130,80,0.5)',
							cursor: saving ? 'default' : 'pointer',
							opacity: saving ? 0.6 : 1,
						}}
					>
						{saving ? '...' : 'Сохранить'}
					</button>
				)}
			</div>

			{/* SquadPermissions */}
			<div style={{ borderBottom: '1px solid var(--at-border-section)' }}>
				<div className="px-12 py-5">
					<span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--at-text-section)' }}>
						SquadPermissions
					</span>
				</div>
				{perms.squad.map((key) => {
					const has = squad.has(key);
					return (
						<button
							key={key}
							type="button"
							onClick={() => onToggle(key, 'squad')}
							className="flex w-full items-center gap-8 px-12 py-5 transition-colors duration-100"
							style={{
								backgroundColor: has ? 'rgba(40,130,80,0.08)' : 'transparent',
								border: 'none',
								borderTop: '1px solid var(--at-border-content)',
								cursor: 'pointer',
								textAlign: 'left',
							}}
						>
							<span
								className="flex shrink-0 items-center justify-center rounded"
								style={{
									width: 14,
									height: 14,
									backgroundColor: has ? 'rgba(40,180,100,0.25)' : 'var(--at-bg-content)',
									border: has ? '1px solid rgba(40,180,100,0.5)' : '1px solid var(--at-border)',
								}}
							>
								{has && <HugeiconsIcon icon={Tick02Icon} size={9} color="rgba(60,200,110,0.95)" strokeWidth={3} />}
							</span>
							<span className="text-[11px] font-mono" style={{ color: has ? 'var(--at-text-nav)' : 'var(--at-text-section)' }}>
								{key}
							</span>
						</button>
					);
				})}
			</div>

			{/* SitePermissions */}
			<div>
				<div className="px-12 py-5">
					<span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--at-text-section)' }}>
						SitePermissions
					</span>
				</div>
				{perms.site.map((key) => {
					const has = site.has(key);
					return (
						<button
							key={key}
							type="button"
							onClick={() => onToggle(key, 'site')}
							className="flex w-full items-center gap-8 px-12 py-5 transition-colors duration-100"
							style={{
								backgroundColor: has ? 'rgba(40,130,80,0.08)' : 'transparent',
								border: 'none',
								borderTop: '1px solid var(--at-border-content)',
								cursor: 'pointer',
								textAlign: 'left',
							}}
						>
							<span
								className="flex shrink-0 items-center justify-center rounded"
								style={{
									width: 14,
									height: 14,
									backgroundColor: has ? 'rgba(40,180,100,0.25)' : 'var(--at-bg-content)',
									border: has ? '1px solid rgba(40,180,100,0.5)' : '1px solid var(--at-border)',
								}}
							>
								{has && <HugeiconsIcon icon={Tick02Icon} size={9} color="rgba(60,200,110,0.95)" strokeWidth={3} />}
							</span>
							<span className="text-[11px] font-mono" style={{ color: has ? 'var(--at-text-nav)' : 'var(--at-text-section)' }}>
								{key}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export const AdminPermissionsMatrix = ({ roles, squadPermissions, sitePermissions }: Props) => {
	const [state, setState] = useState<PermState>(() =>
		Object.fromEntries(
			roles.map((r) => [
				r.id,
				{ squad: new Set(r.squadPermissions), site: new Set(r.sitePermissions), dirty: false },
			]),
		),
	);
	const [saving, setSaving] = useState<string | null>(null);

	const toggle = (roleId: string, key: string, section: 'squad' | 'site') => {
		setState((prev) => {
			const cur = prev[roleId];
			const next = new Set(cur[section]);
			if (next.has(key)) next.delete(key); else next.add(key);
			return { ...prev, [roleId]: { ...cur, [section]: next, dirty: true } };
		});
	};

	const handleSave = async (roleId: string) => {
		setSaving(roleId);
		await fetch(`/api/roles/${roleId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				squadPermissions: [...state[roleId].squad],
				sitePermissions:  [...state[roleId].site],
			}),
		});
		setState((prev) => ({ ...prev, [roleId]: { ...prev[roleId], dirty: false } }));
		setSaving(null);
	};

	if (roles.length === 0) return null;

	return (
		<div className="px-20 pb-20 flex flex-col gap-12">
			<div>
				<p className="text-[16px] font-semibold" style={{ color: 'var(--at-text-nav)' }}>Права</p>
				<p className="text-[11px] mt-2" style={{ color: 'var(--at-text-section)' }}>
					SquadPermissions и SitePermissions по каждой роли
				</p>
			</div>

			<div className="flex flex-wrap gap-12">
				{roles.map((role) => (
					<RolePermTable
						key={role.id}
						role={role}
						squad={state[role.id]?.squad ?? new Set()}
						site={state[role.id]?.site ?? new Set()}
						perms={{ squad: squadPermissions, site: sitePermissions }}
						onToggle={(key, section) => toggle(role.id, key, section)}
						onSave={() => handleSave(role.id)}
						saving={saving === role.id}
					/>
				))}
			</div>
		</div>
	);
};
