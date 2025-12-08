import Button from "@/src/shared/ui/Button";
import ErrorAlert from "@/src/shared/ui/ErrorAlert";
import type { AdminFormState, CategoryFormProps } from "../types";

// Component for category creation/editing form
export function CategoryForm({
  formState,
  isCreating,
  onCancel,
}: CategoryFormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 shadow-xl mb-6">
      <h2 className="text-xl font-bold mb-6 text-amber-400">
        {isCreating ? "Create New Category" : "Edit Category"}
      </h2>
      <form onSubmit={formState.handleSubmit}>
        {formState.error && <ErrorAlert message={formState.error} />}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            value={formState.formData.name}
            onChange={(e) => formState.setFormData({ name: e.target.value })}
            required
            minLength={1}
            disabled={formState.loading}
            autoComplete="off"
          />
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={onCancel}
            disabled={formState.loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={formState.loading}
            loading={formState.loading}
          >
            {formState.loading ? "Saving..." : isCreating ? "Create" : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
}
