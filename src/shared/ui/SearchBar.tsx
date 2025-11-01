import React from "react";
import { SearchBarProps } from "@/src/types/types";

export default function SearchBar({
  value, // Current input value
  onChange, // Handler for input changes
  onSearch, // Optional handler for search action
  placeholder = "Search...", // Placeholder text
  className = "", // Additional CSS classes
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`px-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
}
