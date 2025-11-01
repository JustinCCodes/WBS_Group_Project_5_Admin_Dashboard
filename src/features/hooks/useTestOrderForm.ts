import { useReducer, useState } from "react";
import { getErrorMessage } from "@/src/shared/lib/utils";
import type {
  TestOrderFormState,
  TestOrderFormAction,
} from "@/src/features/types";

// Initial state for the test order form
const initialState: TestOrderFormState = {
  userId: "",
  status: "pending",
  products: [{ productId: "", quantity: 1 }],
};

// Reducer function to manage form state updates
function testOrderFormReducer(
  state: TestOrderFormState,
  action: TestOrderFormAction
): TestOrderFormState {
  switch (action.type) {
    // Update user ID
    case "SET_USER_ID":
      return { ...state, userId: action.payload };
    // Update order status
    case "SET_STATUS":
      return { ...state, status: action.payload };
    // Add a new product line
    case "ADD_PRODUCT_LINE":
      return {
        ...state,
        products: [...state.products, { productId: "", quantity: 1 }],
      };
    // Remove a product line by index
    case "REMOVE_PRODUCT_LINE":
      return {
        ...state,
        products: state.products.filter((_prod, i) => i !== action.payload),
      };
    // Update a specific product line
    case "UPDATE_PRODUCT_LINE":
      const updated = [...state.products];
      updated[action.payload.index] = {
        ...updated[action.payload.index],
        [action.payload.field]: action.payload.value,
      };
      return { ...state, products: updated };
    // Reset form to initial state
    case "RESET":
      return initialState;
    // Default case returns current state
    default:
      return state;
  }
}

// Hook for managing test order form state and submission
export function useTestOrderForm(
  onSubmit: (data: TestOrderFormState) => Promise<void>
) {
  const [state, dispatch] = useReducer(testOrderFormReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handles form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    // Submits form data
    try {
      await onSubmit(state);
      dispatch({ type: "RESET" });
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to create test order");
    } finally {
      setLoading(false);
    }
  };

  return {
    formState: state,
    dispatch,
    loading,
    error,
    handleSubmit,
    reset: () => dispatch({ type: "RESET" }),
  };
}
