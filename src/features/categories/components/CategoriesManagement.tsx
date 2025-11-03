"use client";

import { useState } from "react";
import Button from "@/src/shared/ui/Button";
import ErrorAlert from "@/src/shared/ui/ErrorAlert";
import LoadingState from "@/src/shared/ui/LoadingState";
import BackButton from "@/src/shared/ui/BackButton";
import ConfirmDialog from "@/src/shared/ui/ConfirmDialog";
import { createCategory, updateCategory, deleteCategory } from "../data";
import {
  useAdminForm,
  useApiMutation,
  useDeleteConfirmation,
} from "@/src/shared/hooks";
import { useCategories } from "../hooks/useCategories";
import { useCategoryFilters } from "../hooks/useCategoryFilters";
import { CategoryFilters } from "./CategoryFilters";
import { CategoryForm } from "./CategoryForm";
import { CategoriesTable } from "./CategoriesTable";
import type { Category } from "../types";

// Main component for managing categories
export default function CategoriesManagementContainer() {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {
    categories,
    isLoading: loading,
    error,
    refetch: fetchCategories,
  } = useCategories();

  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredCategories,
  } = useCategoryFilters(categories);

  // Form for creating categories
  const createForm = useAdminForm<{ name: string }>({
    initialData: { name: "" },
    onSubmit: async (data) => {
      await createCategory(data);
    },
    onSuccess: () => {
      fetchCategories(true);
      setIsCreating(false);
    },
  });

  // Form for updating categories
  const updateForm = useAdminForm<{ name: string }>({
    initialData: { name: "" },
    onSubmit: async (data) => {
      if (!editingCategory) return;
      await updateCategory(editingCategory.id, data);
    },
    onSuccess: () => {
      fetchCategories(true);
      setIsEditing(false);
      setEditingCategory(null);
    },
  });

  // Active form (either create or update)
  const activeForm = isCreating ? createForm : updateForm;

  // Deletes mutation
  const { mutate: mutateDelete } = useApiMutation(deleteCategory, {
    successMessage: "Category deleted successfully",
    onSuccess: () => fetchCategories(true),
  });

  // Deletes confirmation dialog
  const {
    dialogProps,
    openDeleteConfirm,
    handleConfirmDelete,
    handleCancelDelete,
  } = useDeleteConfirmation("Category");

  // Starts the create category process
  const startCreate = () => {
    createForm.setFormData({ name: "" });
    setIsCreating(true);
    setIsEditing(false);
  };

  // Starts the edit category process
  const startEdit = (category: Category) => {
    setEditingCategory(category);
    updateForm.setFormData({ name: category.name });
    setIsEditing(true);
    setIsCreating(false);
  };

  // Cancels the create/edit process
  const cancelForm = () => {
    setIsCreating(false);
    setIsEditing(false);
    setEditingCategory(null);
    createForm.setFormData({ name: "" });
    updateForm.setFormData({ name: "" });
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col mb-6">
          <BackButton />
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                <span className="bg-linear-to-r from-amber-600 to-yellow-600 dark:from-amber-200 dark:to-yellow-600 bg-clip-text text-transparent">
                  Categories Management
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Total Categories:{" "}
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {categories.length}
                </span>
              </p>
            </div>
            <Button
              size="lg"
              onClick={startCreate}
              disabled={isCreating || isEditing}
            >
              + Add Category
            </Button>
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        {/* Create/Edit Form */}
        {(isCreating || isEditing) && (
          <CategoryForm
            formState={activeForm}
            isCreating={isCreating}
            onCancel={cancelForm}
          />
        )}

        {/* Filters */}
        <CategoryFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />

        {/* Categories Table */}
        <CategoriesTable
          categories={filteredCategories}
          searchTerm={searchTerm}
          totalCount={categories.length}
          onEdit={startEdit}
          onDelete={openDeleteConfirm}
          isFormActive={isCreating || isEditing}
        />

        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </div>

      <ConfirmDialog
        {...dialogProps}
        onConfirm={() => handleConfirmDelete(mutateDelete)}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
