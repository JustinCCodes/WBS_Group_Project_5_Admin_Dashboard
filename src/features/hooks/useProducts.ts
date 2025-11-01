import { useResourceFetch } from "./useResourceFetch";
import { getAllProducts } from "@/src/features/data";
import type { Product } from "@/src/features/types";

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
