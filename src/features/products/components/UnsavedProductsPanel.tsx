import Button from "@/src/shared/ui/Button";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import type { UnsavedProduct, UnsavedProductsPanelProps } from "../types";

// Component to display and manage unsaved products panel
export const UnsavedProductsPanel = ({
  unsavedProducts,
  activeProductId,
  onSelectProduct,
  onDeleteProduct,
  onCreateNew,
  maxProducts = 10,
}: UnsavedProductsPanelProps) => {
  return (
    <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Your Products
        </label>
        <span className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full font-medium">
          {unsavedProducts.length} / {maxProducts} products
        </span>
      </div>

      <div className="space-y-3">
        {/* Product list with delete buttons */}
        <div className="space-y-2">
          {unsavedProducts.map((product, index) => (
            <div
              key={product.id}
              className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                product.id === activeProductId
                  ? "bg-amber-500/20 border-amber-500/50 shadow-sm"
                  : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:border-amber-500/30"
              }`}
            >
              {/* Product number */}
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 text-xs font-bold shrink-0">
                {index + 1}
              </span>

              <button
                type="button"
                onClick={() => {
                  onSelectProduct(product);
                  toast.success(`Now editing: ${product.name}`);
                }}
                className="flex-1 text-left min-w-0"
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(product.updatedAt).toLocaleString()}
                    </div>
                  </div>
                  {product.id === activeProductId && (
                    <span className="text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-full font-medium shrink-0">
                      Active
                    </span>
                  )}
                </div>
              </button>
              <button
                type="button"
                onClick={() => onDeleteProduct(product.id, product.name)}
                disabled={product.id === activeProductId}
                className={`p-2 rounded transition-all shrink-0 ${
                  product.id === activeProductId
                    ? "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
                    : "text-red-400 hover:text-red-300 hover:bg-red-900/20"
                }`}
                title={
                  product.id === activeProductId
                    ? "Cannot delete active product"
                    : "Delete product"
                }
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* New Product button */}
        <button
          type="button"
          onClick={onCreateNew}
          className="w-full p-3 bg-white dark:bg-zinc-800 border-2 border-dashed border-amber-500/40 hover:border-amber-500 rounded-lg text-amber-600 dark:text-amber-400 font-medium hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create New Product
        </button>
      </div>
    </div>
  );
};
