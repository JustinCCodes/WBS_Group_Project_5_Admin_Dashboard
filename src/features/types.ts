// Shared types for Admin features
import type { Order } from "./orders/types";

// Dashboard Stats (uses Order from orders feature)
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  newestOrders: Order[];
}

// Product summary for reports
export interface ProductSummary {
  id: string;
  name: string;
  price: number;
}

// Product line item for test orders
export interface ProductLineItem {
  productId: string;
  quantity: number;
}

// Hook types
export interface UseAdminFormOptions<T> {
  initialData: T;
  onSubmit: (data: T) => Promise<void>;
  onSuccess?: () => void;
}

// Resource fetch hook types
export interface UseResourceFetchOptions<T> {
  maxRetries?: number;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  enabled?: boolean; // Allow disabling auto-fetch
}

// Return type for useResourceFetch hook
export interface UseResourceFetchReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: (silent?: boolean) => Promise<void>;
  reset: () => void;
}

// Product line for test order form state
export interface ProductLine {
  productId: string;
  quantity: number;
}

// Options for useApiMutation hook
export interface UseApiMutationOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void | Promise<void>;
  onError?: (error: unknown) => void;
}

// Return type for useApiMutation hook
export interface UseApiMutationReturn<TArgs extends any[], TResult> {
  mutate: (...args: TArgs) => Promise<TResult | undefined>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

// Delete confirmation state and handlers
export interface DeleteConfirmState {
  show: boolean;
  id: string;
  name?: string;
}

export interface UseDeleteConfirmationReturn {
  // State
  deleteConfirm: DeleteConfirmState;

  // Actions
  openDeleteConfirm: (id: string, name?: string) => void;
  handleConfirmDelete: (
    deleteFn: (id: string) => Promise<void>
  ) => Promise<void>;
  handleCancelDelete: () => void;

  // Dialog props
  dialogProps: {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    variant: "danger";
  };
}
