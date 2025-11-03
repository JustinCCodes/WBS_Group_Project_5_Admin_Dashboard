import Table from "@/src/shared/ui/Table";
import Button from "@/src/shared/ui/Button";
import { StockEditor } from "./StockEditor";
import type { Product, ProductsTableProps } from "../types";

// Component to display a table of products with actions
export const ProductsTable = ({
  products,
  searchTerm,
  filterCategory,
  isCreating,
  isEditing,
  onEdit,
  onDelete,
  onStockUpdated,
}: ProductsTableProps) => {
  return (
    <>
      <Table
        columns={[
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          { key: "price", label: "Price" },
          { key: "stock", label: "Stock" },
          { key: "category", label: "Category" },
          { key: "createdAt", label: "Created At" },
          { key: "createdBy", label: "Created By" },
          { key: "actions", label: "Actions" },
        ]}
        data={products}
        emptyMessage={
          searchTerm || filterCategory
            ? "No products found matching your filters"
            : "No products yet"
        }
        renderRow={(product: Product) => (
          <>
            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white max-w-xs">
              <div className="line-clamp-3">{product.name}</div>
            </td>
            <td className="px-4 py-3 max-w-xs truncate text-gray-600 dark:text-gray-400">
              {product.description}
            </td>
            <td className="px-4 py-3 font-semibold text-amber-400">
              ${product.price.toFixed(2)}
            </td>
            <td className="px-4 py-3">
              <StockEditor
                productId={product.id}
                currentStock={product.stock || 0}
                onStockUpdated={onStockUpdated}
              />
            </td>
            <td className="px-4 py-3">
              <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-full text-xs text-gray-700 dark:text-gray-300">
                {typeof product.categoryId === "object"
                  ? product.categoryId.name
                  : "Unknown"}
              </span>
            </td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
              {new Date(product.createdAt).toLocaleDateString()}
            </td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
              {product.createdBy
                ? typeof product.createdBy === "object" &&
                  "name" in product.createdBy
                  ? product.createdBy.name
                  : "Admin"
                : "N/A"}
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <Button
                  variant="edit"
                  size="md"
                  onClick={() => onEdit(product)}
                  disabled={isCreating || isEditing}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => onDelete(product.id, product.name)}
                  disabled={isCreating || isEditing}
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
};
