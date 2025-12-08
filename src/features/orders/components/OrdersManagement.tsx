"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { updateOrderStatus, deleteOrder } from "../data";
import type { Order } from "../types";
import { useApiMutation, useDeleteConfirmation } from "@/src/shared/hooks";
import { useOrders, useOrderFilters } from "@/src/features/orders/hooks";
import {
  OrderFilters,
  OrdersTable,
  OrderDetailsModal,
} from "@/src/features/orders";
import ErrorAlert from "@/src/shared/ui/ErrorAlert";
import LoadingState from "@/src/shared/ui/LoadingState";
import BackButton from "@/src/shared/ui/BackButton";
import ConfirmDialog from "@/src/shared/ui/ConfirmDialog";

// Main container component for managing orders
export default function OrdersManagementContainer() {
  // Guard: Only render after client-side hydration
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  const {
    orders,
    isLoading: loading,
    error,
    refetch: fetchOrders,
  } = useOrders();

  // Gets search param from URL using Next.js hook (client only)
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  // Filtering
  const {
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
  } = useOrderFilters(orders, initialSearch);

  // Modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const {
    dialogProps,
    openDeleteConfirm,
    handleCancelDelete,
    handleConfirmDelete,
  } = useDeleteConfirmation("Order");

  // Defines Handler for showing details
  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // API mutations
  const { mutate: mutateUpdateStatus } = useApiMutation(
    (orderId: string, status: string) => updateOrderStatus(orderId, status),
    {
      successMessage: "Order status updated successfully",
      onSuccess: () => fetchOrders(true),
    }
  );

  // Defines Handler for updating status
  const handleUpdateStatus = (orderId: string, status: string) => {
    mutateUpdateStatus(orderId, status);
  };

  // Delete mutation
  const { mutate: mutateDelete } = useApiMutation(deleteOrder, {
    successMessage: "Order deleted successfully",
    onSuccess: () => fetchOrders(true),
  });

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col mb-6">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold">
              <span className="bg-linear-to-r from-amber-600 to-yellow-600 dark:from-amber-200 dark:to-yellow-600 bg-clip-text text-transparent">
                Manage Orders
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Total Orders:{" "}
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {orders.length}
              </span>
            </p>
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        {/* Filters */}
        <OrderFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          dateFrom={dateFrom}
          onDateFromChange={setDateFrom}
          dateTo={dateTo}
          onDateToChange={setDateTo}
          onRefresh={() => fetchOrders()}
          isLoading={loading}
        />

        {/* Table */}
        <OrdersTable
          orders={filteredOrders}
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onStatusChange={handleUpdateStatus}
          onViewDetails={showOrderDetails}
          onDeleteOrder={openDeleteConfirm}
          onHardDeleteOrder={() => fetchOrders(true)}
        />

        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Modals & Dialogs */}
      <OrderDetailsModal
        isOpen={showDetailsModal}
        order={selectedOrder}
        onClose={() => setShowDetailsModal(false)}
      />

      <ConfirmDialog
        {...dialogProps}
        onConfirm={() => handleConfirmDelete(mutateDelete)}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
