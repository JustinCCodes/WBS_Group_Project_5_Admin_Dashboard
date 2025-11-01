import { useResourceFetch } from "./useResourceFetch";
import { getAllOrders } from "@/src/features/data";
import type { Order } from "@/src/features/types";

// Hook for fetching orders with auto retry
export function useOrders() {
  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useResourceFetch(() => getAllOrders(1, 1000), [], { maxRetries: 3 });

  return {
    orders: (ordersData?.data || []) as Order[],
    isLoading,
    error,
    refetch,
  };
}
