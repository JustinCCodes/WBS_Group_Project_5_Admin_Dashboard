// Export components, hooks, and utilities for the categories feature
export { default as CategoriesManagementContainer } from "./components/CategoriesManagement";

// Export child components
export { CategoryFilters } from "./components/CategoryFilters";
export { CategoryForm } from "./components/CategoryForm";
export { CategoriesTable } from "./components/CategoriesTable";

// Export types
export type * from "./types";

// Export data functions
export {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./data";
