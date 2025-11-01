import { useResourceFetch } from "./useResourceFetch";
import { getAllUsers } from "@/src/features/data";
import type { User } from "@/src/features/types";

// Hook for fetching users with auto retry

export function useUsers() {
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useResourceFetch(() => getAllUsers(1, 1000), [], { maxRetries: 3 });

  return {
    users: (usersData?.data || []) as User[],
    isLoading,
    error,
    refetch,
  };
}
