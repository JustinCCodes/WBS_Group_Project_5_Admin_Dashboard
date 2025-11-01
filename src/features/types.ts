// Admin Feature Types
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  newestOrders: Order[];
}

// Order type
export interface Order {
  id: string;
  userId: {
    id: string;
    name: string;
    email: string;
  };
  products: {
    productId: {
      id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  total: number;
  status: "pending" | "processing" | "shipped" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "banned";
  bannedReason?: string;
  bannedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

// Product type
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

// Category type
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdBy?: string | { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

// Test order type (same as Order for test data)
export type TestOrder = Order;

// Product summary for reports
export interface ProductSummary {
  id: string;
  name: string;
  price: number;
}

// Product line item for test orders
export interface ProductLineItem {
  productId: string;
  quantity: number;
}

// Product input for API operations
export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl: string;
  imagePublicId: string;
}

// Product query parameters
export interface GetProductsParams {
  featured?: boolean;
  categoryId?: string;
  limit?: number;
  page?: number;
}

// Product API response
export interface ProductsResponse {
  data: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

// Hook types
export interface UseAdminFormOptions<T> {
  initialData: T;
  onSubmit: (data: T) => Promise<void>;
  onSuccess?: () => void;
}

// Resource fetch hook types
export interface UseResourceFetchOptions<T> {
  maxRetries?: number;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  enabled?: boolean; // Allow disabling auto-fetch
}

// Return type for useResourceFetch hook
export interface UseResourceFetchReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  reset: () => void;
}

// Product line for test order form state
export interface ProductLine {
  productId: string;
  quantity: number;
}

// Options for useApiMutation hook
export interface TestOrderFormState {
  userId: string;
  status: "pending" | "processing" | "shipped" | "cancelled";
  products: ProductLine[];
}

// Actions for test order form reducer
export type TestOrderFormAction =
  | { type: "SET_USER_ID"; payload: string }
  | {
      type: "SET_STATUS";
      payload: "pending" | "processing" | "shipped" | "cancelled";
    }
  | { type: "ADD_PRODUCT_LINE" }
  | { type: "REMOVE_PRODUCT_LINE"; payload: number }
  | {
      type: "UPDATE_PRODUCT_LINE";
      payload: {
        index: number;
        field: keyof ProductLine;
        value: string | number;
      };
    }
  | { type: "RESET" };
