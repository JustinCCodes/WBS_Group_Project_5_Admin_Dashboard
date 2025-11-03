import api from "@/src/shared/lib/api";

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

// Updates an orders status
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await api.put(`/admin/orders/${orderId}`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Deletes an order by ID
export const deleteOrder = async (orderId: string) => {
  await api.delete(`/admin/orders/${orderId}`);
};
