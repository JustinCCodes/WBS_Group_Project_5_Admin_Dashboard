import SearchBar from "@/src/shared/ui/SearchBar";
import { CustomSelect } from "@/src/shared/ui/CustomSelect";
import Button from "@/src/shared/ui/Button";
import type { UserFiltersProps } from "../types";

// Component to render user filtering options
export const UserFilters = ({
  searchTerm,
  onSearchChange,
  filterRole,
  onRoleChange,
  filterStatus,
  onStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: UserFiltersProps) => {
  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      <div className="flex-1 min-w-[200px] flex gap-2">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search by name, email, or ID..."
          className="flex-1"
        />
        {searchTerm && (
          <Button
            variant="secondary"
            size="md"
            onClick={() => onSearchChange("")}
          >
            Clear
          </Button>
        )}
      </div>
      <CustomSelect
        value={filterRole}
        onChange={onRoleChange}
        options={[
          { value: "", label: "All Roles" },
          { value: "user", label: "User" },
          { value: "admin", label: "Admin" },
        ]}
        className="min-w-[120px]"
      />
      <CustomSelect
        value={filterStatus}
        onChange={onStatusChange}
        options={[
          { value: "", label: "All Status" },
          { value: "active", label: "Active" },
          { value: "banned", label: "Banned" },
        ]}
        className="min-w-[120px]"
      />
      <CustomSelect
        value={sortBy}
        onChange={(value) => onSortByChange(value as "name" | "email" | "date")}
        options={[
          { value: "date", label: "Sort by Date" },
          { value: "name", label: "Sort by Name" },
          { value: "email", label: "Sort by Email" },
        ]}
      />
      <CustomSelect
        value={sortOrder}
        onChange={(value) => onSortOrderChange(value as "asc" | "desc")}
        options={[
          { value: "desc", label: "Descending" },
          { value: "asc", label: "Ascending" },
        ]}
      />
    </div>
  );
};
