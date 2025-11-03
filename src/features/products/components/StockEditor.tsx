"use client";

import { useState } from "react";
import { updateProductStock } from "../data";
import { getErrorMessage } from "@/src/shared/lib/utils";
import toast from "react-hot-toast";
import { AlertTriangle, Check, X } from "lucide-react";
import type { StockEditorProps } from "../types";

// Component to edit and display product stock
export const StockEditor = ({
  productId,
  currentStock,
  onStockUpdated,
}: StockEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [stock, setStock] = useState(currentStock);
  const [loading, setLoading] = useState(false);

  // Handles saving updated stock
  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProductStock(productId, stock);
      setIsEditing(false);
      onStockUpdated();
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  // Handles cancelling edit
  const handleCancel = () => {
    setStock(currentStock);
    setIsEditing(false);
  };

  // Renders stock editor UI
  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value) || 0)}
          className="w-20 px-2 py-1 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={loading}
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="p-1 bg-green-900/20 border border-green-800 text-green-400 rounded hover:bg-green-900/40 transition-all disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          disabled={loading}
          className="p-1 bg-red-900/20 border border-red-800 text-red-400 rounded hover:bg-red-900/40 transition-all disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Renders stock display button
  return (
    <button
      onClick={() => setIsEditing(true)}
      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all hover:scale-105 ${
        currentStock === 0
          ? "bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400"
          : currentStock <= 5
          ? "bg-orange-100 dark:bg-orange-900/20 border border-orange-400 dark:border-orange-800 text-orange-700 dark:text-orange-400"
          : currentStock <= 10
          ? "bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400"
          : "bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400"
      }`}
    >
      {currentStock === 0 ? (
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          OUT
        </span>
      ) : (
        `${currentStock} in stock`
      )}
    </button>
  );
};
