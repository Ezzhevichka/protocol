'use client';

import { useEffect, useState } from 'react';

export const StickyHeader = ({ children }: { children: React.ReactNode }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className="sticky top-0 z-50 h-[70px] w-full transition-all duration-300"
            style={
                scrolled
                    ? {
                        backdropFilter: 'blur(20px) saturate(160%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                        backgroundColor: 'rgba(10, 15, 25, 0.6)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                    }
                    : {
                        backgroundColor: 'var(--color-background)',
                    }
            }
        >
            {children}
        </header>
    );
};
