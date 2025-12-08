import SearchBar from "@/src/shared/ui/SearchBar";
import { CustomSelect } from "@/src/shared/ui/CustomSelect";
import Button from "@/src/shared/ui/Button";
import type { OrderFiltersProps } from "../types";

// Component to render order filtering options
export const OrderFilters = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusChange,
  sortOrder,
  onSortOrderChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onRefresh,
  isLoading,
}: OrderFiltersProps) => {
  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search by order ID, customer..."
          className="w-full"
        />
      </div>
      <CustomSelect
        value={filterStatus}
        onChange={onStatusChange}
        options={[
          { value: "", label: "All Statuses" },
          { value: "pending", label: "Pending" },
          { value: "processing", label: "Processing" },
          { value: "shipped", label: "Shipped" },
          { value: "cancelled", label: "Cancelled" },
        ]}
        className="min-w-[150px]"
      />
      <CustomSelect
        value={sortOrder}
        onChange={(value) => onSortOrderChange(value as "asc" | "desc")}
        options={[
          { value: "desc", label: "Newest First" },
          { value: "asc", label: "Oldest First" },
        ]}
      />
      <div>
        <input
          type="date"
          className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          placeholder="From date"
          autoComplete="off"
        />
      </div>
      <div>
        <input
          type="date"
          className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          placeholder="To date"
          autoComplete="off"
        />
      </div>
      <div>
        <Button
          onClick={onRefresh}
          disabled={isLoading}
          variant="primary"
          size="md"
          title="Refresh orders"
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
    </div>
  );
};
