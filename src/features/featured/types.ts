import type { Product } from "../products/types";

// Component props interfaces
export interface FeaturedHeaderProps {
  featuredCount: number;
}

// Featured product card component props
export interface FeaturedProductCardProps {
  product: Product;
  onToggleFeatured: (product: Product) => void;
  isUpdating: boolean;
}

// Featured products grid component props
export interface FeaturedProductsGridProps {
  products: Product[];
  loading: boolean;
  updatingId: string | null;
  onToggleFeatured: (product: Product) => void;
}

// Featured pagination component props
export interface FeaturedPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
