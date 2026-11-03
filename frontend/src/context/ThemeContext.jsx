import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

// "system" follows the device's light/dark setting and is the default.
// Choosing "light" or "dark" overrides it and is remembered on this device.
export const THEME_STORAGE_KEY = "nestfind-theme";
const THEMES = ["system", "light", "dark"];
const systemQuery = "(prefers-color-scheme: dark)";

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.includes(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function applyTheme(theme) {
  const dark = theme === "dark" || (theme === "system" && window.matchMedia(systemQuery).matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme);

  useEffect(() => {
    applyTheme(theme);
    if (theme !== "system") return undefined;
    // Follow the device live, e.g. when it switches to dark mode at night.
    const media = window.matchMedia(systemQuery);
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  function setTheme(next) {
    try {
      if (next === "system") localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be blocked (e.g. private browsing); the choice still applies for this visit.
    }
    setThemeState(next);
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
