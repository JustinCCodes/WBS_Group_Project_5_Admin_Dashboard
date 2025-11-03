import { useState, useMemo } from "react";
import { textIncludes, sortByDate, sortByString } from "@/src/shared/lib/utils";
import type { Product } from "../types";

// Hook to manage product filtering logic
export const useProductFilters = (products: Product[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "date">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Memoized computation of filtered products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product: Product) => {
        const matchesSearch =
          textIncludes(product.name, searchTerm) ||
          textIncludes(product.description, searchTerm);

        const categoryId =
          typeof product.categoryId === "object"
            ? product.categoryId.id
            : product.categoryId;
        const matchesCategory =
          !filterCategory || categoryId === filterCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a: Product, b: Product) => {
        if (sortBy === "name") {
          return sortByString(a, b, "name", sortOrder);
        } else if (sortBy === "price") {
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        } else {
          return sortByDate(a, b, "createdAt", sortOrder);
        }
      });
  }, [products, searchTerm, filterCategory, sortBy, sortOrder]);

  return {
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredProducts,
  };
};
