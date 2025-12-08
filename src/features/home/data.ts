import api from "@/src/shared/lib/api";
import type { DashboardStats } from "./types";
import type { Order } from "../orders/types";

// Dashboard API Function
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
      totalUsers: usersRes.data.pagination?.totalItems || users.length,
      totalProducts: productsRes.data.pagination?.totalItems || products.length,
      totalCategories: categories.length,
      totalOrders: ordersRes.data.pagination?.totalItems || 0,
      totalRevenue,
      newestOrders: orders.slice(0, 10), // Get the 10 newest orders
    };
  } catch (error) {
    throw error;
  }
};
