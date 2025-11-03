import { useState } from "react";
import type { Product } from "../types";

// Hook to manage form mode (create/edit) for products
export const useFormMode = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Starts creating a new product
  const startCreating = () => {
    setIsCreating(true);
    setIsEditing(false);
    setEditingProduct(null);
  };

  // Starts editing an existing product
  const startEditing = (product: Product) => {
    setEditingProduct(product);
    setIsEditing(true);
    setIsCreating(false);
  };

  // Closes the form and resets state
  const closeForm = () => {
    setIsCreating(false);
    setIsEditing(false);
    setEditingProduct(null);
  };

  // Resets the form mode state
  const resetForm = () => {
    setIsCreating(false);
    setIsEditing(false);
    setEditingProduct(null);
  };

  return {
    isCreating,
    isEditing,
    editingProduct,
    startCreating,
    startEditing,
    closeForm,
    resetForm,
  };
};
