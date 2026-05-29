'use client';

import { Suspense, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

import { useAdminNav } from 'shared/providers/AdminNavContext';

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

function LoadingOverlay() {
    return (
        <div
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{
                backgroundColor: 'rgba(7, 17, 29, 0.55)',
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)',
            }}
        >
            <div className="flex flex-col items-center gap-12">
                <div
                    className="size-[30px] animate-spin rounded-full"
                    style={{
                        border: '2px solid rgba(255,255,255,0.08)',
                        borderTopColor: 'var(--at-accent)',
                    }}
                />
                <span className="text-[11px] font-medium" style={{ color: 'var(--at-text-section)' }}>
                    Загрузка…
                </span>
            </div>
        </div>
    );
}

export function AdminContentArea({ children }: { children: ReactNode }) {
    const { isNavigating } = useAdminNav();

    return (
        <div className="relative flex flex-1 flex-col min-h-0 overflow-hidden">
            <Suspense fallback={null}>
                <NavResetter />
            </Suspense>
            {children}
            {isNavigating && <LoadingOverlay />}
        </div>
    );
}
