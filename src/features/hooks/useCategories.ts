import { useResourceFetch } from "./useResourceFetch";
import { getAllCategories } from "@/src/features/data";
import type { Category } from "@/src/features/types";

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
