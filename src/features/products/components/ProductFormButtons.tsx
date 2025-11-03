import Button from "@/src/shared/ui/Button";
import type { ProductFormButtonsProps } from "../types";

// Component for rendering buttons in the product form
export const ProductFormButtons = ({
  isEditMode,
  isCreatingProduct,
  onCancel,
  onClose,
}: ProductFormButtonsProps) => {
  return (
    <div className="flex justify-between pt-4">
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          disabled={isCreatingProduct}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onClose}
          variant="secondary"
          disabled={isCreatingProduct}
        >
          Close
        </Button>
      </div>
      <Button type="submit" disabled={isCreatingProduct}>
        {isCreatingProduct
          ? "Saving..."
          : isEditMode
          ? "Update Product"
          : "Create Product"}
      </Button>
    </div>
  );
};
