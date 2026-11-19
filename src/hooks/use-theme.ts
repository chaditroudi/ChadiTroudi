import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "theme";

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** index.html sets the initial class before first paint; this hook only toggles it. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* private mode: theme just won't persist */
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
