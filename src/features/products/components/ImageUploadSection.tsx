import type { ImageUploadSectionProps } from "../types";

// Component for uploading and previewing product images
export const ImageUploadSection = ({
  imagePreview,
  selectedImage,
  currentImageUrl,
  onImageSelect,
  onRemoveImage,
}: ImageUploadSectionProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Product Image
      </label>
      <div className="mt-1 flex items-center gap-4">
        {(imagePreview || currentImageUrl) && (
          <div className="relative w-32 h-32 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <img
              src={imagePreview || currentImageUrl}
              alt="Product preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={onRemoveImage}
              type="button"
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <input
            type="file"
            accept="image/*"
            onChange={onImageSelect}
            className="sr-only"
          />
          {selectedImage || currentImageUrl ? "Change Image" : "Select Image"}
        </label>
      </div>
    </div>
  );
};
