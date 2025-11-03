import { useState, useMemo } from "react";
import type { ProductInput } from "../types";
import {
  loadUnsavedProducts,
  createNewUnsavedProduct,
  updateUnsavedProduct as updateUnsavedProductInStorage,
  deleteUnsavedProduct as deleteUnsavedProductFromStorage,
} from "../utils/unsavedProductsStorage";
import type { UnsavedProduct } from "../types";

// Hook to manage unsaved products in local storage
export const useUnsavedProducts = () => {
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [unsavedProductsVersion, setUnsavedProductsVersion] = useState(0);

  // Get current unsaved products (refreshed when version changes)
  const unsavedProducts = useMemo(
    () => loadUnsavedProducts(),
    [unsavedProductsVersion]
  );

  // Triggers re render for unsaved products
  const refreshUnsavedProducts = () => {
    setUnsavedProductsVersion((v) => v + 1);
  };

  // Creates new product
  const createProduct = (formData?: ProductInput): string => {
    const newProductId = createNewUnsavedProduct(formData);
    setActiveProductId(newProductId);
    refreshUnsavedProducts();
    return newProductId;
  };

  // Updates product
  const updateProduct = (productId: string, formData: ProductInput): void => {
    updateUnsavedProductInStorage(productId, formData);
    refreshUnsavedProducts();
  };

  // Deletes product
  const deleteProduct = (productId: string): void => {
    deleteUnsavedProductFromStorage(productId);
    if (activeProductId === productId) {
      setActiveProductId(null);
    }
    refreshUnsavedProducts();
  };

  // Switches active product
  const setActive = (productId: string): void => {
    setActiveProductId(productId);
  };

  return {
    unsavedProducts,
    activeProductId,
    setActiveProductId,
    createProduct,
    updateProduct,
    deleteProduct,
    setActive,
    refreshUnsavedProducts,
  };
};
