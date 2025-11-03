"use client";

import { useState } from "react";
import { deleteUser, updateUser, banUser, unbanUser } from "../data";
import type { User } from "../types";
import { useApiMutation, useDeleteConfirmation } from "@/src/shared/hooks";
import { useUsers, useUserFilters } from "@/src/features/users/hooks";
import { UserFilters, UsersTable, BanUserModal } from "@/src/features/users";
import Button from "@/src/shared/ui/Button";
import ErrorAlert from "@/src/shared/ui/ErrorAlert";
import LoadingState from "@/src/shared/ui/LoadingState";
import BackButton from "@/src/shared/ui/BackButton";
import ConfirmDialog from "@/src/shared/ui/ConfirmDialog";
import toast from "react-hot-toast";

// Main container component for managing users
export default function UsersManagementContainer() {
  const { users, isLoading: loading, error, refetch: fetchUsers } = useUsers();

  // User filtering
  const {
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
  } = useUserFilters(users);

  // Confirmation states
  const {
    openDeleteConfirm,
    handleConfirmDelete,
    handleCancelDelete,
    dialogProps,
  } = useDeleteConfirmation("User");

  const [roleConfirm, setRoleConfirm] = useState<{
    show: boolean;
    userId: string;
    newRole: "user" | "admin";
  }>({ show: false, userId: "", newRole: "user" });

  const [unbanConfirm, setUnbanConfirm] = useState<{
    show: boolean;
    userId: string;
    userName: string;
  }>({ show: false, userId: "", userName: "" });

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

  // API mutations
  const { mutate: mutateDelete } = useApiMutation(deleteUser, {
    successMessage: "User deleted successfully",
    onSuccess: () => fetchUsers(true),
  });

  // Update role mutation
  const { mutate: mutateUpdateRole } = useApiMutation(updateUser, {
    successMessage: "User role updated successfully",
    onSuccess: () => fetchUsers(true),
  });

  // Ban user mutation
  const { mutate: mutateBan, isLoading: isBanning } = useApiMutation(banUser, {
    successMessage: "User banned successfully",
    onSuccess: () => fetchUsers(true),
  });

  // Unban user mutation
  const { mutate: mutateUnban } = useApiMutation(unbanUser, {
    successMessage: "User unbanned successfully",
    onSuccess: () => fetchUsers(true),
  });

  // Event handlers
  const openRoleConfirm = (userId: string, newRole: "user" | "admin") => {
    setRoleConfirm({ show: true, userId, newRole });
  };

  // Confirm role change
  const handleConfirmRoleChange = async () => {
    const { userId, newRole } = roleConfirm;
    setRoleConfirm({ show: false, userId: "", newRole: "user" });
    await mutateUpdateRole(userId, { role: newRole });
  };

  // Open ban modal
  const openBanModal = (user: User) => {
    setBanModal({ show: true, user, reason: "", until: "" });
  };

  // Confirm ban action
  const handleConfirmBan = async () => {
    if (!banModal.user || !banModal.reason.trim()) {
      toast.error("Please provide a ban reason");
      return;
    }

    // Prepare ban data
    const userId = banModal.user.id;
    const banData: { reason: string; until?: string } = {
      reason: banModal.reason,
    };

    // Include until date if provided
    if (banModal.until) {
      banData.until = new Date(banModal.until).toISOString();
    }

    // Close modal and execute ban
    setBanModal({ show: false, user: null, reason: "", until: "" });
    await mutateBan(userId, banData);
  };

  // Open unban confirmation dialog
  const openUnbanConfirm = (userId: string, userName: string) => {
    setUnbanConfirm({ show: true, userId, userName });
  };

  // Confirm unban action
  const handleConfirmUnban = async () => {
    const { userId } = unbanConfirm;
    setUnbanConfirm({ show: false, userId: "", userName: "" });
    await mutateUnban(userId);
  };

  // Loading state
  if (loading && users.length === 0) {
    return <LoadingState message="Loading users..." />;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        {/* Header */}
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

        {/* Filters */}
        <UserFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterRole={filterRole}
          onRoleChange={setFilterRole}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />

        {/* Table */}
        <UsersTable
          users={filteredUsers}
          searchTerm={searchTerm}
          filterRole={filterRole}
          filterStatus={filterStatus}
          onRoleChange={openRoleConfirm}
          onBanUser={openBanModal}
          onUnbanUser={openUnbanConfirm}
          onDeleteUser={openDeleteConfirm}
        />

        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Modals & Dialogs */}
      <BanUserModal
        isOpen={banModal.show}
        user={banModal.user}
        reason={banModal.reason}
        until={banModal.until}
        isBanning={isBanning}
        onReasonChange={(reason) => setBanModal({ ...banModal, reason })}
        onUntilChange={(until) => setBanModal({ ...banModal, until })}
        onConfirm={handleConfirmBan}
        onClose={() =>
          setBanModal({ show: false, user: null, reason: "", until: "" })
        }
      />

      <ConfirmDialog
        {...dialogProps}
        onConfirm={() => handleConfirmDelete(mutateDelete)}
        onCancel={handleCancelDelete}
      />

      <ConfirmDialog
        isOpen={roleConfirm.show}
        title="Change User Role"
        message={`Are you sure you want to change this user's role to ${roleConfirm.newRole}?`}
        confirmText="Change Role"
        cancelText="Cancel"
        variant="primary"
        onConfirm={handleConfirmRoleChange}
        onCancel={() =>
          setRoleConfirm({ show: false, userId: "", newRole: "user" })
        }
      />

      <ConfirmDialog
        isOpen={unbanConfirm.show}
        title="Unban User"
        message={`Are you sure you want to unban "${unbanConfirm.userName}"?`}
        confirmText="Unban"
        cancelText="Cancel"
        variant="primary"
        onConfirm={handleConfirmUnban}
        onCancel={() =>
          setUnbanConfirm({ show: false, userId: "", userName: "" })
        }
      />
    </div>
  );
}
