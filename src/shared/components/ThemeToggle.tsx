"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/src/shared/context/ThemeContext";

// Theme toggle button component
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // Handle button click to toggle theme
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleTheme();
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-linear-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-200 dark:focus:ring-offset-gray-900 border-2 border-amber-400"
      aria-label="Toggle theme"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="w-6 h-6" />
      ) : (
        <Sun className="w-6 h-6" />
      )}
    </button>
  );
}
