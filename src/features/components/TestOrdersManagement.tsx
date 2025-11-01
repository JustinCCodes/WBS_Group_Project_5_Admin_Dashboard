"use client";

import { useState } from "react";
import { createTestOrder, deleteTestOrder } from "@/src/features/data";
import type {
  User,
  TestOrder,
  ProductSummary,
  ProductLineItem,
} from "@/src/features/types";
import {
  useTestOrderForm,
  useTestOrders,
  useUsers,
  useProducts,
  useApiMutation,
} from "@/src/features/hooks";
import { confirmAndDelete } from "@/src/shared/lib/utils";
import { CustomSelect } from "@/src/shared/ui/CustomSelect";
import Button from "@/src/shared/ui/Button";
import Table from "@/src/shared/ui/Table";
import StatusBadge from "@/src/shared/ui/StatusBadge";
import ErrorAlert from "@/src/shared/ui/ErrorAlert";
import LoadingState from "@/src/shared/ui/LoadingState";
import BackButton from "@/src/shared/ui/BackButton";

export default function TestOrdersManagement() {
  const {
    testOrders,
    isLoading: loading,
    error,
    refetch: fetchTestOrders,
  } = useTestOrders();
  const { users } = useUsers();
  const { products } = useProducts();

  // API mutations
  const { mutate: mutateDelete } = useApiMutation(deleteTestOrder, {
    successMessage: "Test order deleted successfully",
  });

  // State for creating test order
  const [isCreating, setIsCreating] = useState(false);

  // Form for creating test orders
  const testOrderForm = useTestOrderForm(async (data) => {
    await createTestOrder({
      userId: data.userId,
      status: data.status,
      products: data.products.filter(
        (p: ProductLineItem) => p.productId && p.quantity > 0
      ),
    });
    setIsCreating(false);
    await fetchTestOrders();
  });

  // Handles test order deletion
  const handleDeleteTestOrder = async (id: string) => {
    await confirmAndDelete(
      "Are you sure you want to delete this test order?",
      () => mutateDelete(id),
      fetchTestOrders
    );
  };

  // Resets create form
  const resetForm = () => {
    setIsCreating(false);
    testOrderForm.reset();
  };

  // Renders loading state
  if (loading && testOrders.length === 0) {
    return <LoadingState message="Loading test orders..." />;
  }

  return (
    <div className="min-h-screen  text-white">
      <div className="container mx-auto p-6">
        <div className="flex flex-col mb-6">
          <BackButton />
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                <span className="bg-linear-to-r from-amber-600 to-yellow-600 dark:from-amber-200 dark:to-yellow-600 bg-clip-text text-transparent">
                  Test Orders
                </span>
              </h1>
              <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
                Create and manage test orders separately from production orders
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => fetchTestOrders()}
                disabled={loading}
                variant="primary"
                size="lg"
                title="Refresh test orders"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsCreating(true)}
                disabled={isCreating}
              >
                + Create Test Order
              </Button>
            </div>
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        {/* Create Test Order Form */}
        {isCreating && (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 shadow-xl mb-6">
            <h2 className="text-xl font-bold mb-6 text-amber-400">
              Create Test Order
            </h2>
            <form onSubmit={testOrderForm.handleSubmit}>
              {testOrderForm.error && (
                <ErrorAlert message={testOrderForm.error} />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    User *
                  </label>
                  <CustomSelect
                    value={testOrderForm.formState.userId}
                    onChange={(value) =>
                      testOrderForm.dispatch({
                        type: "SET_USER_ID",
                        payload: value,
                      })
                    }
                    options={[
                      { value: "", label: "Select a user" },
                      ...users.map((user: User) => ({
                        value: user.id,
                        label: `${user.name} (${user.email})`,
                      })),
                    ]}
                    disabled={testOrderForm.loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status *
                  </label>
                  <CustomSelect
                    value={testOrderForm.formState.status}
                    onChange={(value) =>
                      testOrderForm.dispatch({
                        type: "SET_STATUS",
                        payload: value as
                          | "pending"
                          | "processing"
                          | "shipped"
                          | "cancelled",
                      })
                    }
                    options={[
                      { value: "pending", label: "Pending" },
                      { value: "processing", label: "Processing" },
                      { value: "shipped", label: "Shipped" },
                      { value: "cancelled", label: "Cancelled" },
                    ]}
                    disabled={testOrderForm.loading}
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-zinc-800 my-6 pt-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-4">
                  Products
                </h3>
              </div>

              {testOrderForm.formState.products.map(
                (product: ProductLineItem, index: number) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <div className="flex-1">
                      <CustomSelect
                        value={product.productId}
                        onChange={(value) =>
                          testOrderForm.dispatch({
                            type: "UPDATE_PRODUCT_LINE",
                            payload: {
                              index,
                              field: "productId",
                              value: value,
                            },
                          })
                        }
                        options={[
                          { value: "", label: "Select a product" },
                          ...products.map((prod: ProductSummary) => ({
                            value: prod.id,
                            label: `${prod.name} - $${prod.price}`,
                          })),
                        ]}
                        disabled={testOrderForm.loading}
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        min="1"
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        value={product.quantity}
                        onChange={(e) =>
                          testOrderForm.dispatch({
                            type: "UPDATE_PRODUCT_LINE",
                            payload: {
                              index,
                              field: "quantity",
                              value: parseInt(e.target.value),
                            },
                          })
                        }
                        required
                        disabled={testOrderForm.loading}
                      />
                    </div>
                    {testOrderForm.formState.products.length > 1 && (
                      <button
                        type="button"
                        className="w-10 h-10 bg-red-900/20 border border-red-800 text-red-400 font-bold rounded hover:bg-red-900/40 transition-all"
                        onClick={() =>
                          testOrderForm.dispatch({
                            type: "REMOVE_PRODUCT_LINE",
                            payload: index,
                          })
                        }
                        disabled={testOrderForm.loading}
                      >
                        ×
                      </button>
                    )}
                  </div>
                )
              )}

              <button
                type="button"
                className="mt-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-amber-400 hover:border-amber-500/50 transition-all"
                onClick={() =>
                  testOrderForm.dispatch({ type: "ADD_PRODUCT_LINE" })
                }
                disabled={testOrderForm.loading}
              >
                + Add Product
              </button>

              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={resetForm}
                  disabled={testOrderForm.loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={testOrderForm.loading}
                  loading={testOrderForm.loading}
                >
                  {testOrderForm.loading ? "Creating..." : "Create Test Order"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Test Orders Table */}
        <Table
          columns={[
            { key: "orderId", label: "Order ID" },
            { key: "customer", label: "Customer" },
            { key: "products", label: "Products" },
            { key: "total", label: "Total" },
            { key: "status", label: "Status" },
            { key: "date", label: "Date" },
            { key: "actions", label: "Actions" },
          ]}
          data={testOrders}
          emptyMessage="No test orders yet"
          renderRow={(order: TestOrder) => (
            <>
              <td className="px-4 py-3 font-mono text-sm text-gray-600 dark:text-gray-400">
                {order.id.slice(-8)}
              </td>
              <td className="px-4 py-3">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {order.userId.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {order.userId.email}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                {order.products.length} item(s)
              </td>
              <td className="px-4 py-3 font-semibold text-amber-400">
                ${order.total.toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteTestOrder(order.id)}
                >
                  Delete
                </Button>
              </td>
            </>
          )}
        />

        <div className="mt-4 text-sm text-gray-400">
          Showing {testOrders.length} test orders
        </div>
      </div>
    </div>
  );
}
