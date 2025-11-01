"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Theme, ThemeContextType } from "@/src/types/types";

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

    // Apply theme to document
    try {
      const html = document.documentElement;

      // Remove both classes first
      html.classList.remove("light", "dark");
      html.classList.add(theme);

      // Save to localStorage
      localStorage.setItem("admin-theme", theme);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error applying theme:", error);
      }
    }
  }, [theme, mounted]);

  // Toggle function to switch themes
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
