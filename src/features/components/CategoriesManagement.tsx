"use client";

import { useState, useMemo } from "react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/src/features/data";
import type { Category } from "@/src/features/types";
import {
  useAdminForm,
  useCategories,
  useApiMutation,
} from "@/src/features/hooks";
import {
  confirmAndDelete,
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

export default function CategoriesManagement() {
  const {
    categories,
    isLoading: loading,
    error,
    refetch: fetchCategories,
  } = useCategories();

  // API mutations
  const { mutate: mutateDelete } = useApiMutation(deleteCategory, {
    successMessage: "Category deleted successfully",
  });

  // Form states
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Form hook
  const createForm = useAdminForm<{ name: string }>({
    initialData: { name: "" },
    onSubmit: async (data: { name: string }) => {
      await createCategory(data);
      setIsCreating(false);
      await fetchCategories();
    },
  });

  // Form hook for editing
  const updateForm = useAdminForm<{ name: string }>({
    initialData: { name: "" },
    onSubmit: async (data: { name: string }) => {
      if (!editingCategory) return;
      await updateCategory(editingCategory.id, data);
      setIsEditing(false);
      setEditingCategory(null);
      await fetchCategories();
    },
  });

  // Gets active form based on mode
  const activeForm = isCreating ? createForm : updateForm;

  // Handles category deletion
  const handleDeleteCategory = async (id: string, name: string) => {
    await confirmAndDelete(
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      () => mutateDelete(id),
      fetchCategories
    );
  };

  // Starts editing a category
  const startEdit = (category: Category) => {
    setEditingCategory(category);
    updateForm.setFormData({ name: category.name });
    setIsEditing(true);
    setIsCreating(false);
  };

  // Cancels create/edit form
  const cancelForm = () => {
    setIsCreating(false);
    setIsEditing(false);
    setEditingCategory(null);
    createForm.reset();
    updateForm.reset();
  };

  // Filters and sorts categories
  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat: Category) => textIncludes(cat.name, searchTerm))
      .sort((a: Category, b: Category) => {
        if (sortBy === "name") {
          return sortByString(a, b, "name", sortOrder);
        } else {
          return sortByDate(a, b, "createdAt", sortOrder);
        }
      });
  }, [categories, searchTerm, sortBy, sortOrder]);

  // Loading state
  if (loading && categories.length === 0) {
    return <LoadingState message="Loading categories..." />;
  }

  return (
    <div className="min-h-screen  text-white">
      <div className="container mx-auto p-6">
        <div className="flex flex-col mb-6">
          <BackButton />
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-3xl font-bold">
              <span className="bg-linear-to-r from-amber-600 to-yellow-600 dark:from-amber-200 dark:to-yellow-600 bg-clip-text text-transparent">
                Manage Categories
              </span>
            </h1>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => fetchCategories()}
                disabled={loading}
                variant="primary"
                size="lg"
                title="Refresh categories"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setIsCreating(true);
                  setIsEditing(false);
                  createForm.reset();
                }}
                disabled={isCreating || isEditing}
              >
                + Create Category
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && <ErrorAlert message={error} />}

        {/* Create/Edit Form */}
        {(isCreating || isEditing) && (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 shadow-xl mb-6">
            <h2 className="text-xl font-bold mb-6 text-amber-400">
              {isCreating ? "Create New Category" : "Edit Category"}
            </h2>
            <form onSubmit={activeForm.handleSubmit}>
              {activeForm.error && <ErrorAlert message={activeForm.error} />}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  value={activeForm.formData.name}
                  onChange={(e) =>
                    activeForm.setFormData({ name: e.target.value })
                  }
                  required
                  minLength={1}
                  disabled={activeForm.loading}
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={cancelForm}
                  disabled={activeForm.loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={activeForm.loading}
                  loading={activeForm.loading}
                >
                  {activeForm.loading
                    ? "Saving..."
                    : isCreating
                    ? "Create"
                    : "Update"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Search & Sort Controls */}
        <div className="flex gap-4 mb-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search categories..."
              className="w-full"
            />
          </div>
          <CustomSelect
            value={sortBy}
            onChange={(value) => setSortBy(value as "name" | "date")}
            options={[
              { value: "name", label: "Sort by Name" },
              { value: "date", label: "Sort by Date" },
            ]}
          />
          <CustomSelect
            value={sortOrder}
            onChange={(value) => setSortOrder(value as "asc" | "desc")}
            options={[
              { value: "asc", label: "Ascending" },
              { value: "desc", label: "Descending" },
            ]}
          />
        </div>

        {/* Categories Table */}
        <Table
          columns={[
            { key: "name", label: "Name" },
            { key: "createdAt", label: "Created At" },
            { key: "createdBy", label: "Created By" },
            { key: "actions", label: "Actions" },
          ]}
          data={filteredCategories}
          emptyMessage={
            searchTerm
              ? "No categories found matching your search"
              : "No categories yet"
          }
          renderRow={(category: Category) => (
            <>
              <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                {category.name}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {category.createdAt
                  ? new Date(category.createdAt).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {category.createdBy
                  ? typeof category.createdBy === "object" &&
                    "name" in category.createdBy
                    ? category.createdBy.name
                    : typeof category.createdBy === "string"
                    ? category.createdBy
                    : "Admin"
                  : "N/A"}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    variant="edit"
                    size="sm"
                    onClick={() => startEdit(category)}
                    disabled={isCreating || isEditing}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() =>
                      handleDeleteCategory(category.id, category.name)
                    }
                    disabled={isCreating || isEditing}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </>
          )}
        />

        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </div>
    </div>
  );
}
