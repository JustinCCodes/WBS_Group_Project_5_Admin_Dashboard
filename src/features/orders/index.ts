// Export the main container component
export { default as OrdersManagementContainer } from "./components/OrdersManagement";

// Export child components
export { OrderFilters } from "./components/OrderFilters";
export { OrdersTable } from "./components/OrdersTable";
export { OrderDetailsModal } from "./components/OrderDetailsModal";

// Export types
export type * from "./types";

// Export data functions
export { getAllOrders, updateOrderStatus, deleteOrder } from "./data";
