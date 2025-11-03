import SearchBar from "@/src/shared/ui/SearchBar";
import { CustomSelect } from "@/src/shared/ui/CustomSelect";
import type { ProductFiltersProps } from "../types";

// Component to render product filtering options
export const ProductFilters = ({
  searchTerm,
  onSearchChange,
  filterCategory,
  onCategoryChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  categories,
}: ProductFiltersProps) => {
  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search products..."
          className="w-full"
        />
      </div>
      <CustomSelect
        value={filterCategory}
        onChange={onCategoryChange}
        options={[
          { value: "", label: "All Categories" },
          ...categories.map((cat) => ({
            value: cat.id,
            label: cat.name,
          })),
        ]}
        className="min-w-[150px]"
      />
      <CustomSelect
        value={sortBy}
        onChange={(value) => onSortByChange(value as "name" | "price" | "date")}
        options={[
          { value: "name", label: "Sort by Name" },
          { value: "price", label: "Sort by Price" },
          { value: "date", label: "Sort by Date" },
        ]}
      />
      <CustomSelect
        value={sortOrder}
        onChange={(value) => onSortOrderChange(value as "asc" | "desc")}
        options={[
          { value: "asc", label: "Ascending" },
          { value: "desc", label: "Descending" },
        ]}
      />
    </div>
  );
};
