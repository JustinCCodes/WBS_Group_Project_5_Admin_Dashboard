// Core user types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "banned";
  bannedReason?: string;
  bannedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

// Component props interfaces
export interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterRole: string;
  onRoleChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  sortBy: "name" | "email" | "date";
  onSortByChange: (value: "name" | "email" | "date") => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
}

// Component props interfaces
export interface UsersTableProps {
  users: User[];
  searchTerm: string;
  filterRole: string;
  filterStatus: string;
  onRoleChange: (userId: string, newRole: "user" | "admin") => void;
  onBanUser: (user: User) => void;
  onUnbanUser: (userId: string, userName: string) => void;
  onDeleteUser: (userId: string, userName: string) => void;
}

// Component props interfaces
export interface BanUserModalProps {
  isOpen: boolean;
  user: User | null;
  reason: string;
  until: string;
  isBanning: boolean;
  onReasonChange: (reason: string) => void;
  onUntilChange: (until: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}
