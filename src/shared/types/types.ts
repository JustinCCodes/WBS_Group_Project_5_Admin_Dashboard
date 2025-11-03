// Shared utility types used across multiple features

// Product summary for reports
export interface ProductSummary {
  id: string;
  name: string;
  price: number;
}

// Product line item for test orders
export interface ProductLineItem {
  productId: string;
  quantity: number;
}

// Product line for test order form state
export interface ProductLine {
  productId: string;
  quantity: number;
}
