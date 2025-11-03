import Button from "@/src/shared/ui/Button";
import type { FeaturedPaginationProps } from "../types";

// Component for pagination in featured items section
export function FeaturedPagination({
  currentPage,
  totalPages,
  onPageChange,
}: FeaturedPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center items-center space-x-4">
      <Button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        variant="secondary"
        size="md"
      >
        Previous
      </Button>
      <span className="text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        variant="secondary"
        size="md"
      >
        Next
      </Button>
    </div>
  );
}
