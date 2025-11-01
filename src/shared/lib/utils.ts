// Shared utility functions for common operations across the application

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

// Handles delete operation with confirmation dialog
export async function confirmAndDelete(
  message: string,
  deleteFn: () => Promise<any>,
  refetchFn: () => Promise<void>

  // Returns true if deletion succeeded false otherwise
): Promise<boolean> {
  if (!confirm(message)) {
    return false;
  }

  // Executes deletion
  const result = await deleteFn();
  if (result) {
    await refetchFn();
    return true;
  }

  return false;
}

// Executes a mutation and refetches data if successful
export async function mutateAndRefetch(
  mutateFn: () => Promise<any>,
  refetchFn: () => Promise<void>
): Promise<boolean> {
  const result = await mutateFn();
  if (result) {
    await refetchFn();
    return true;
  }
  return false;
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
  const dateA = new Date(a[dateField] as any).getTime();
  const dateB = new Date(b[dateField] as any).getTime();
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
