"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Theme, ThemeContextType } from "@/src/types/types";

// Context for managing light/dark theme
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always start with dark on both server and client to avoid hydration mismatch
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // On mount read from localStorage and update if different
  useEffect(() => {
    setMounted(true);

    // Reads from localStorage after mount
    const savedTheme = localStorage.getItem("admin-theme") as Theme;
    if (savedTheme && savedTheme !== theme) {
      setTheme(savedTheme);
    }
  }, []); // Only run once on mount

  // Applies theme to document when theme changes
  useEffect(() => {
    if (!mounted) return;

    // Applies theme to document
    try {
      const html = document.documentElement;

      // Removes both classes first
      html.classList.remove("light", "dark");
      html.classList.add(theme);

      // Saves to localStorage
      localStorage.setItem("admin-theme", theme);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error applying theme:", error);
      }
    }
  }, [theme, mounted]);

  // Toggles function to switch themes
  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      return newTheme;
    });
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the ThemeContext
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
