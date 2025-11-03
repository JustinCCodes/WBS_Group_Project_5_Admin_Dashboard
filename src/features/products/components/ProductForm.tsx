import { CustomSelect } from "@/src/shared/ui/CustomSelect";
import ErrorAlert from "@/src/shared/ui/ErrorAlert";
import { X, Upload } from "lucide-react";
import type { ProductFormProps } from "../types";

// Component for rendering the product form
export const ProductForm = ({
  formData,
  onFormDataChange,
  categories,
  imagePreview,
  onImageSelect,
  onRemoveImage,
  isLoading,
  isUploadingImage,
  error,
}: ProductFormProps) => {
  return (
    <>
      {error && <ErrorAlert message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            value={formData.name}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                name: e.target.value,
              })
            }
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            value={formData.price}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                price: parseFloat(e.target.value),
              })
            }
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Stock Quantity *
          </label>
          <input
            type="number"
            min="0"
            step="1"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            value={formData.stock}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                stock: e.target.value === "" ? 0 : parseInt(e.target.value, 10),
              })
            }
            required
            disabled={isLoading}
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Available inventory count
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all h-24"
            value={formData.description}
            onChange={(e) =>
              onFormDataChange({
                ...formData,
                description: e.target.value,
              })
            }
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category *
          </label>
          <CustomSelect
            value={formData.categoryId}
            onChange={(value) =>
              onFormDataChange({
                ...formData,
                categoryId: value,
              })
            }
            options={[
              { value: "", label: "Select a category" },
              ...categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              })),
            ]}
            disabled={isLoading}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Product Image
          </label>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-4 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-zinc-700"
              />
              <button
                type="button"
                onClick={onRemoveImage}
                className="absolute top-2 right-2 p-2 bg-red-900/80 hover:bg-red-900 border border-red-800 text-red-400 rounded-lg transition-all"
                disabled={isLoading || isUploadingImage}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Upload Button */}
          {!imagePreview && (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-zinc-700 border-dashed rounded-lg cursor-pointer bg-zinc-800 hover:bg-zinc-750 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-500" />
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WEBP (MAX. 5MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onImageSelect}
                disabled={isLoading || isUploadingImage}
              />
            </label>
          )}

          {/* Alternative: Manual URL Input */}
          {!imagePreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">
                Or enter image URL manually
              </p>
              <input
                type="url"
                className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                value={formData.imageUrl}
                onChange={(e) => {
                  const url = e.target.value;
                  onFormDataChange({
                    ...formData,
                    imageUrl: url,
                    imagePublicId: url ? "manual-upload" : "",
                  });
                }}
                placeholder="https://example.com/image.jpg"
                disabled={isLoading || isUploadingImage}
              />
            </div>
          )}

          {isUploadingImage && (
            <p className="text-sm text-amber-400 mt-2 flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Uploading image to Cloudinary...
            </p>
          )}
        </div>
      </div>
    </>
  );
};
