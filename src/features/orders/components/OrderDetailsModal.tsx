import Button from "@/src/shared/ui/Button";
import Table from "@/src/shared/ui/Table";
import StatusBadge from "@/src/shared/ui/StatusBadge";
import type { Order, OrderDetailsModalProps } from "../types";

// Component to display order details in a modal
export const OrderDetailsModal = ({
  isOpen,
  order,
  onClose,
}: OrderDetailsModalProps) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 max-w-3xl mx-4 w-full max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-xl mb-6 text-amber-400">Order Details</h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">Order ID</p>
            <p className="font-mono text-gray-900 dark:text-white">
              {order.id}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Status</p>
            <StatusBadge status={order.status} className="inline-block" />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Customer</p>
            {typeof order.userId === "object" ? (
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {order.userId.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.userId.email}
                </p>
              </div>
            ) : (
              <p className="text-gray-900 dark:text-white">Unknown</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Order Date</p>
            <p className="text-gray-900 dark:text-white">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-zinc-800 my-6">
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-4">
            Products
          </h4>
        </div>

        <Table
          columns={[
            { key: "product", label: "Product" },
            { key: "price", label: "Price" },
            { key: "quantity", label: "Quantity" },
            { key: "subtotal", label: "Subtotal" },
          ]}
          data={order.products}
          emptyMessage="No products in this order"
          className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
          renderRow={(item) => (
            <>
              <td className="px-4 py-3 text-gray-900 dark:text-white">
                {typeof item.productId === "object" && item.productId.name
                  ? item.productId.name
                  : "Unknown Product"}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                $
                {typeof item.productId === "object" && item.productId.price
                  ? item.productId.price.toFixed(2)
                  : "0.00"}
              </td>
              <td className="px-4 py-3 text-gray-900 dark:text-white">
                {item.quantity}
              </td>
              <td className="px-4 py-3 font-semibold text-amber-400">
                $
                {typeof item.productId === "object" && item.productId.price
                  ? (item.productId.price * item.quantity).toFixed(2)
                  : "0.00"}
              </td>
            </>
          )}
        />

        <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-b-lg border-t-2 border-t-amber-500/30 px-4 py-3 flex justify-between items-center -mt-px">
          <span className="text-gray-900 dark:text-white font-semibold">
            Total
          </span>
          <span className="text-lg text-amber-400 font-semibold">
            ${order.total.toFixed(2)}
          </span>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="secondary" size="lg" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
