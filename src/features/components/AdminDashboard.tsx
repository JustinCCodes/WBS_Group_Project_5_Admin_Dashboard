"use client";

import { getDashboardStats, getLowStockProducts } from "@/src/features/data";
import type { DashboardStats, Product } from "@/src/features/types";
import { useResourceFetch } from "@/src/features/hooks";
import Link from "next/link";
import Table from "@/src/shared/ui/Table";
import {
  AlertTriangle,
  Package,
  Users,
  ShoppingCart,
  Layers,
  Star,
  TestTube,
} from "lucide-react";
import StatusBadge from "@/src/shared/ui/StatusBadge";

export default function AdminDashboard() {
  // Fetches dashboard stats with auto retry
  const {
    data: stats,
    isLoading: loading,
    error,
  } = useResourceFetch<DashboardStats>(getDashboardStats, [], {
    maxRetries: 3,
  });

  // Fetches low stock products
  const { data: lowStockProducts } = useResourceFetch<Product[]>(
    () => getLowStockProducts(10),
    [],
    { maxRetries: 2 }
  );

  // Loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-700 dark:text-red-400 font-medium">
          {error}
        </div>
      </div>
    );
  }

  // If no stats return null
  if (!stats) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">
          <span className="bg-linear-to-r from-amber-600 to-yellow-600 dark:from-amber-200 dark:to-yellow-600 bg-clip-text text-transparent">
            Admin Dashboard
          </span>
        </h1>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 hover:border-amber-500/50 transition-all">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-400 mb-2">
              Total Users
            </h2>
            <p className="text-4xl font-bold text-amber-400">
              {stats.totalUsers}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 hover:border-amber-500/50 transition-all">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-400 mb-2">
              Total Products
            </h2>
            <p className="text-4xl font-bold text-amber-400">
              {stats.totalProducts}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 hover:border-amber-500/50 transition-all">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-400 mb-2">
              Total Categories
            </h2>
            <p className="text-4xl font-bold text-amber-400">
              {stats.totalCategories}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 hover:border-amber-500/50 transition-all">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-400 mb-2">
              Total Orders
            </h2>
            <p className="text-4xl font-bold text-amber-400">
              {stats.totalOrders}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 hover:border-amber-500/50 transition-all col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-400 mb-2">
              Total Revenue
            </h2>
            <p className="text-4xl font-bold text-amber-400">
              ${stats.totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts && lowStockProducts.length > 0 && (
          <div className="mb-8 bg-red-900/10 border-2 border-red-500/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-red-400">
                Low Stock Alert
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The following products have low stock (≤10 items):
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts?.map((product: Product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 hover:border-red-500/50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <Package className="w-8 h-8 text-amber-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-sm font-bold ${
                            product.stock === 0
                              ? "text-red-400"
                              : product.stock <= 5
                              ? "text-orange-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {product.stock === 0
                            ? "OUT OF STOCK"
                            : `${product.stock} left`}
                        </span>
                      </div>
                      <Link
                        href="/products"
                        className="inline-block mt-2 text-xs text-amber-400 hover:text-amber-300"
                      >
                        Update Stock →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link
              href="/users"
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg hover:border-amber-500/50 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all group"
            >
              <Users className="w-8 h-8 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-300 text-center">
                Users
              </span>
            </Link>
            <Link
              href="/orders"
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg hover:border-amber-500/50 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all group"
            >
              <ShoppingCart className="w-8 h-8 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-300 text-center">
                Orders
              </span>
            </Link>
            <Link
              href="/categories"
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg hover:border-amber-500/50 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all group"
            >
              <Layers className="w-8 h-8 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-300 text-center">
                Categories
              </span>
            </Link>
            <Link
              href="/products"
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg hover:border-amber-500/50 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all group"
            >
              <Package className="w-8 h-8 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-300 text-center">
                Products
              </span>
            </Link>
            <Link
              href="/featured"
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg hover:border-amber-500/50 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all group"
            >
              <Star className="w-8 h-8 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-300 text-center">
                Featured
              </span>
            </Link>
            <Link
              href="/test-orders"
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg hover:border-amber-500/50 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all group"
            >
              <TestTube className="w-8 h-8 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-300 text-center">
                Test Orders
              </span>
            </Link>
          </div>
        </div>

        {/* Newest Orders */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Newest Orders</h2>
          <Table
            columns={[
              { key: "orderId", label: "Order ID" },
              { key: "customer", label: "Customer" },
              { key: "total", label: "Total" },
              { key: "status", label: "Status" },
              { key: "date", label: "Date" },
            ]}
            data={stats.newestOrders}
            emptyMessage="No orders found"
            renderRow={(order) => (
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
                <td className="px-4 py-3 font-semibold text-amber-400">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}
