"use client";

import { useState } from "react";
import { featureProduct, unfeatureProduct } from "../../products/data";
import { useApiMutation } from "@/src/shared/hooks";
import { useFeaturedProducts } from "../hooks/useFeaturedProducts";
import { FeaturedHeader } from "./FeaturedHeader";
import { FeaturedProductsGrid } from "./FeaturedProductsGrid";
import { FeaturedPagination } from "./FeaturedPagination";
import { Product } from "../../products/types";

// Main component for managing featured products
export default function FeaturedProductsManagementContainer() {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const {
    products,
    currentPage,
    setCurrentPage,
    totalPages,
    featuredCount,
    isLoading,
    error,
    refetch,
  } = useFeaturedProducts();

  // API mutations
  const { mutate: mutateFeature } = useApiMutation(featureProduct, {
    successMessage: "Product featured successfully",
    onSuccess: () => refetch(true),
  });

  const { mutate: mutateUnfeature } = useApiMutation(unfeatureProduct, {
    successMessage: "Product unfeatured successfully",
    onSuccess: () => refetch(true),
  });

  // Handles featured toggle
  const handleToggleFeatured = async (product: Product) => {
    const productId = product.id;
    setUpdatingId(productId);

    try {
      if (product.featured) {
        await mutateUnfeature(productId);
      } else {
        await mutateFeature(productId);
      }
    } catch (error) {
      console.error("Error toggling featured status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        <FeaturedHeader featuredCount={featuredCount} />

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Products Grid */}
        <FeaturedProductsGrid
          products={products}
          loading={isLoading}
          updatingId={updatingId}
          onToggleFeatured={handleToggleFeatured}
        />

        {/* Pagination */}
        <FeaturedPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
