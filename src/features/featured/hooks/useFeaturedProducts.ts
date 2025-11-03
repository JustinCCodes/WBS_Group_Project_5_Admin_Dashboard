import { useState } from "react";
import { getProducts } from "../../products/data";
import { useResourceFetch } from "@/src/shared/hooks/useResourceFetch";

// Hook for fetching and managing featured products
export function useFeaturedProducts() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: productsResponse,
    isLoading,
    error,
    refetch,
  } = useResourceFetch(
    () => getProducts({ page: currentPage, limit: 20 }),
    [currentPage],
    { maxRetries: 3 }
  );

  // Extracts products and pagination info
  const products = productsResponse?.data || [];
  const totalPages = productsResponse?.pagination.totalPages || 1;
  const featuredCount = products.filter((p) => p.featured).length;

  return {
    products,
    currentPage,
    setCurrentPage,
    totalPages,
    featuredCount,
    isLoading,
    error,
    refetch,
  };
}
