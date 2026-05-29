'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export type AdminTheme = 'dark' | 'light' | 'black';

type AdminThemeContextValue = {
    theme: AdminTheme;
    setTheme: (t: AdminTheme) => void;
    accentColor: string | null;
    setAccentColor: (c: string | null) => void;
};

const AdminThemeContext = createContext<AdminThemeContextValue>({
    theme: 'dark',
    setTheme: () => {},
    accentColor: null,
    setAccentColor: () => {},
});

export const useAdminTheme = () => useContext(AdminThemeContext);

const STORAGE_KEY_THEME = 'admin-theme';
const STORAGE_KEY_ACCENT = 'admin-accent';

export const AdminThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setThemeState] = useState<AdminTheme>('dark');
    const [accentColor, setAccentColorState] = useState<string | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Читаем сохранённую тему из localStorage при монтировании
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY_THEME) as AdminTheme | null;
        if (saved && ['dark', 'light', 'black'].includes(saved)) {
            setThemeState(saved);
        }
        const savedAccent = localStorage.getItem(STORAGE_KEY_ACCENT);
        if (savedAccent) setAccentColorState(savedAccent);
    }, []);

    const setTheme = useCallback((t: AdminTheme) => {
        setThemeState(t);
        localStorage.setItem(STORAGE_KEY_THEME, t);
    }, []);

    const setAccentColor = useCallback((c: string | null) => {
        setAccentColorState(c);
        if (c) localStorage.setItem(STORAGE_KEY_ACCENT, c);
        else localStorage.removeItem(STORAGE_KEY_ACCENT);
    }, []);

    const accentVars = accentColor
        ? ({
              '--at-accent': accentColor,
              '--at-accent-glow': `${accentColor}4d`,
              '--at-accent-spotlight': `${accentColor}38`,
          } as React.CSSProperties)
        : {};

    return (
        <AdminThemeContext.Provider value={{ theme, setTheme, accentColor, setAccentColor }}>
            {/* Анти-мигание: выполняется до гидратации React, читает тему из localStorage */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `(function(){try{var t=localStorage.getItem('${STORAGE_KEY_THEME}');if(t&&['dark','light','black'].includes(t)){document.currentScript.parentElement.setAttribute('data-admin-theme',t);}}catch(e){}})()`,
                }}
            />
            <div
                ref={wrapperRef}
                data-admin-theme={theme}
                style={accentVars}
                className="contents"
            >
                {children}
            </div>
        </AdminThemeContext.Provider>
    );
};
