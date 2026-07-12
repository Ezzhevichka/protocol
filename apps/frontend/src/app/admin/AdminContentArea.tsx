'use client';

import { Suspense, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

import { useAdminNav } from 'shared/providers/AdminNavContext';
import { AdminLoadingOverlay } from 'shared/ui';

// Сбрасывает isNavigating когда URL изменился (навигация завершена)
function NavResetter() {
	const { stopNavigation } = useAdminNav();
	const searchParams = useSearchParams();
	const mounted = useRef(false);

	useEffect(() => {
		if (!mounted.current) {
			mounted.current = true;
			return;
		}
		stopNavigation();
	}, [searchParams, stopNavigation]);

	return null;
}

export function AdminContentArea({ children }: { children: ReactNode }) {
	const { isNavigating } = useAdminNav();

	return (
		<div className="relative flex flex-1 flex-col min-h-0 overflow-hidden">
			<Suspense fallback={null}>
				<NavResetter />
			</Suspense>
			{children}
			{isNavigating && <AdminLoadingOverlay />}
		</div>
	);
}
