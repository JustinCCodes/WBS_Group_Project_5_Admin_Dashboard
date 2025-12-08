// Core order types
export interface Order {
  id: string;
  orderNumber: string;
  userId: {
    id: string;
    name: string;
    email: string;
  };
  products: {
    productId: {
      id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  total: number;
  status: "pending" | "processing" | "shipped" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

// Component props interfaces
export interface OrderFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

// Component props interfaces
export interface OrdersTableProps {
  orders: Order[];
  searchTerm: string;
  filterStatus: string;
  dateFrom: string;
  dateTo: string;
  onStatusChange: (orderId: string, newStatus: string) => void;
  onViewDetails: (order: Order) => void;
  onDeleteOrder: (orderId: string, orderDisplay: string) => void;
  onHardDeleteOrder: () => void;
}

// Component props interfaces
export interface OrderDetailsModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}
