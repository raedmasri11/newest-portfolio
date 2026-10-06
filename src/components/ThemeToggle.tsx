"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const SYSTEM_QUERY = "(prefers-color-scheme: dark)";

function getStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}


function applyTheme(theme: Theme, source: "manual" | "system") {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.dataset.themeSource = source;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const media = window.matchMedia(SYSTEM_QUERY);

    const syncFromPreference = () => {
      const stored = getStoredTheme();
      const next = stored ?? (media.matches ? "dark" : "light");
      applyTheme(next, stored ? "manual" : "system");
      setTheme(next);
    };

    const onSystemChange = (event: MediaQueryListEvent) => {
      if (getStoredTheme()) return;
      const next: Theme = event.matches ? "dark" : "light";
      applyTheme(next, "system");
      setTheme(next);
    };

    const onThemeChange = (event: Event) => {
      const next = (event as CustomEvent<Theme>).detail;
      if (next === "light" || next === "dark") setTheme(next);
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) syncFromPreference();
    };

    syncFromPreference();
    media.addEventListener("change", onSystemChange);
    window.addEventListener("raed-theme-change", onThemeChange as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      media.removeEventListener("change", onSystemChange);
      window.removeEventListener("raed-theme-change", onThemeChange as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const toggleTheme = () => {
    const current: Theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    const next: Theme = current === "dark" ? "light" : "dark";
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch { /* storage can be unavailable */ }
    applyTheme(next, "manual");
    setTheme(next);
    window.dispatchEvent(new CustomEvent<Theme>("raed-theme-change", { detail: next }));
  };

  const isDark = theme === "dark";
  const stateClass = theme ? (isDark ? "is-dark" : "is-light") : "";
  const toggleLabel = theme ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle appearance";

  return (
    <button
      type="button"
      className={`theme-toggle-circle ${stateClass}`}
      onClick={toggleTheme}
      aria-label={toggleLabel}
      title={toggleLabel}
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
