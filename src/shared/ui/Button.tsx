"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "ghost"
    | "edit"
    | "dropdown-option";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  selected?: boolean; // For dropdown-option variant
}

// Reusable Button component with variants and loading state
export default function Button({
  variant = "primary", // Default variant
  size = "md", // Default size
  children, // Button content
  fullWidth = false, // Full width option
  loading = false, // Loading state
  disabled, // Disabled state
  selected = false, // For dropdown-option variant
  className = "", // Additional classes
  ...props // Other button props
}: ButtonProps) {
  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm", // Small size
    md: "px-4 py-2 text-base", // Medium size
    lg: "px-6 py-3 text-lg", // Large size
  };

  // Variant classes
  const variantClasses = {
    // Primary button
    primary:
      "bg-amber-500 dark:bg-linear-to-r dark:from-amber-500 dark:to-yellow-600 text-white dark:text-black font-semibold hover:bg-amber-600 dark:hover:from-amber-600 dark:hover:to-yellow-700 transform hover:scale-105 shadow-md",
    // Secondary button
    secondary:
      "bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-300 dark:hover:bg-zinc-700 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500/50",
    // Danger button
    danger:
      "bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold hover:bg-red-200 dark:hover:bg-red-900/40 hover:border-red-400 dark:hover:border-red-700",
    // Success button
    success:
      "bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800 text-green-600 dark:text-green-400 font-semibold hover:bg-green-200 dark:hover:bg-green-900/40 hover:border-green-400 dark:hover:border-green-700",
    // Ghost button
    ghost:
      "bg-transparent border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500/50",
    // Edit button
    edit: "bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/40 hover:border-blue-400 dark:hover:border-blue-700",
    // Dropdown option
    "dropdown-option": selected
      ? "bg-yellow-100 dark:bg-yellow-600/30 text-yellow-700 dark:text-yellow-500 font-semibold border-b border-gray-200 dark:border-zinc-800 last:border-b-0 text-left"
      : // Not selected
        "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-yellow-700 dark:hover:text-yellow-500 border-b border-gray-200 dark:border-zinc-800 last:border-b-0 text-left",
  };

  // Base classes
  const baseClasses =
    "rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin">⏳</span>
          {typeof children === "string" ? `${children}...` : children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// Named export for compatibility
export { Button };
