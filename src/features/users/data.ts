import api from "@/src/shared/lib/api";

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

// Updates a users details
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

// Bans a user by ID
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

  // Build query params - use id if it looks like an ObjectId otherwise search by email
  const params = isObjectId
    ? `id=${searchTerm}&limit=1000`
    : `email=${encodeURIComponent(searchTerm)}&limit=1000`;

  // Makes API call to search users
  const response = await api.get(`/admin/users/search?${params}`);
  return response.data;
};
