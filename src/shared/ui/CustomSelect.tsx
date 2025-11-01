"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Button from "@/src/shared/ui/Button";
import type { CustomSelectProps } from "@/src/types/types";

// Custom select dropdown component
export function CustomSelect({
  value, // Selected value
  onChange, // Change handler
  options, // Options for the select
  placeholder = "Select...", // Placeholder text
  disabled = false, // Disabled state
  className = "", // Additional class names
  size = "md", // Default size
}: // Props destructured from CustomSelectProps
CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    // Attach/detach event listener based on isOpen state
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Find the selected option for display
  const selectedOption = options.find((opt) => opt.value === value);
  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full ${sizeClasses} pr-10 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white text-left hover:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen ? "border-amber-500 ring-2 ring-amber-500" : ""
        }`}
      >
        <span
          className={!selectedOption ? "text-gray-400 dark:text-gray-500" : ""}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 dark:text-amber-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu - Now uses Button component with dropdown-option variant */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-2xl shadow-black/20 dark:shadow-black/50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant="dropdown-option"
              size={size}
              selected={option.value === value}
              fullWidth
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="rounded-none first:rounded-t-lg last:rounded-b-lg"
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
