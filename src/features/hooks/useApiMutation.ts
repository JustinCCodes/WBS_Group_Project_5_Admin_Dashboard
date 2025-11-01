import { useState } from "react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/src/shared/lib/utils";

interface UseApiMutationOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void | Promise<void>;
  onError?: (error: unknown) => void;
}

interface UseApiMutationReturn<TArgs extends any[], TResult> {
  mutate: (...args: TArgs) => Promise<TResult | undefined>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

// Hook for handling API mutations (create, update, delete operations)
export function useApiMutation<TArgs extends any[], TResult>(
  mutationFn: (...args: TArgs) => Promise<TResult>,
  options: UseApiMutationOptions = {}
): UseApiMutationReturn<TArgs, TResult> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mutation function
  const mutate = async (...args: TArgs): Promise<TResult | undefined> => {
    setIsLoading(true);
    setError(null);

    // Performs mutation
    try {
      const result = await mutationFn(...args);

      // Shows success toast
      if (options.successMessage) {
        toast.success(options.successMessage);
      }

      // Calls onSuccess callback if provided
      if (options.onSuccess) {
        await options.onSuccess();
      }

      setIsLoading(false);
      return result;
    } catch (err) {
      const errorMsg =
        getErrorMessage(err) || options.errorMessage || "Operation failed";
      setError(errorMsg);
      toast.error(errorMsg);

      // Calls onError callback if provided
      if (options.onError) {
        options.onError(err);
      }

      setIsLoading(false);
      return undefined;
    }
  };

  // Resets error and loading state
  const reset = () => {
    setError(null);
    setIsLoading(false);
  };

  return { mutate, isLoading, error, reset };
}
