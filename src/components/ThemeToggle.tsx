"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Respect the theme already applied by the pre-hydration script so the
    // control never flashes the wrong icon on first paint.
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`theme-toggle-circle ${isDark ? "is-dark" : "is-light"}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className="theme-icon theme-icon-moon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M7.76 4.94C5.9 5.66 4.53 7.58 4.05 10.35C3.6 13.03 4.37 15.92 6.34 17.94C8.25 19.9 11.31 20.55 14.27 19.74C17.07 18.98 19.17 16.65 19.88 13.47C18.28 13.53 16.76 13.12 15.29 12.47C13.55 11.7 12.21 10.57 11.45 9.12C10.72 7.73 10.78 6.02 11.53 4.03C10.15 4.02 8.87 4.32 7.76 4.94Z" />
        </svg>
      </span>
      <span className="theme-icon theme-icon-sun" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <circle cx="12" cy="12" r="3.45" />
          <path d="M12 2.6V5M12 19V21.4M2.6 12H5M19 12H21.4M5.35 5.35L7.05 7.05M16.95 16.95L18.65 18.65M5.35 18.65L7.05 16.95M16.95 7.05L18.65 5.35" />
        </svg>
      </span>
    </button>
  );
}
