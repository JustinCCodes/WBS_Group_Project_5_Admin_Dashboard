import SearchBar from "@/src/shared/ui/SearchBar";
import { CustomSelect } from "@/src/shared/ui/CustomSelect";
import type { CategoryFiltersProps } from "../types";

// Component for category filters: search, sort by, sort order
export function CategoryFilters({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: CategoryFiltersProps) {
  return (
    <div className="flex gap-4 mb-4 flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search categories..."
          className="w-full"
        />
      </div>
      <CustomSelect
        value={sortBy}
        onChange={(value: string) => onSortByChange(value as "name" | "date")}
        options={[
          { value: "name", label: "Sort by Name" },
          { value: "date", label: "Sort by Date" },
        ]}
      />
      <CustomSelect
        value={sortOrder}
        onChange={(value: string) => onSortOrderChange(value as "asc" | "desc")}
        options={[
          { value: "asc", label: "Ascending" },
          { value: "desc", label: "Descending" },
        ]}
      />
    </div>
  );
}
