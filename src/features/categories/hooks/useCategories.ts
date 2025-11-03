import { useResourceFetch } from "@/src/shared/hooks/useResourceFetch";
import { getAllCategories } from "../data";
import type { Category } from "../types";

// Hook for fetching categories with auto retry
export function useCategories() {
  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useResourceFetch<Category[]>(getAllCategories, [], { maxRetries: 3 });

  return {
    categories: categories || [],
    isLoading,
    error,
    refetch,
  };
}
