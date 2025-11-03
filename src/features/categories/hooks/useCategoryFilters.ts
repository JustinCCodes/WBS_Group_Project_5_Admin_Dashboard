import { useState, useMemo } from "react";
import type { Category } from "../types";

// Hook for managing category filters: search, sort by, sort order
export function useCategoryFilters(categories: Category[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Memoized filtered categories based on search and sorting
  const filteredCategories = useMemo(() => {
    let filtered = [...categories];

    // Applies search filter
    if (searchTerm) {
      filtered = filtered.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Applies sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      // Determines comparison based on sortBy
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
        // Assumes name is always defined
      } else if (sortBy === "date") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        comparison = dateA - dateB;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [categories, searchTerm, sortBy, sortOrder]);

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredCategories,
  };
}
