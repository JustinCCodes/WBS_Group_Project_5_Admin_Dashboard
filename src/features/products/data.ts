import api from "@/src/shared/lib/api";
import type {
  Product,
  ProductInput,
  GetProductsParams,
  ProductsResponse,
} from "./types";

// Products API Functions

export const getAllProducts = async () => {
  const response = await api.get("/products?limit=1000");
  return response.data;
};

// Creates a new product
export const createProduct = async (data: ProductInput) => {
  const response = await api.post("/products", data);
  return response.data;
};

// Updates an existing product
export const updateProduct = async (
  productId: string,
  data: Partial<ProductInput>
) => {
  const response = await api.put(`/products/${productId}`, data);
  return response.data;
};

// Deletes a product by ID
export const deleteProduct = async (productId: string) => {
  await api.delete(`/products/${productId}`);
};

// Updates product stock
export const updateProductStock = async (productId: string, stock: number) => {
  await api.put(`/admin/products/${productId}/stock`, { stock });
};

// Fetches products with low stock
export const getLowStockProducts = async (threshold: number = 10) => {
  const response = await api.get(
    `/admin/products/low-stock?threshold=${threshold}`
  );
  return response.data;
};

// Fetches products with optional filters and pagination
export const getProducts = async (
  params?: GetProductsParams
): Promise<ProductsResponse> => {
  const response = await api.get("/products", { params });
  return {
    data: response.data.data || [],
    pagination: response.data.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    },
  };
};

// Features/Unfeatures a product
export const featureProduct = async (productId: string) => {
  await api.put(`/admin/products/${productId}/feature`);
};

// Unfeatures a product
export const unfeatureProduct = async (productId: string) => {
  await api.put(`/admin/products/${productId}/unfeature`);
};
