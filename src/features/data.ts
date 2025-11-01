import api from "@/src/shared/lib/api";
import {
  DashboardStats,
  Order,
  Product,
  ProductInput,
  GetProductsParams,
  ProductsResponse,
} from "./types";

// Dashboard API Functions
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Fetches all required data
    const [usersRes, productsRes, categoriesRes, ordersRes] = await Promise.all(
      [
        api.get("/admin/users?limit=1000"), // Gets all users
        api.get("/products?limit=1000"), // Gets all products (public)
        api.get("/categories"), // Gets all categories (public)
        api.get("/admin/orders?limit=10&page=1"), // Gets first 10 orders
      ]
    );

    // Extracts data from responses
    const users = usersRes.data.data || [];
    const products = productsRes.data.data || [];
    const categories = categoriesRes.data || [];
    const orders = ordersRes.data.data || [];

    // Calculates total revenue from all orders
    const allOrdersRes = await api.get("/admin/orders?limit=1000");
    const allOrders = allOrdersRes.data.data || [];
    const totalRevenue = allOrders.reduce(
      (sum: number, order: Order) => sum + order.total,
      0
    );

    // Returns compiled dashboard statistics
    return {
      totalUsers: usersRes.data.pagination?.total || users.length,
      totalProducts: productsRes.data.pagination?.total || products.length,
      totalCategories: categories.length,
      totalOrders: ordersRes.data.pagination?.total || 0,
      totalRevenue,
      newestOrders: orders.slice(0, 10), // Get the 10 newest orders
    };
  } catch (error) {
    throw error;
  }
};

// Users API Functions
export const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Deletes a user by ID
export const deleteUser = async (userId: string) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Updates a user's details
export const updateUser = async (
  userId: string,
  data: { name?: string; email?: string; role?: string }
) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Orders API Functions
export const getAllOrders = async (
  page = 1,
  limit = 10,
  filters?: { userId?: string; status?: string }
) => {
  try {
    let url = `/admin/orders?page=${page}&limit=${limit}`;
    if (filters?.userId) url += `&userId=${filters.userId}`;
    if (filters?.status) url += `&status=${filters.status}`;

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Updates an order's status
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await api.put(`/admin/orders/${orderId}`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Categories API Functions
export const getAllCategories = async () => {
  try {
    // Uses admin endpoint to get categories with full metadata
    const response = await api.get("/admin/categories");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Creates a new category
export const createCategory = async (data: {
  name: string;
  description?: string;
}) => {
  const response = await api.post("/categories", data);
  return response.data;
};

// Updates an existing category
export const updateCategory = async (
  categoryId: string,
  data: { name: string; description?: string }
) => {
  const response = await api.put(`/categories/${categoryId}`, data);
  return response.data;
};

// Deletes a category by ID
export const deleteCategory = async (categoryId: string) => {
  await api.delete(`/categories/${categoryId}`);
};

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

// Orders API Functions (additional)
export const deleteOrder = async (orderId: string) => {
  await api.delete(`/admin/orders/${orderId}`);
};

// Users API Functions (additional)
export const banUser = async (
  userId: string,
  data: { reason: string; bannedUntil?: string; isPermanent?: boolean }
) => {
  await api.put(`/admin/users/${userId}/ban`, data);
};

// Unbans a user by ID
export const unbanUser = async (userId: string) => {
  await api.put(`/admin/users/${userId}/unban`);
};

// Searches users by email or ID
export const searchUsers = async (searchTerm: string) => {
  // Determines if search term looks like a MongoDB ObjectId
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(searchTerm);

  // Build query params - use id if it looks like an ObjectId, otherwise search by email
  const params = isObjectId
    ? `id=${searchTerm}&limit=1000`
    : `email=${encodeURIComponent(searchTerm)}&limit=1000`;

  // Makes API call to search users
  const response = await api.get(`/admin/users/search?${params}`);
  return response.data;
};

// Test Orders API Functions
export const createTestOrder = async (data: {
  userId: string;
  products: { productId: string; quantity: number }[];
  status: string;
}) => {
  const response = await api.post("/admin/test-orders", data);
  return response.data;
};

// Fetches all test orders
export const getAllTestOrders = async () => {
  const response = await api.get("/admin/test-orders?limit=1000");
  return response.data;
};

// Deletes a test order by ID
export const deleteTestOrder = async (orderId: string) => {
  await api.delete(`/admin/test-orders/${orderId}`);
};

// Cloudinary Image Upload Function (Direct Upload)
export const uploadImageToCloudinary = async (
  file: File
): Promise<{ imageUrl: string; imagePublicId: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
  );
  formData.append("folder", "products");

  // Cloudinary cloud name from environment variables
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Validates cloud name
  if (!cloudName) {
    throw new Error(
      "Cloudinary cloud name not configured. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to your .env.local file."
    );
  }

  // Makes POST request to Cloudinary upload endpoint
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  // Handles upload errors
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error?.message || "Failed to upload image to Cloudinary"
    );
  }

  // Parses response data
  const data = await response.json();

  return {
    imageUrl: data.secure_url,
    imagePublicId: data.public_id,
  };
};
