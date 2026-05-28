'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type AdminNavCtx = {
    isNavigating: boolean;
    startNavigation: () => void;
    stopNavigation: () => void;
};

const AdminNavContext = createContext<AdminNavCtx>({
    isNavigating: false,
    startNavigation: () => {},
    stopNavigation: () => {},
});

export function AdminNavProvider({ children }: { children: ReactNode }) {
    const [isNavigating, setIsNavigating] = useState(false);
    const startNavigation = useCallback(() => setIsNavigating(true), []);
    const stopNavigation = useCallback(() => setIsNavigating(false), []);

    return (
        <AdminNavContext.Provider
            value={{ isNavigating, startNavigation, stopNavigation }}
        >
            {children}
        </AdminNavContext.Provider>
    );
}

export const useAdminNav = () => useContext(AdminNavContext);
