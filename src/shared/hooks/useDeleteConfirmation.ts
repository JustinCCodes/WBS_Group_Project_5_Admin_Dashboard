import { useState } from "react";
import { UseDeleteConfirmationReturn, DeleteConfirmState } from "./types";

// Custom hook for managing delete confirmation dialog state and actions
export function useDeleteConfirmation(
  resourceName: string = "item"
): UseDeleteConfirmationReturn {
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    show: false,
    id: "",
    name: "",
  });

  // Opens the delete confirmation dialog
  const openDeleteConfirm = (id: string, name?: string) => {
    setDeleteConfirm({ show: true, id, name });
  };

  // Handles the confirmed deletion
  const handleConfirmDelete = async (
    deleteFn: (id: string) => Promise<void>
  ) => {
    const { id } = deleteConfirm;
    setDeleteConfirm({ show: false, id: "", name: "" });
    await deleteFn(id);
  };

  // Cancels the deletion
  const handleCancelDelete = () => {
    setDeleteConfirm({ show: false, id: "", name: "" });
  };

  // Pre configured dialog props
  const dialogProps = {
    isOpen: deleteConfirm.show,
    title: `Delete ${resourceName}`,
    message: deleteConfirm.name
      ? `Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`
      : `Are you sure you want to delete this ${resourceName.toLowerCase()}? This action cannot be undone.`,
    confirmText: "Delete",
    cancelText: "Cancel",
    variant: "danger" as const,
  };

  return {
    deleteConfirm,
    openDeleteConfirm,
    handleConfirmDelete,
    handleCancelDelete,
    dialogProps,
  };
}
