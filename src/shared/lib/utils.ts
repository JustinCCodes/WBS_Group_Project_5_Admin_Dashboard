import type { ApiErrorResponse } from "@/src/types/types";

// Extracts error message from API errors
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  // Handles ApiErrorResponse structure
  const apiError = error as ApiErrorResponse;
  return (
    apiError?.response?.data?.error ||
    apiError?.response?.data?.message ||
    apiError?.message ||
    "An unexpected error occurred"
  );
}

// Case insensitive text search helper
export function textIncludes(
  text: string | null | undefined,
  searchTerm: string
): boolean {
  if (!text || !searchTerm) return true;
  return text.toLowerCase().includes(searchTerm.toLowerCase());
}

// Sorts array by date field
export function sortByDate<T>(
  a: T,
  b: T,
  dateField: keyof T,
  order: "asc" | "desc"
): number {
  const dateA = new Date(a[dateField] as string | number | Date).getTime();
  const dateB = new Date(b[dateField] as string | number | Date).getTime();
  return order === "asc" ? dateA - dateB : dateB - dateA;
}

// Sorts array by string field
export function sortByString<T>(
  a: T,
  b: T,
  field: keyof T,
  order: "asc" | "desc"
): number {
  const strA = String(a[field] || "");
  const strB = String(b[field] || "");
  return order === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
}
