import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'default' | 'light' | 'ocean';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: { id: Theme; name: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('app-theme');
    return (savedTheme as Theme) || 'default';
  });

  const availableThemes: { id: Theme; name: string }[] = [
    { id: 'default', name: 'Deepest Purple' },
    { id: 'light', name: 'Clean Light' },
    { id: 'ocean', name: 'Ocean Blue' },
  ];

  useEffect(() => {
    const root = document.documentElement;
    // Remove previous theme classes
    availableThemes.forEach(t => root.classList.remove(`theme-${t.id}`));
    // Add new theme class
    root.classList.add(`theme-${theme}`);
    // Save to local storage
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
