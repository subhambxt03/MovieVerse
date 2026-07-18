import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,
    isDark: theme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme CSS variables
export const themeVariables = {
  dark: {
    '--bg-primary': '#0B0F19',
    '--bg-secondary': '#1A2238',
    '--bg-navbar': '#0F172A',
    '--bg-card': '#1A2238',
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#94A3B8',
    '--border-color': 'rgba(255, 255, 255, 0.08)',
    '--shadow-color': 'rgba(0, 0, 0, 0.3)',
  },
  light: {
    '--bg-primary': '#F8FAFC',
    '--bg-secondary': '#FFFFFF',
    '--bg-navbar': '#FFFFFF',
    '--bg-card': '#FFFFFF',
    '--text-primary': '#0F172A',
    '--text-secondary': '#64748B',
    '--border-color': 'rgba(0, 0, 0, 0.08)',
    '--shadow-color': 'rgba(0, 0, 0, 0.1)',
  }
};