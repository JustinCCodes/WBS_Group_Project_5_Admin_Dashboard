// Core category types
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdBy?: string | { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

// Component props interfaces
export interface CategoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: "name" | "date";
  onSortByChange: (value: "name" | "date") => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
}

// Admin form state interface
export interface AdminFormState<T> {
  formData: T;
  setFormData: (data: T) => void;
  loading: boolean;
  error: string | null;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
}

// Category form component props
export interface CategoryFormProps {
  formState: AdminFormState<{ name: string }>;
  isCreating: boolean;
  onCancel: () => void;
}

// Category management component props
export interface CategoriesTableProps {
  categories: Category[];
  searchTerm: string;
  totalCount: number;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string, categoryName: string) => void;
  isFormActive: boolean;
}
