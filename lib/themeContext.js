import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
  isDark: false,
});

const STORAGE_KEY = "next-chapter-theme";

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Determine initial theme on client mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        setThemeState(stored);
        document.documentElement.setAttribute("data-theme", stored);
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initial = prefersDark ? "dark" : "light";
        setThemeState(initial);
        document.documentElement.setAttribute("data-theme", initial);
      }
    } catch {
      // Fallback in case localStorage is disabled
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    } catch {
      // Ignore localStorage errors
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === "dark",
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
