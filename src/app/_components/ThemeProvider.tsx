'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppError } from '~/lib/error-utils.server';
import { buildHtmlClass } from '../../lib/theme-utils';

const getInitialTheme = () => {
    // Handle server-side rendering scenario
    if (typeof window === 'undefined') return 'auto';

    return localStorage.getItem('theme') ?? 'auto';
};

const changeTheme = (theme: string) => {
    const htmlElement = document.documentElement;
    htmlElement.className = buildHtmlClass(theme);
    htmlElement.style.colorScheme = theme;
};

const ThemeContext = createContext<{
    theme: string;
    setTheme: (theme: string) => void;
}>({ theme: 'light', setTheme: () => null });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        if (theme !== 'auto') {
            changeTheme(theme);
            return;
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const mediaQueryTheme = mediaQuery.matches ? 'dark' : 'light';
        changeTheme(mediaQueryTheme);

        function handleChange(e: MediaQueryListEvent) {
            const newTheme = e.matches ? 'dark' : 'light';
            changeTheme(newTheme);
        }

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new AppError({
            internalMessage: 'useTheme must be used within a ThemeProvider',
        });
    }
    return context;
}
