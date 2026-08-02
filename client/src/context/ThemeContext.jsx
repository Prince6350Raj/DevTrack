import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('devtrack-theme') || 'light';
  });

  useEffect(() => {
    const classes = ['theme-light', 'theme-dark', 'theme-blue', 'theme-green', 'theme-purple'];
    document.documentElement.classList.remove(...classes);
    
    document.documentElement.classList.add(`theme-${theme}`);
    localStorage.setItem('devtrack-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
