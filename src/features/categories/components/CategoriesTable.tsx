import Table from "@/src/shared/ui/Table";
import Button from "@/src/shared/ui/Button";
import type { Category, CategoriesTableProps } from "../types";

// Component to display categories in a table
export function CategoriesTable({
  categories,
  searchTerm,
  onEdit,
  onDelete,
  isFormActive,
}: CategoriesTableProps) {
  return (
    <>
      <Table
        columns={[
          { key: "name", label: "Name" },
          { key: "createdAt", label: "Created At" },
          { key: "createdBy", label: "Created By" },
          { key: "actions", label: "Actions" },
        ]}
        data={categories}
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
                  onClick={() => onEdit(category)}
                  disabled={isFormActive}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(category.id, category.name)}
                  disabled={isFormActive}
                >
                  Delete
                </Button>
              </div>
            </td>
          </>
        )}
      />
    </>
  );
}
