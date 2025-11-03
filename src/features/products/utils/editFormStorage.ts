import type { ProductInput } from "../types";

export const EDIT_FORM_STORAGE_KEY = "product-edit-form-draft";

// Load saved form data from localStorage (for edit form)
export const loadSavedFormData = (key: string): ProductInput | null => {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

// Save form data to localStorage (for edit form)
export const saveFormData = (key: string, data: ProductInput): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save form data:", error);
  }
};

// Clear saved form data from localStorage (for edit form)
export const clearFormData = (key: string): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to clear form data:", error);
  }
};
