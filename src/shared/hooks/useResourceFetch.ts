import { useState, useEffect, useCallback, type DependencyList } from "react";
import { getErrorMessage } from "@/src/shared/lib/utils";
import type { UseResourceFetchOptions, UseResourceFetchReturn } from "./types";

// Hook for fetching resources with automatic loading error handling and retry logic
export function useResourceFetch<T>(
  fetchFn: () => Promise<T>,
  dependencies: DependencyList = [],
  options: UseResourceFetchOptions<T> = {}
): UseResourceFetchReturn<T> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
    enabled = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch function with retry logic
  const fetchWithRetry = useCallback(
    async (attemptNumber = 1): Promise<void> => {
      try {
        const result = await fetchFn();
        setData(result);
        setError(null);

        if (onSuccess) {
          onSuccess(result);
        }
      } catch (err) {
        const errorMsg = getErrorMessage(err) || "Failed to fetch data";

        // Retry logic
        if (attemptNumber < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return fetchWithRetry(attemptNumber + 1);
        }

        // Max retries reached
        setError(errorMsg);
        if (onError) {
          onError(errorMsg);
        }
      }
    },
    [fetchFn, maxRetries, retryDelay, onSuccess, onError]
  );

  // Refetch function to manually trigger data fetching
  const refetch = useCallback(
    async (silent = false) => {
      if (!silent) {
        setIsLoading(true);
      }
      setError(null);
      await fetchWithRetry();
      if (!silent) {
        setIsLoading(false);
      }
    },
    [fetchWithRetry]
  );

  // Reset function to clear data error and loading state
  const reset = () => {
    setData(null);
    setError(null);
    setIsLoading(false);
  };

  // Auto fetch on dependencies change if enabled
  useEffect(() => {
    if (enabled) {
      refetch();
    }
  }, dependencies);

  return { data, isLoading, error, refetch, reset };
}
