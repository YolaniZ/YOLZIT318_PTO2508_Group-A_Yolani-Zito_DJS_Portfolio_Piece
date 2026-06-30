import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { readFromStorage, writeToStorage } from '../utils/storage';

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = 'djs_theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => readFromStorage(THEME_STORAGE_KEY, 'light'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    writeToStorage(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}
