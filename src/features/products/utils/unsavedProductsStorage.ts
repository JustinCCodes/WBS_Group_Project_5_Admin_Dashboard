import type { ProductInput, UnsavedProduct } from "../types";

export const UNSAVED_PRODUCTS_KEY = "unsaved-products";
export const MAX_UNSAVED_PRODUCTS = 10;

// Load all unsaved products from localStorage
export const loadUnsavedProducts = (): UnsavedProduct[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(UNSAVED_PRODUCTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Save all unsaved products to localStorage
export const saveUnsavedProducts = (products: UnsavedProduct[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(UNSAVED_PRODUCTS_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Failed to save products:", error);
  }
};

// Get product name from form data or default
export const getProductName = (formData: ProductInput): string => {
  return formData.name?.trim() || "Untitled";
};

// Create a new unsaved product
export const createNewUnsavedProduct = (formData?: ProductInput): string => {
  const products = loadUnsavedProducts();
  const now = Date.now();
  const newProduct: UnsavedProduct = {
    id: `product-${now}`,
    name: formData ? getProductName(formData) : "Untitled",
    formData: formData || {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: "",
      imageUrl: "",
      imagePublicId: "",
    },
    createdAt: now,
    updatedAt: now,
  };

  // Remove oldest product if limit exceeded
  if (products.length >= MAX_UNSAVED_PRODUCTS) {
    products.sort((a, b) => a.createdAt - b.createdAt);
    products.shift();
  }

  products.push(newProduct);
  saveUnsavedProducts(products);
  return newProduct.id;
};

// Update existing unsaved product
export const updateUnsavedProduct = (
  productId: string,
  formData: ProductInput
): void => {
  if (typeof window === "undefined") return;
  const products = loadUnsavedProducts();
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex !== -1) {
    products[productIndex] = {
      ...products[productIndex],
      name: getProductName(formData),
      formData,
      updatedAt: Date.now(),
    };
    saveUnsavedProducts(products);
  }
};

// Delete unsaved product
export const deleteUnsavedProduct = (productId: string): void => {
  const products = loadUnsavedProducts().filter((p) => p.id !== productId);
  saveUnsavedProducts(products);
};

// Load a single unsaved product by ID
export const loadUnsavedProduct = (
  productId: string
): UnsavedProduct | null => {
  const products = loadUnsavedProducts();
  return products.find((p) => p.id === productId) || null;
};
