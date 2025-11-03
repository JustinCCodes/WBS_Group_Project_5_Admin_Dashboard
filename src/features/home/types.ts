import type { Order } from "../orders/types";

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  newestOrders: Order[];
}
