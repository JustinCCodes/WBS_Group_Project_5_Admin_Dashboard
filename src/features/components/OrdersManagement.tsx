"use client";

import { useState, useMemo } from "react";
import { updateOrderStatus, deleteOrder } from "@/src/features/data";
import type { Order } from "@/src/features/types";
import { useOrders, useApiMutation } from "@/src/features/hooks";
import {
  confirmAndDelete,
  mutateAndRefetch,
  textIncludes,
  sortByDate,
} from "@/src/shared/lib/utils";
import { CustomSelect } from "@/src/shared/ui/CustomSelect";
import Button from "@/src/shared/ui/Button";
import SearchBar from "@/src/shared/ui/SearchBar";
import Table from "@/src/shared/ui/Table";
import StatusBadge from "@/src/shared/ui/StatusBadge";
import ErrorAlert from "@/src/shared/ui/ErrorAlert";
import LoadingState from "@/src/shared/ui/LoadingState";
import BackButton from "@/src/shared/ui/BackButton";

export default function OrdersManagement() {
  const {
    orders,
    isLoading: loading,
    error,
    refetch: fetchOrders,
  } = useOrders();

  // API mutations
  const { mutate: mutateUpdateStatus } = useApiMutation(
    (orderId: string, status: string) => updateOrderStatus(orderId, status),
    { successMessage: "Order status updated successfully" }
  );

  // Delete order mutation
  const { mutate: mutateDelete } = useApiMutation(deleteOrder, {
    successMessage: "Order deleted successfully",
  });

  // Order details modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Handler to update order status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    await mutateAndRefetch(
      () => mutateUpdateStatus(orderId, newStatus),
      fetchOrders
    );
  };

  // Handler to delete order
  const handleDeleteOrder = async (id: string) => {
    await confirmAndDelete(
      "Are you sure you want to delete this order? This action cannot be undone.",
      () => mutateDelete(id),
      fetchOrders
    );
  };

  // Shows order details in modal
  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Filters and sorts orders
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

  // Calculates revenue for filtered orders
  const filteredRevenue = useMemo(() => {
    return filteredOrders.reduce(
      (sum: number, order: Order) => sum + order.total,
      0
    );
  }, [filteredOrders]);

  // Loading state
  if (loading && orders.length === 0) {
    return <LoadingState message="Loading orders..." />;
  }

  return (
    <div className="min-h-screen  text-white">
      <div className="container mx-auto p-6">
        <div className="flex flex-col mb-6">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-linear-to-r from-amber-600 to-yellow-600 dark:from-amber-200 dark:to-yellow-600 bg-clip-text text-transparent">
                Manage Orders
              </span>
            </h1>
            <div className="text-lg text-gray-700 dark:text-gray-400">
              Filtered Revenue:{" "}
              <span className="font-bold text-amber-400">
                ${filteredRevenue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        {/* Search & Filter Controls */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by Order ID, customer name, or email..."
              className="w-full"
            />
          </div>
          <CustomSelect
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            options={[
              { value: "", label: "All Statuses" },
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "shipped", label: "Shipped" },
              { value: "cancelled", label: "Cancelled" },
            ]}
            className="min-w-[150px]"
          />
          <CustomSelect
            value={sortOrder}
            onChange={(value) => setSortOrder(value as "asc" | "desc")}
            options={[
              { value: "desc", label: "Newest First" },
              { value: "asc", label: "Oldest First" },
            ]}
          />
          <div>
            <input
              type="date"
              className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="From date"
            />
          </div>
          <div>
            <input
              type="date"
              className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="To date"
            />
          </div>
          <div>
            <Button
              onClick={() => fetchOrders()}
              disabled={loading}
              variant="primary"
              size="md"
              title="Refresh orders"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <Table
          columns={[
            { key: "orderId", label: "Order ID" },
            { key: "customer", label: "Customer" },
            { key: "total", label: "Total" },
            { key: "status", label: "Status" },
            { key: "date", label: "Date" },
            { key: "actions", label: "Actions" },
          ]}
          data={filteredOrders}
          emptyMessage={
            searchTerm || filterStatus || dateFrom || dateTo
              ? "No orders found matching your filters"
              : "No orders yet"
          }
          renderRow={(order: Order) => (
            <>
              <td className="px-4 py-3 font-mono text-sm text-gray-600 dark:text-gray-400">
                {order.id.slice(-8)}
              </td>
              <td className="px-4 py-3">
                {typeof order.userId === "object" ? (
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {order.userId.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {order.userId.email}
                    </div>
                  </div>
                ) : (
                  "Unknown"
                )}
              </td>
              <td className="px-4 py-3 font-semibold text-amber-400">
                ${order.total.toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <CustomSelect
                  value={order.status}
                  onChange={(value) => handleUpdateStatus(order.id, value)}
                  options={[
                    { value: "pending", label: "Pending" },
                    { value: "processing", label: "Processing" },
                    { value: "shipped", label: "Shipped" },
                    { value: "cancelled", label: "Cancelled" },
                  ]}
                  size="sm"
                  className={`${
                    order.status === "pending"
                      ? "[&>button]:bg-yellow-900/20 [&>button]:border-yellow-800 [&>button]:text-yellow-400 [&>button:hover]:border-yellow-600"
                      : order.status === "processing"
                      ? "[&>button]:bg-blue-900/20 [&>button]:border-blue-800 [&>button]:text-blue-400 [&>button:hover]:border-blue-600"
                      : order.status === "shipped"
                      ? "[&>button]:bg-green-900/20 [&>button]:border-green-800 [&>button]:text-green-400 [&>button:hover]:border-green-600"
                      : "[&>button]:bg-red-900/20 [&>button]:border-red-800 [&>button]:text-red-400 [&>button:hover]:border-red-600"
                  }`}
                />
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    variant="edit"
                    size="md"
                    onClick={() => showOrderDetails(order)}
                  >
                    Details
                  </Button>
                  <Button
                    variant="danger"
                    size="md"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </>
          )}
        />

        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>

        {/* Order Details Modal */}
        {showDetailsModal && selectedOrder && (
          <div className="fixed inset-0 /80 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 max-w-3xl mx-4 w-full max-h-[90vh] overflow-y-auto">
              <h3 className="font-bold text-xl mb-6 text-amber-400">
                Order Details
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Order ID</p>
                  <p className="font-mono text-gray-900 dark:text-white">
                    {selectedOrder.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  <StatusBadge
                    status={selectedOrder.status}
                    className="inline-block"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Customer</p>
                  {typeof selectedOrder.userId === "object" ? (
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedOrder.userId.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedOrder.userId.email}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-900 dark:text-white">Unknown</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Order Date</p>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-zinc-800 my-6">
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-4">
                  Products
                </h4>
              </div>

              <Table
                columns={[
                  { key: "product", label: "Product" },
                  { key: "price", label: "Price" },
                  { key: "quantity", label: "Quantity" },
                  { key: "subtotal", label: "Subtotal" },
                ]}
                data={selectedOrder.products}
                emptyMessage="No products in this order"
                className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                renderRow={(item) => (
                  <>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {typeof item.productId === "object" && item.productId.name
                        ? item.productId.name
                        : "Unknown Product"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      $
                      {typeof item.productId === "object" &&
                      item.productId.price
                        ? item.productId.price.toFixed(2)
                        : "0.00"}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 font-semibold text-amber-400">
                      $
                      {typeof item.productId === "object" &&
                      item.productId.price
                        ? (item.productId.price * item.quantity).toFixed(2)
                        : "0.00"}
                    </td>
                  </>
                )}
              />

              <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-b-lg border-t-2 border-t-amber-500/30 px-4 py-3 flex justify-between items-center -mt-px">
                <span className="text-gray-900 dark:text-white font-semibold">
                  Total
                </span>
                <span className="text-lg text-amber-400 font-semibold">
                  ${selectedOrder.total.toFixed(2)}
                </span>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
