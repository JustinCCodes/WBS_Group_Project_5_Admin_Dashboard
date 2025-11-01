"use client";

import { useState, useMemo } from "react";
import {
  deleteUser,
  updateUser,
  banUser,
  unbanUser,
} from "@/src/features/data";
import type { User } from "@/src/features/types";
import { useApiMutation, useUsers } from "@/src/features/hooks";
import {
  confirmAndDelete,
  mutateAndRefetch,
  textIncludes,
  sortByDate,
  sortByString,
} from "@/src/shared/lib/utils";
import { CustomSelect } from "@/src/shared/ui/CustomSelect";
import Button from "@/src/shared/ui/Button";
import SearchBar from "@/src/shared/ui/SearchBar";
import Table from "@/src/shared/ui/Table";
import ErrorAlert from "@/src/shared/ui/ErrorAlert";
import LoadingState from "@/src/shared/ui/LoadingState";
import BackButton from "@/src/shared/ui/BackButton";
import Modal from "@/src/shared/ui/Modal";
import toast from "react-hot-toast";

export default function UsersManagement() {
  const { users, isLoading: loading, error, refetch: fetchUsers } = useUsers();

  // Search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "email" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Ban modal state
  const [banModal, setBanModal] = useState<{
    show: boolean;
    user: User | null;
    reason: string;
    until: string;
  }>({
    show: false,
    user: null,
    reason: "",
    until: "",
  });

  // API mutation hooks
  const { mutate: mutateDelete, isLoading: isDeleting } = useApiMutation(
    deleteUser,
    { successMessage: "User deleted successfully" }
  );

  // Mutation for updating user role
  const { mutate: mutateUpdateRole, isLoading: isUpdatingRole } =
    useApiMutation(updateUser, {
      successMessage: "User role updated successfully",
    });

  // Mutation for banning users
  const { mutate: mutateBan, isLoading: isBanning } = useApiMutation(banUser, {
    successMessage: "User banned successfully",
  });

  // Mutation for unbanning users
  const { mutate: mutateUnban, isLoading: isUnbanning } = useApiMutation(
    unbanUser,
    { successMessage: "User unbanned successfully" }
  );

  // Handles role update
  const handleUpdateRole = async (
    userId: string,
    newRole: "user" | "admin"
  ) => {
    // Confirmation prompt
    if (
      !confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    ) {
      return;
    }

    // Perform mutation and refetch
    await mutateAndRefetch(
      () => mutateUpdateRole(userId, { role: newRole }),
      fetchUsers
    );
  };

  // Handles user deletion
  const handleDeleteUser = async (userId: string, userName: string) => {
    await confirmAndDelete(
      `Are you sure you want to delete "${userName}"? This action cannot be undone.`,
      () => mutateDelete(userId),
      fetchUsers
    );
  };

  // Opens ban modal
  const openBanModal = (user: User) => {
    setBanModal({
      show: true,
      user,
      reason: "",
      until: "",
    });
  };

  // Handles banning users
  const handleBanUser = async () => {
    if (!banModal.user || !banModal.reason) {
      toast.error("Please provide a ban reason");
      return;
    }

    // Prepares payload for banning user
    const payload: { reason: string; bannedUntil?: string } = {
      reason: banModal.reason,
    };
    if (banModal.until) {
      payload.bannedUntil = new Date(banModal.until).toISOString();
    }

    // Calls mutateBan and refetches users on success
    const result = await mutateBan(banModal.user.id, payload);
    if (result) {
      setBanModal({
        show: false,
        user: null,
        reason: "",
        until: "",
      });
      await fetchUsers();
    }
  };

  // Handles unbanning users
  const handleUnbanUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to unban "${userName}"?`)) {
      return;
    }

    // Calls mutateUnban and refetches users on success
    await mutateAndRefetch(() => mutateUnban(userId), fetchUsers);
  };

  // Filters and sorts users
  const filteredUsers = useMemo(() => {
    return (
      users
        .filter((user: User) => {
          const matchesSearch =
            !searchTerm ||
            textIncludes(user.name, searchTerm) ||
            textIncludes(user.email, searchTerm) ||
            textIncludes(user.id, searchTerm);

          // Applies role and status filters
          const matchesRole = !filterRole || user.role === filterRole;
          const matchesStatus = !filterStatus || user.status === filterStatus;

          // Combines all filter conditions
          return matchesSearch && matchesRole && matchesStatus;
        })
        // Sorts users based on selected criteria
        .sort((a: User, b: User) => {
          if (sortBy === "name") {
            return sortByString(a, b, "name", sortOrder);
          } else if (sortBy === "email") {
            return sortByString(a, b, "email", sortOrder);
          } else {
            return sortByDate(a, b, "createdAt", sortOrder);
          }
        })
    );
  }, [users, searchTerm, filterRole, filterStatus, sortBy, sortOrder]);

  // Loading state
  if (loading && users.length === 0) {
    return <LoadingState message="Loading users..." />;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        <div className="flex flex-col mb-6">
          <BackButton />
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                <span className="bg-linear-to-r from-amber-600 to-yellow-600 dark:from-amber-200 dark:to-yellow-600 bg-clip-text text-transparent">
                  Manage Users
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Total Users:{" "}
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {users.length}
                </span>
              </p>
            </div>
            <Button
              onClick={() => fetchUsers()}
              loading={loading}
              title="Refresh users"
            >
              Refresh
            </Button>
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        {/* Search & Filter Controls */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px] flex gap-2">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by name, email, or ID..."
              className="flex-1"
            />
            {searchTerm && (
              <Button
                variant="secondary"
                size="md"
                onClick={() => setSearchTerm("")}
              >
                Clear
              </Button>
            )}
          </div>
          <CustomSelect
            value={filterRole}
            onChange={(value) => setFilterRole(value)}
            options={[
              { value: "", label: "All Roles" },
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
            ]}
            className="min-w-[120px]"
          />
          <CustomSelect
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            options={[
              { value: "", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "banned", label: "Banned" },
            ]}
            className="min-w-[120px]"
          />
          <CustomSelect
            value={sortBy}
            onChange={(value) => setSortBy(value as "name" | "email" | "date")}
            options={[
              { value: "date", label: "Sort by Date" },
              { value: "name", label: "Sort by Name" },
              { value: "email", label: "Sort by Email" },
            ]}
          />
          <CustomSelect
            value={sortOrder}
            onChange={(value) => setSortOrder(value as "asc" | "desc")}
            options={[
              { value: "desc", label: "Descending" },
              { value: "asc", label: "Ascending" },
            ]}
          />
        </div>

        {/* Users Table */}
        <Table
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role" },
            { key: "status", label: "Status" },
            { key: "joined", label: "Joined" },
            { key: "actions", label: "Actions" },
          ]}
          data={filteredUsers}
          emptyMessage={
            searchTerm || filterRole || filterStatus
              ? "No users found matching your filters"
              : "No users yet"
          }
          renderRow={(user: User) => (
            <>
              <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                {user.name}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {user.email}
              </td>
              <td className="px-4 py-3">
                <div
                  className={user.role === "admin" ? "role-admin" : "role-user"}
                >
                  <CustomSelect
                    value={user.role}
                    onChange={(value) =>
                      handleUpdateRole(user.id, value as "user" | "admin")
                    }
                    options={[
                      { value: "user", label: "User" },
                      { value: "admin", label: "Admin" },
                    ]}
                    size="sm"
                    className={`${
                      user.role === "admin"
                        ? "[&>button]:bg-amber-100 dark:[&>button]:bg-amber-900/20 [&>button]:border-amber-400 dark:[&>button]:border-amber-800 [&>button]:text-amber-700 dark:[&>button]:text-amber-400 [&>button:hover]:border-amber-600"
                        : "[&>button]:bg-gray-100 [&>button]:dark:bg-zinc-900 [&>button]:border-gray-300 [&>button]:dark:border-zinc-700 [&>button]:text-gray-700 [&>button]:dark:text-gray-400"
                    }`}
                  />
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === "active"
                        ? "bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {user.status}
                  </span>
                  {user.status === "banned" && user.bannedReason && (
                    <span
                      className="text-xs text-gray-500 dark:text-gray-500"
                      title={user.bannedReason}
                    >
                      {user.bannedReason.substring(0, 20)}
                      {user.bannedReason.length > 20 ? "..." : ""}
                    </span>
                  )}
                  {user.status === "banned" && user.bannedUntil && (
                    <span className="text-xs text-gray-500">
                      Until: {new Date(user.bannedUntil).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 flex-wrap">
                  {user.status === "active" ? (
                    <button
                      type="button"
                      onClick={() => openBanModal(user)}
                      className="px-3 py-1.5 text-sm bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 font-semibold rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/40 hover:border-yellow-500 dark:hover:border-yellow-700 transition-all"
                    >
                      Ban
                    </button>
                  ) : (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleUnbanUser(user.id, user.name)}
                    >
                      Unban
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id, user.name)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </>
          )}
        />

        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredUsers.length} of {users.length} users
        </div>

        {/* Ban User Modal */}
        <Modal
          isOpen={banModal.show && !!banModal.user}
          onClose={() =>
            setBanModal({
              show: false,
              user: null,
              reason: "",
              until: "",
            })
          }
          title={`Ban User: ${banModal.user?.name || ""}`}
          maxWidth="md"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ban Reason *
            </label>
            <textarea
              className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all h-24"
              placeholder="Enter reason for banning this user..."
              value={banModal.reason}
              onChange={(e) =>
                setBanModal({ ...banModal, reason: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ban Until (Optional)
            </label>
            <input
              type="datetime-local"
              className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={banModal.until}
              onChange={(e) =>
                setBanModal({ ...banModal, until: e.target.value })
              }
            />
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Leave empty for permanent ban
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={() => {
                setBanModal({
                  show: false,
                  user: null,
                  reason: "",
                  until: "",
                });
              }}
              disabled={isBanning}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBanUser}
              disabled={isBanning || !banModal.reason}
              loading={isBanning}
              className="bg-yellow-900/20! border! border-yellow-800! text-yellow-400! hover:bg-yellow-900/40!"
            >
              Ban User
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
