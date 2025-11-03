import { useState, useMemo } from "react";
import { textIncludes, sortByDate } from "@/src/shared/lib/utils";
import type { Order } from "../types";

// Hook to manage order filtering logic
export const useOrderFilters = (orders: Order[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Memoized computation of filtered orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order: Order) => {
        // Search filter
        const customerName =
          typeof order.userId === "object" ? order.userId.name : "";
        const customerEmail =
          typeof order.userId === "object" ? order.userId.email : "";

        const matchesSearch =
          !searchTerm ||
          textIncludes(order.id, searchTerm) ||
          textIncludes(customerName, searchTerm) ||
          textIncludes(customerEmail, searchTerm);

        // Status filter
        const matchesStatus = !filterStatus || order.status === filterStatus;

        // Date range filter
        const orderDate = new Date(order.createdAt);
        const matchesDateFrom = !dateFrom || orderDate >= new Date(dateFrom);
        const matchesDateTo = !dateTo || orderDate <= new Date(dateTo);

        return (
          matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo
        );
      })
      .sort((a: Order, b: Order) => sortByDate(a, b, "createdAt", sortOrder));
  }, [orders, searchTerm, filterStatus, dateFrom, dateTo, sortOrder]);

  return {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    sortOrder,
    setSortOrder,
    filteredOrders,
  };
};
