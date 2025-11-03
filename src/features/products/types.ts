// Core Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string | { id: string; name: string };
  imageUrl?: string;
  imagePublicId?: string;
  featured?: boolean;
  createdBy?: string | { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

// Category Type
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdBy?: string | { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

// Input type for creating/updating products
export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl: string;
  imagePublicId: string;
}

// Parameters for fetching products
export interface GetProductsParams {
  featured?: boolean;
  categoryId?: string;
  limit?: number;
  page?: number;
}

// Response type for fetching products
export interface ProductsResponse {
  data: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

// Unsaved product draft interface
export interface UnsavedProduct {
  id: string;
  name: string;
  formData: ProductInput;
  createdAt: number;
  updatedAt: number;
}

// Component props interfaces
export interface ProductFormProps {
  formData: ProductInput;
  onFormDataChange: (data: ProductInput) => void;
  categories: Category[];
  imagePreview: string;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  isLoading: boolean;
  isUploadingImage: boolean;
  error?: string;
}

// Component props interfaces
export interface ProductsTableProps {
  products: Product[];
  searchTerm: string;
  filterCategory: string;
  isCreating: boolean;
  isEditing: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string, productName: string) => void;
  onStockUpdated: () => void;
}

// Component props interfaces
export interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterCategory: string;
  onCategoryChange: (value: string) => void;
  sortBy: "name" | "price" | "date";
  onSortByChange: (value: "name" | "price" | "date") => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
  categories: Category[];
}

// Component props interfaces
export interface UnsavedProductsPanelProps {
  unsavedProducts: UnsavedProduct[];
  activeProductId: string | null;
  onSelectProduct: (product: UnsavedProduct) => void;
  onDeleteProduct: (productId: string, productName: string) => void;
  onCreateNew: () => void;
  maxProducts?: number;
}

// Component props interfaces
export interface ImageUploadSectionProps {
  imagePreview: string;
  selectedImage: File | null;
  currentImageUrl?: string;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => {
    error: string | null;
  };
  onRemoveImage: () => void;
}

// Component props interfaces
export interface StockEditorProps {
  productId: string;
  currentStock: number;
  onStockUpdated: () => void;
}

// Component props interfaces
export interface ProductFormButtonsProps {
  isEditMode: boolean;
  isCreatingProduct: boolean;
  onCancel: () => void;
  onClose: () => void;
}

// Hook interfaces
export interface UseProductFormSubmissionOptions {
  onCreateSuccess?: (productId: string) => void;
  onUpdateSuccess?: (productId: string) => void;
}

// Hook return types
export interface UseProductFormSubmissionReturn {
  selectedImage: File | null;
  imagePreview: string;
  isUploadingImage: boolean;
  setImagePreview: (preview: string) => void;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (
    formData: ProductInput,
    setFormData: (data: ProductInput) => void
  ) => void;
  prepareFormDataWithImage: (data: ProductInput) => Promise<ProductInput>;
  resetImageState: () => void;
}

// Unsaved product draft interface
export interface UnsavedProduct {
  id: string;
  name: string;
  formData: ProductInput;
  createdAt: number;
  updatedAt: number;
}
