import { ButtonHTMLAttributes, ReactNode } from "react";

// API Error Response Type
export interface ApiErrorResponse {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

// Theme Types
export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// JWT Payload Type
export interface JWTPayload {
  exp: number;
  userId: string;
  role?: string;
  iat?: number;
}

// BackButton component props
export interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

// CustomSelect component props
export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
}

// ErrorAlert component props
export interface ErrorAlertProps {
  message: string;
  className?: string;
}

// LoadingState component props
export interface LoadingStateProps {
  message?: string;
}

// Modal component props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

// SearchBar component props
export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  className?: string;
}

// StatusBadge component props
export interface StatusBadgeProps {
  status: "pending" | "processing" | "shipped" | "cancelled";
  className?: string;
}

// Table component props
export interface Column {
  key: string;
  label: string;
  className?: string;
}

// Table component props
export interface TableProps<T> {
  columns: Column[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}
// Button component props
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
