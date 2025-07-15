import React, { createContext, useContext } from 'react';
import { useTimeBasedTheme as useTimeBasedThemeHook } from '../hooks/useTimeBasedTheme';

type ThemeContextType = {
  isDark: boolean;
  colorScheme: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextType>({ 
  isDark: false, 
  colorScheme: 'light' 
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDark, colorScheme } = useTimeBasedThemeHook();
  
  const safeColorScheme: 'light' | 'dark' = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={{ isDark, colorScheme: safeColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTimeBasedTheme() {
  return useContext(ThemeContext);
}