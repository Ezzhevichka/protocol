'use client';

import { useEffect, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

type AdminMessageModalProps = {
	squadName: string;
	onSend: (text: string) => void;
	onClose: () => void;
};

export const AdminMessageModal = ({ squadName, onSend, onClose }: AdminMessageModalProps) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const dialogRef = useRef<HTMLDivElement>(null);

	// Фокус на поле ввода при открытии
	useEffect(() => {
		textareaRef.current?.focus();
	}, []);

	// Закрытие по Escape
	useEffect(() => {
		const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [onClose]);

	const handleSend = () => {
		const text = textareaRef.current?.value.trim();
		if (!text) return;
		onSend(text);
		onClose();
	};

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (!dialogRef.current?.contains(e.target as Node)) onClose();
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center"
			style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
			onClick={handleOverlayClick}
		>
			<div
				ref={dialogRef}
				className="flex w-[420px] flex-col overflow-hidden rounded-[14px]"
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
						Отправить сообщение отряду
						<span className="ml-6 font-normal" style={{ color: 'var(--at-text-section)' }}>
							{squadName}
						</span>
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

				{/* Поле ввода */}
				<div className="p-16">
					<textarea
						ref={textareaRef}
						rows={4}
						placeholder="Введите сообщение..."
						className="w-full resize-none rounded-[8px] px-12 py-10 text-[13px] outline-none transition-colors duration-150"
						style={{
							backgroundColor: 'var(--at-bg-content)',
							border: '1px solid var(--at-border)',
							color: 'var(--at-text-nav)',
							caretColor: 'var(--at-text-nav-active)',
						}}
						onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--at-border-active)'; }}
						onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--at-border)'; }}
						onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend(); }}
					/>
					<p className="mt-6 text-[10px]" style={{ color: 'var(--at-text-section)' }}>
						Ctrl+Enter — отправить
					</p>
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
						Отменить
					</button>
					<button
						type="button"
						onClick={handleSend}
						className="rounded-[8px] px-16 py-8 text-[12px] font-semibold transition-opacity duration-150"
						style={{
							color: '#fff',
							backgroundColor: 'var(--at-bg-active)',
							border: '1px solid var(--at-border-active)',
							cursor: 'pointer',
							opacity: 0.9,
						}}
						onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
						onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.9'; }}
					>
						Отправить
					</button>
				</div>
			</div>
		</div>
	);
};
