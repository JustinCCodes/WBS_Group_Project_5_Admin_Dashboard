import { useState, useMemo } from "react";
import { textIncludes, sortByDate, sortByString } from "@/src/shared/lib/utils";
import type { User } from "../types";

// Hook to manage user filtering logic
export const useUserFilters = (users: User[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "email" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Memoized computation of filtered users
  const filteredUsers = useMemo(() => {
    return users
      .filter((user: User) => {
        // Search by name, email, or ID
        const matchesSearch =
          textIncludes(user.name, searchTerm) ||
          textIncludes(user.email, searchTerm) ||
          textIncludes(user.id, searchTerm);

        // Filter by role
        const matchesRole = !filterRole || user.role === filterRole;

        // Filter by status (active/banned)
        const isBanned =
          user.bannedUntil && new Date(user.bannedUntil) > new Date();
        const matchesStatus =
          !filterStatus ||
          (filterStatus === "banned" && isBanned) ||
          (filterStatus === "active" && !isBanned);

        return matchesSearch && matchesRole && matchesStatus;
      })
      .sort((a: User, b: User) => {
        if (sortBy === "name") {
          return sortByString(a, b, "name", sortOrder);
        } else if (sortBy === "email") {
          return sortByString(a, b, "email", sortOrder);
        } else {
          return sortByDate(a, b, "createdAt", sortOrder);
        }
      });
  }, [users, searchTerm, filterRole, filterStatus, sortBy, sortOrder]);

  return {
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredUsers,
  };
};
