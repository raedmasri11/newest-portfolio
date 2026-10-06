"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProjectLanguage } from "@/data/projects";

const STORAGE_KEY = "portfolio-project-language";
const CHANGE_EVENT = "portfolio-project-language-change";

function isProjectLanguage(value: string | null): value is ProjectLanguage {
  return value === "en" || value === "ar";
}

export function useProjectLanguage() {
  const [language, setLanguageState] = useState<ProjectLanguage>("en");

  useEffect(() => {
    const readStoredLanguage = () => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        setLanguageState(isProjectLanguage(stored) ? stored : "en");
      } catch {
        setLanguageState("en");
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      setLanguageState(isProjectLanguage(event.newValue) ? event.newValue : "en");
    };

    const handleLocalChange = (event: Event) => {
      const next = (event as CustomEvent<ProjectLanguage>).detail;
      if (isProjectLanguage(next)) setLanguageState(next);
    };

    readStoredLanguage();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(CHANGE_EVENT, handleLocalChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(CHANGE_EVENT, handleLocalChange);
    };
  }, []);

  const setLanguage = useCallback((next: ProjectLanguage) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The filter still works for this page if storage is unavailable.
    }
    window.dispatchEvent(new CustomEvent<ProjectLanguage>(CHANGE_EVENT, { detail: next }));
  }, []);

  return [language, setLanguage] as const;
}

export function ProjectLanguageFilter({
  value,
  onChange,
  className = "",
}: {
  value: ProjectLanguage;
  onChange: (language: ProjectLanguage) => void;
  className?: string;
}) {
  return (
    <div
      className={`project-language-filter ${className}`.trim()}
      role="group"
      aria-label="Filter projects by video language"
    >
      {(["en", "ar"] as const).map((language) => (
        <button
          key={language}
          type="button"
          className={value === language ? "is-active" : ""}
          aria-pressed={value === language}
          onClick={() => onChange(language)}
        >
          {language.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
