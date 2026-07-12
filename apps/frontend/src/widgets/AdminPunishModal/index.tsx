'use client';

import { useState, useEffect, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { PUNISH_RULES } from 'shared/constants';
import type { PunishRule } from 'shared/constants';
import { PunishmentRequest, PunishmentType, WarnIntervalType } from '@protocol/types';

const BAN_DURATIONS: { value: Nullable<string>; type: 'hour' | 'day' | 'month' | 'permanent'; label: string }[] = [
	{ value: '1',  type: 'hour',      label: '1 час' },
	{ value: '2',  type: 'hour',      label: '2 часа' },
	{ value: '3',  type: 'hour',      label: '3 часа' },
	{ value: '6',  type: 'hour',      label: '6 часов' },
	{ value: '12', type: 'hour',      label: '12 часов' },
	{ value: '1',  type: 'day',       label: '1 день' },
	{ value: '2',  type: 'day',       label: '2 дня' },
	{ value: '3',  type: 'day',       label: '3 дня' },
	{ value: '4',  type: 'day',       label: '4 дня' },
	{ value: '7',  type: 'day',       label: '7 дней' },
	{ value: '14', type: 'day',       label: '14 дней' },
	{ value: '1',  type: 'month',     label: '1 месяц' },
	{ value: null, type: 'permanent', label: 'Постоянно' },
];

const computeUntil = (duration: Nullable<{ value: Nullable<string>; type: 'hour' | 'day' | 'month' | 'permanent' }>): Date | null => {
	if (!duration || duration.type === 'permanent') return null;
	const n = Number(duration.value);
	const now = new Date();
	if (duration.type === 'hour')  { now.setHours(now.getHours() + n); return now; }
	if (duration.type === 'day')   { now.setDate(now.getDate() + n); return now; }
	if (duration.type === 'month') { now.setMonth(now.getMonth() + n); return now; }
	return null;
};

const WARN_INTERVALS: { value: number; type: WarnIntervalType; label: string }[] = [
	{ value: 1,  type: 'once',   label: '1 раз' },
	{ value: 30, type: 'second', label: '30 сек' },
	{ value: 40, type: 'second', label: '40 сек' },
	{ value: 1,  type: 'minute', label: '1 мин' },
];

const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
	<button
		type="button"
		onClick={onClick}
		className="rounded-md px-10 py-4 text-[11px] font-medium transition-all duration-100"
		style={{
			color: active ? 'rgba(60,150,230,1)' : 'var(--at-text-section)',
			backgroundColor: active ? 'rgba(60,150,230,0.12)' : 'var(--at-bg-tab-active)',
			border: active ? '1px solid rgba(60,150,230,0.45)' : '1px solid var(--at-border-tab-active)',
			cursor: 'pointer',
		}}
	>
		{label}
	</button>
);

type AdminPunishModalProps = {
	nickname: string;
	serverId: Nullable<string>;
	victimId: SteamId;
	authorId: Nullable<SteamId>;
	onSubmit: (payload: PunishmentRequest) => void;
	onClose: () => void;
};

