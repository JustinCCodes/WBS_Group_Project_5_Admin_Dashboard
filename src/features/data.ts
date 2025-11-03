import api from "@/src/shared/lib/api";
import type { DashboardStats } from "./types";
import type { Order } from "./orders/types";

// Shared Dashboard API Function
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

  // Makes post request to Cloudinary upload endpoint
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
