// Export the main container component
export { default as ProductsManagementContainer } from "./components/ProductsManagement";

// Export child components
export { StockEditor } from "./components/StockEditor";
export { ImageUploadSection } from "./components/ImageUploadSection";
export { ProductFormButtons } from "./components/ProductFormButtons";
export { UnsavedProductsPanel } from "./components/UnsavedProductsPanel";
export { ProductFilters } from "./components/ProductFilters";
export { ProductsTable } from "./components/ProductsTable";
export { ProductForm } from "./components/ProductForm";

// Export types
export type * from "./types";

// Export data functions
export {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  getLowStockProducts,
  getProducts,
  featureProduct,
  unfeatureProduct,
} from "./data";
