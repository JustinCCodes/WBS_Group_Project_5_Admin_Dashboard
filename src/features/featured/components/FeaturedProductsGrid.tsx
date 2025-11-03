import { FeaturedProductCard } from "./FeaturedProductCard";
import type { FeaturedProductsGridProps } from "../types";

// Component for displaying a grid of featured products
export function FeaturedProductsGrid({
  products,
  loading,
  updatingId,
  onToggleFeatured,
}: FeaturedProductsGridProps) {
  if (loading) {
    return (
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
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <FeaturedProductCard
          key={product.id}
          product={product}
          onToggleFeatured={onToggleFeatured}
          isUpdating={updatingId === product.id}
        />
      ))}
    </div>
  );
}
