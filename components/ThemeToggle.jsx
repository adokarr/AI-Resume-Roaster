import React from "react";
import { useTheme } from "../lib/themeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark, mounted } = useTheme();

  // Until mounted, render a placeholder with equal layout footprint to avoid hydration shift
  if (!mounted) {
    return (
      <button
        type="button"
        className="theme-toggle-btn"
        aria-label="Toggle light and dark mode"
        disabled
      >
        <span className="theme-toggle-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
          </svg>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="theme-toggle-pill" aria-hidden="true">
        <span className={`theme-toggle-slider ${isDark ? "is-dark" : "is-light"}`} />
        <span className={`theme-toggle-slot ${!isDark ? "is-active" : ""}`}>
          {/* Sun icon */}
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="theme-sun-icon"
          >
            <circle cx="12" cy="12" r="4.5" fill="currentColor" fillOpacity="0.25" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        </span>
        <span className={`theme-toggle-slot ${isDark ? "is-active" : ""}`}>
          {/* Moon icon */}
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="theme-moon-icon"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </span>
      </span>
      <span className="theme-toggle-label">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