export const AdminPunishModal = ({ nickname, victimId, authorId, serverId, onSubmit, onClose }: AdminPunishModalProps) => {
	const dialogRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const [query, setQuery] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [selectedRule, setSelectedRule] = useState<PunishRule | null>(null);

	const [mode, setMode] = useState<PunishmentType>(PunishmentType.BAN);
	const [banDuration, setBanDuration] = useState<Nullable<{ value: Nullable<string>; type: 'hour' | 'day' | 'month' | 'permanent'; label: string }>>(null);
	const [warnInterval, setWarnInterval] = useState<Nullable<{ value: number; type: WarnIntervalType; label: string }>>(null);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') { if (isOpen) setIsOpen(false); else onClose(); }
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [isOpen, onClose]);

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (!dialogRef.current?.contains(e.target as Node)) onClose();
	};

	const handleSelectRule = (rule: PunishRule) => {
		setSelectedRule(rule);
		setQuery('');
		setIsOpen(false);
		if (!rule.warnText && mode === PunishmentType.WARN) setMode(PunishmentType.BAN);
		setBanDuration(null);
		setWarnInterval(null);
		inputRef.current?.blur();
	};

	const filteredRules = PUNISH_RULES.filter((r) => {
		if (!query) return true;
		const q = query.toLowerCase();
		return r.point.includes(q) || r.ruleName.toLowerCase().includes(q) || r.banReason.toLowerCase().includes(q);
	});

	const canSubmit = !!selectedRule && (
		mode === PunishmentType.BAN ? banDuration !== null : warnInterval !== null
	);

	const handleSubmit = () => {
		if (!selectedRule || !canSubmit || !authorId || !serverId) return;
		if (mode === PunishmentType.BAN) {
			onSubmit({ punishmentType: PunishmentType.BAN, victimId, authorId, reason: selectedRule.banReason, until: computeUntil(banDuration), serverId });
		} else {
			onSubmit({ punishmentType: PunishmentType.WARN, victimId, authorId, reason: selectedRule.warnText!, serverId, warnInterval: warnInterval! });
		}
		onClose();
	};

	const inputValue = isOpen ? query : selectedRule ? `[${selectedRule.point}] ${selectedRule.ruleName}` : '';

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center"
			style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
			onClick={handleOverlayClick}
		>
			<div
				ref={dialogRef}
				className="flex w-480 flex-col rounded-[14px]"
				style={{
					backgroundColor: 'var(--at-glass-bg)',
					border: '1px solid var(--at-glass-border)',
					backdropFilter: 'var(--at-glass-blur)',
					WebkitBackdropFilter: 'var(--at-glass-blur)',
					boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
					maxHeight: '90vh',
				}}
			>
				<div
					className="flex h-52 shrink-0 items-center gap-10 px-16"
					style={{ borderBottom: '1px solid var(--at-border-section)' }}
				>
					<span className="flex-1 text-[13px] font-semibold" style={{ color: 'var(--at-text-nav)' }}>
						Наказать:
						<span className="ml-6 font-normal" style={{ color: 'var(--at-text-section)' }}>
							{nickname}
						</span>
					</span>
					<button
						type="button"
						onClick={onClose}
						className="flex size-26 items-center justify-center rounded-md transition-colors duration-150"
						style={{
							color: 'var(--at-text-section)',
							backgroundColor: 'transparent',
							border: '1px solid var(--at-border)',
							cursor: 'pointer',
						}}
						onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--at-border-section)'; }}
						onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
					>
						<HugeiconsIcon icon={Cancel01Icon} size={13} color="currentColor" strokeWidth={2} />
					</button>
				</div>

				<div className="overflow-y-auto px-16 py-14">
					<input
						ref={inputRef}
						value={inputValue}
						onChange={(e) => setQuery(e.target.value)}
						onFocus={() => setIsOpen(true)}
						onBlur={() => { setTimeout(() => setIsOpen(false), 120); }}
						placeholder="Выберите нарушение..."
						className="w-full px-12 py-9 text-[12px] outline-none"
						style={{
							backgroundColor: 'var(--at-bg-content)',
							border: `1px solid ${isOpen ? 'var(--at-border-active)' : 'var(--at-border)'}`,
							color: 'var(--at-text-nav)',
							caretColor: 'var(--at-text-nav-active)',
							borderRadius: isOpen ? '8px 8px 0 0' : '8px',
						}}
					/>

					{isOpen && (
						<div
							className="overflow-y-auto"
							style={{
								backgroundColor: 'var(--at-bg-content)',
								border: '1px solid var(--at-border-active)',
								borderTop: 'none',
								borderRadius: '0 0 8px 8px',
								maxHeight: '220px',
							}}
						>
							{filteredRules.length === 0 ? (
								<p className="px-12 py-10 text-[12px]" style={{ color: 'var(--at-text-section)' }}>
									Ничего не найдено
								</p>
							) : filteredRules.map((rule) => (
								<button
									key={rule.id}
									type="button"
									onMouseDown={(e) => { e.preventDefault(); handleSelectRule(rule); }}
									className="flex w-full flex-col gap-1 px-12 py-8 text-left transition-colors duration-100"
									style={{ cursor: 'pointer', borderBottom: '1px solid var(--at-border-content)' }}
									onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
									onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
								>
									<span className="text-[11px]" style={{ color: 'var(--at-text-section)' }}>
										п.п. {rule.point} — {rule.ruleName}
									</span>
									<span className="text-[12px]" style={{ color: 'var(--at-text-nav)' }}>
										{rule.banReason}
									</span>
								</button>
							))}
						</div>
					)}

					{selectedRule && (
						<>
							<div className="mt-14 flex overflow-hidden rounded-lg" style={{ border: '1px solid var(--at-border)' }}>
								{[PunishmentType.BAN, PunishmentType.WARN].map((t) => {
									const disabled = t === PunishmentType.WARN && !selectedRule.warnText;
									const active = mode === t;
									return (
										<button
											key={t}
											type="button"
											disabled={disabled}
											onClick={() => setMode(t)}
											className="flex-1 py-8 text-[12px] font-medium transition-colors duration-100"
											style={{
												color: active ? 'var(--at-text-nav-active)' : 'var(--at-text-section)',
												backgroundColor: active ? 'rgba(60,150,230,0.12)' : 'transparent',
												borderRight: t === PunishmentType.BAN ? '1px solid var(--at-border)' : undefined,
												cursor: disabled ? 'default' : 'pointer',
												opacity: disabled ? 0.4 : 1,
											}}
										>
											{t === PunishmentType.BAN ? 'Бан' : 'Варн'}
										</button>
									);
								})}
							</div>

							{mode === PunishmentType.BAN && (
								<div className="mt-14">
									<p className="mb-8 text-[11px]" style={{ color: 'var(--at-text-section)' }}>
										Рекомендованный срок:{' '}
										<span style={{ color: 'var(--at-text-nav)' }}>{selectedRule.recommendedDuration}</span>
									</p>
									<div className="flex flex-wrap gap-6">
										{BAN_DURATIONS.map((d) => (
											<Chip
												key={d.label}
												label={d.label}
												active={d.label === banDuration?.label}
												onClick={() => setBanDuration(d)}
											/>
										))}
									</div>
								</div>
							)}

							{mode === PunishmentType.WARN && selectedRule.warnText && (
								<div className="mt-14">
									<p className="mb-6 text-[11px]" style={{ color: 'var(--at-text-section)' }}>Текст предупреждения:</p>
									<div
										className="rounded-lg px-12 py-9 text-[12px] leading-relaxed"
										style={{
											backgroundColor: 'var(--at-bg-content)',
											border: '1px solid var(--at-border)',
											color: 'var(--at-text-nav)',
										}}
									>
										{selectedRule.warnText}
									</div>

									<p className="mb-8 mt-14 text-[11px]" style={{ color: 'var(--at-text-section)' }}>Интервал:</p>
									<div className="flex flex-wrap gap-6">
										{WARN_INTERVALS.map((i) => (
											<Chip key={i.label} label={i.label} active={warnInterval?.label === i.label} onClick={() => setWarnInterval(i)} />
										))}
									</div>
								</div>
							)}

							{selectedRule.note && (
								<div
									className="mt-12 rounded-lg px-12 py-8 text-[11px] leading-relaxed"
									style={{
										backgroundColor: 'rgba(210,140,40,0.08)',
										border: '1px solid rgba(210,140,40,0.25)',
										color: 'rgba(210,160,60,0.9)',
									}}
								>
									{selectedRule.note}
								</div>
							)}
						</>
					)}
				</div>

				<div
					className="flex shrink-0 items-center justify-end gap-8 px-16 pb-14 pt-10"
					style={{ borderTop: '1px solid var(--at-border-section)' }}
				>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg px-16 py-8 text-[12px] font-medium transition-colors duration-150"
						style={{
							color: 'var(--at-text-section)',
							backgroundColor: 'transparent',
							border: '1px solid var(--at-border)',
							cursor: 'pointer',
						}}
						onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--at-border-section)'; }}
						onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
					>
						Отмена
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={!canSubmit}
						className="rounded-lg px-16 py-8 text-[12px] font-semibold transition-opacity duration-150"
						style={{
							color: '#fff',
							backgroundColor: 'rgba(220,70,70,0.8)',
							border: '1px solid rgba(220,70,70,0.6)',
							cursor: canSubmit ? 'pointer' : 'default',
							opacity: canSubmit ? 0.9 : 0.4,
						}}
						onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.opacity = '1'; }}
						onMouseLeave={(e) => { if (canSubmit) e.currentTarget.style.opacity = '0.9'; }}
					>
						Наказать
					</button>
				</div>
			</div>
		</div>
	);
};
