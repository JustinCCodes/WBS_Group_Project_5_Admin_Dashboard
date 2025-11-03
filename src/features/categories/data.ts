import api from "@/src/shared/lib/api";

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
  const response = await api.delete(`/categories/${categoryId}`);
  return response.data;
};
