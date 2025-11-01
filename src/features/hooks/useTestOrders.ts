import { useResourceFetch } from "./useResourceFetch";
import { getAllTestOrders } from "@/src/features/data";
import type { Order } from "@/src/features/types";

// Hook for fetching test orders with auto retry

export function useTestOrders() {
  const {
    data: testOrdersData,
    isLoading,
    error,
    refetch,
  } = useResourceFetch(() => getAllTestOrders(), [], { maxRetries: 3 });

  return {
    testOrders: (testOrdersData?.data || []) as Order[],
    isLoading,
    error,
    refetch,
  };
}
