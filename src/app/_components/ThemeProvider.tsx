
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { buildHtmlClass } from '../_utils/theme-utils';


const ThemeContext = createContext<{
  theme: string;
  setTheme: (theme: string) => void;
}>({ theme: 'light', setTheme: () => null });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  // Synchronize theme state with HTML data attribute
  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.className = buildHtmlClass(theme);
    console.log(`DBG ${htmlElement.className}`)
    htmlElement.style.colorScheme = theme;
  }, [theme]);

  // Provide theme context to children
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for easy theme access
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}