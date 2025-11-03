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

// State for delete confirmation dialog
export interface DeleteConfirmState {
  show: boolean;
  id: string;
  name?: string;
}

// Return type for useDeleteConfirmation hook
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
