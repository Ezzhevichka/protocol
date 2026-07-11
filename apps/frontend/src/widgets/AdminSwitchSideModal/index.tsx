'use client';

import { useEffect, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

type AdminSwitchSideModalProps = {
	squadName: string;
	players: string[];
	onConfirm: () => void;
	onClose: () => void;
};

export const AdminSwitchSideModal = ({ squadName, players, onConfirm, onClose }: AdminSwitchSideModalProps) => {
	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [onClose]);

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (!dialogRef.current?.contains(e.target as Node)) onClose();
	};

	const handleConfirm = () => { onConfirm(); onClose(); };

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center"
			style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
			onClick={handleOverlayClick}
		>
			<div
				ref={dialogRef}
				className="flex w-[400px] flex-col overflow-hidden rounded-[14px]"
				style={{
					backgroundColor: 'var(--at-glass-bg)',
					border: '1px solid var(--at-glass-border)',
					backdropFilter: 'var(--at-glass-blur)',
					WebkitBackdropFilter: 'var(--at-glass-blur)',
					boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
				}}
			>
				{/* Шапка */}
				<div
					className="flex h-[52px] shrink-0 items-center gap-10 px-16"
					style={{ borderBottom: '1px solid var(--at-border-section)' }}
				>
					<span className="flex-1 text-[13px] font-semibold" style={{ color: 'var(--at-text-nav)' }}>
						Подтверждение
					</span>
					<button
						type="button"
						onClick={onClose}
						className="flex size-[26px] items-center justify-center rounded-[6px] transition-colors duration-150"
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

				{/* Тело */}
				<div className="px-16 py-14">
					<p className="text-[13px] leading-relaxed" style={{ color: 'var(--at-text-nav)' }}>
						Вы уверены, что хотите сменить сторону для отряда{' '}
						<span className="font-semibold" style={{ color: 'var(--at-text-nav-active)' }}>
							{squadName}
						</span>
						?
					</p>
					<p className="mt-6 text-[12px]" style={{ color: 'var(--at-text-section)' }}>
						Следующие игроки будут убиты и перемещены в противоположную команду:
					</p>

					<ul className="m-0 mt-10 list-none p-0">
						{players.map((nick) => (
							<li
								key={nick}
								className="py-4 text-[12px]"
								style={{ color: 'rgba(220, 70, 70, 0.9)' }}
							>
								{nick}
							</li>
						))}
					</ul>
				</div>

				{/* Кнопки */}
				<div
					className="flex shrink-0 items-center justify-end gap-8 px-16 pb-14"
				>
					<button
						type="button"
						onClick={onClose}
						className="rounded-[8px] px-16 py-8 text-[12px] font-medium transition-colors duration-150"
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
						onClick={handleConfirm}
						className="rounded-[8px] px-16 py-8 text-[12px] font-semibold transition-opacity duration-150"
						style={{
							color: '#fff',
							backgroundColor: 'rgba(60, 150, 230, 0.8)',
							border: '1px solid rgba(60, 150, 230, 0.6)',
							cursor: 'pointer',
							opacity: 0.9,
						}}
						onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
						onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.9'; }}
					>
						Сменить сторону
					</button>
				</div>
			</div>
		</div>
	);
};
