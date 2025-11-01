import { useState } from "react";
import { getErrorMessage } from "@/src/shared/lib/utils";
import type { UseAdminFormOptions } from "@/src/features/types";

export function useAdminForm<T>({
  initialData,
  onSubmit,
  onSuccess,
}: UseAdminFormOptions<T>) {
  const [formData, setFormData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handles form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    // Submits form data
    try {
      await onSubmit(formData);
      setFormData(initialData);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(getErrorMessage(err) || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // Resets form to initial data
  const reset = () => {
    setFormData(initialData);
    setError(null);
  };

  // Updates a specific field in the form data
  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    setFormData,
    updateField,
    loading,
    error,
    handleSubmit,
    reset,
  };
}
