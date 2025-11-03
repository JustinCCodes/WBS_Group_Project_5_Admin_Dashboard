import { Star } from "lucide-react";
import Button from "@/src/shared/ui/Button";
import type { FeaturedProductCardProps } from "../types";

// Component for displaying a featured product card
export function FeaturedProductCard({
  product,
  onToggleFeatured,
  isUpdating,
}: FeaturedProductCardProps) {
  const categoryName =
    typeof product.categoryId === "object" && product.categoryId !== null
      ? product.categoryId.name
      : "Unknown";

  return (
    <div
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
        <Button
          onClick={() => onToggleFeatured(product)}
          disabled={isUpdating}
          variant={product.featured ? "success" : "secondary"}
          size="sm"
        >
          {isUpdating
            ? "Updating..."
            : product.featured
            ? "Remove Featured"
            : "Make Featured"}
        </Button>
      </div>
    </div>
  );
}
