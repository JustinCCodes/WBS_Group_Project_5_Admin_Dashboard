import Table from "@/src/shared/ui/Table";
import Button from "@/src/shared/ui/Button";
import { CustomSelect } from "@/src/shared/ui/CustomSelect";
import StatusBadge from "@/src/shared/ui/StatusBadge";
import type { Order, OrdersTableProps } from "../types";

// Component to display a table of orders with actions
export const OrdersTable = ({
  orders,
  searchTerm,
  filterStatus,
  dateFrom,
  dateTo,
  onStatusChange,
  onViewDetails,
  onDeleteOrder,
}: OrdersTableProps) => {
  return (
    <>
      <Table
        columns={[
          { key: "orderId", label: "Order ID" },
          { key: "customer", label: "Customer" },
          { key: "total", label: "Total" },
          { key: "status", label: "Status" },
          { key: "date", label: "Date" },
          { key: "actions", label: "Actions" },
        ]}
        data={orders}
        emptyMessage={
          searchTerm || filterStatus || dateFrom || dateTo
            ? "No orders found matching your filters"
            : "No orders yet"
        }
        renderRow={(order: Order) => (
          <>
            <td className="px-4 py-3 font-mono text-sm text-gray-600 dark:text-gray-400">
              {order.id.slice(-8)}
            </td>
            <td className="px-4 py-3">
              {typeof order.userId === "object" ? (
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {order.userId.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {order.userId.email}
                  </div>
                </div>
              ) : (
                "Unknown"
              )}
            </td>
            <td className="px-4 py-3 font-semibold text-amber-400">
              ${order.total.toFixed(2)}
            </td>
            <td className="px-4 py-3">
              <CustomSelect
                value={order.status}
                onChange={(value) => onStatusChange(order.id, value)}
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "processing", label: "Processing" },
                  { value: "shipped", label: "Shipped" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
                size="sm"
                className={`
                  ${
                    order.status === "pending"
                      ? "[&>button]:bg-yellow-100 dark:[&>button]:bg-yellow-900/20 [&>button]:border-yellow-400 dark:[&>button]:border-yellow-800 [&>button]:text-yellow-700 dark:[&>button]:text-yellow-400"
                      : ""
                  }
                  ${
                    order.status === "processing"
                      ? "[&>button]:bg-blue-100 dark:[&>button]:bg-blue-900/20 [&>button]:border-blue-400 dark:[&>button]:border-blue-800 [&>button]:text-blue-700 dark:[&>button]:text-blue-400"
                      : ""
                  }
                  ${
                    order.status === "shipped"
                      ? "[&>button]:bg-green-100 dark:[&>button]:bg-green-900/20 [&>button]:border-green-400 dark:[&>button]:border-green-800 [&>button]:text-green-700 dark:[&>button]:text-green-400"
                      : ""
                  }
                  ${
                    order.status === "cancelled"
                      ? "[&>button]:bg-red-100 dark:[&>button]:bg-red-900/20 [&>button]:border-red-400 dark:[&>button]:border-red-800 [&>button]:text-red-700 dark:[&>button]:text-red-400"
                      : ""
                  }
                `}
              />
            </td>
            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
              {new Date(order.createdAt).toLocaleDateString()}
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onViewDetails(order)}
                >
                  View
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    onDeleteOrder(order.id, `Order #${order.id.slice(-8)}`)
                  }
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
