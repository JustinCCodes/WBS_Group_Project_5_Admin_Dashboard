import { useResourceFetch } from "@/src/shared/hooks/useResourceFetch";
import { getAllProducts } from "../data";
import type { Product } from "../types";

// Hook for fetching products with auto retry
export function useProducts() {
  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useResourceFetch(() => getAllProducts(), [], { maxRetries: 3 });

  return {
    products: (productsData?.data || []) as Product[],
    isLoading,
    error,
    refetch,
  };
}
