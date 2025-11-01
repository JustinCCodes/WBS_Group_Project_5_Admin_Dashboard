"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import {
  getProducts,
  featureProduct,
  unfeatureProduct,
} from "@/src/features/data";
import type { Product } from "@/src/features/types";
import { useResourceFetch, useApiMutation } from "@/src/features/hooks";
import { mutateAndRefetch } from "@/src/shared/lib/utils";
import Button from "@/src/shared/ui/Button";
import BackButton from "@/src/shared/ui/BackButton";

export default function FeaturedProductsManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch products with auto-retry
  const {
    data: productsResponse,
    isLoading: loading,
    error,
    refetch: fetchProducts,
  } = useResourceFetch(
    () => getProducts({ page: currentPage, limit: 20 }),
    [currentPage],
    { maxRetries: 3 }
  );

  // Extracts products and pagination info
  const products = productsResponse?.data || [];
  const totalPages = productsResponse?.pagination.totalPages || 1;

  // API mutations
  const { mutate: mutateFeature } = useApiMutation(featureProduct, {
    successMessage: "Product featured successfully",
  });

  // Toggles featured status
  const { mutate: mutateUnfeature } = useApiMutation(unfeatureProduct, {
    successMessage: "Product unfeatured successfully",
  });

  // Handles featured toggle
  const handleToggleFeatured = async (product: Product) => {
    const productId = product.id;
    setUpdatingId(productId);

    // Toggles featured status
    await mutateAndRefetch(
      () =>
        product.featured
          ? mutateUnfeature(productId)
          : mutateFeature(productId),
      fetchProducts
    );

    setUpdatingId(null);
  };

  // Counts featured products
  const featuredCount = products.filter((p) => p.featured).length;

  return (
    <div className="min-h-screen  text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col">
          <BackButton />
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-linear-to-r from-amber-600 to-yellow-600 dark:from-amber-200 dark:to-yellow-600 bg-clip-text text-transparent">
                Featured Products
              </span>
            </h1>
            <p className="text-gray-700 dark:text-gray-400">
              Manage which products appear in the homepage featured section
            </p>
            <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-gray-700 dark:text-gray-300">
                <span className="font-bold text-amber-400">
                  {featuredCount}
                </span>{" "}
                featured products
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 animate-pulse"
              >
                <div className="h-6 bg-zinc-800 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-zinc-800 rounded mb-4 w-full"></div>
                <div className="h-10 bg-zinc-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const categoryName =
                  typeof product.categoryId === "object" &&
                  product.categoryId !== null
                    ? product.categoryId.name
                    : "Unknown";
                const productId = product.id;

                return (
                  <div
                    key={productId}
                    className={`bg-white dark:bg-zinc-900 border rounded-xl p-6 transition-all ${
                      product.featured
                        ? "border-amber-500/50 bg-amber-500/5"
                        : "border-gray-200 dark:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {categoryName}
                        </p>
                      </div>
                      {product.featured && (
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400 ml-2 shrink-0" />
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-amber-400">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleToggleFeatured(product)}
                        disabled={updatingId === productId}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                          product.featured
                            ? "bg-amber-100 dark:bg-amber-500/20 border border-amber-400 dark:border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/30"
                            : "bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-amber-500/50 hover:text-amber-400"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {updatingId === productId
                          ? "Updating..."
                          : product.featured
                          ? "Remove Featured"
                          : "Make Featured"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-4">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="secondary"
                  size="md"
                >
                  Previous
                </Button>
                <span className="text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  variant="secondary"
                  size="md"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
