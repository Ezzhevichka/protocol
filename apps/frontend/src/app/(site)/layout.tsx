import { Header } from 'widgets/Header';
import type { ReactNode } from 'react';

export default function SiteLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            {children}
        </>
    );
}
