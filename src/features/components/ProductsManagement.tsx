"use client";

import { useState, useMemo } from "react";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  uploadImageToCloudinary,
} from "@/src/features/data";
import type { Category, Product, ProductInput } from "@/src/features/types";
import {
  useAdminForm,
  useProducts,
  useCategories,
  useApiMutation,
} from "@/src/features/hooks";
import {
  confirmAndDelete,
  mutateAndRefetch,
  textIncludes,
  sortByDate,
  sortByString,
  getErrorMessage,
} from "@/src/shared/lib/utils";
import toast from "react-hot-toast";
import { CustomSelect } from "@/src/shared/ui/CustomSelect";
import Button from "@/src/shared/ui/Button";
import SearchBar from "@/src/shared/ui/SearchBar";
import Table from "@/src/shared/ui/Table";
import ErrorAlert from "@/src/shared/ui/ErrorAlert";
import LoadingState from "@/src/shared/ui/LoadingState";
import BackButton from "@/src/shared/ui/BackButton";
import {
  AlertTriangle,
  Check,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

// Stock Editor Component
function StockEditor({
  productId,
  currentStock,
  onStockUpdated,
}: {
  productId: string;
  currentStock: number;
  onStockUpdated: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [stock, setStock] = useState(currentStock);
  const [loading, setLoading] = useState(false);

  // Handles saving updated stock
  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProductStock(productId, stock);
      setIsEditing(false);
      onStockUpdated();
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  // Handles cancelling edit
  const handleCancel = () => {
    setStock(currentStock);
    setIsEditing(false);
  };

  // Renders stock editor UI
  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value) || 0)}
          className="w-20 px-2 py-1 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={loading}
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="p-1 bg-green-900/20 border border-green-800 text-green-400 rounded hover:bg-green-900/40 transition-all disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          disabled={loading}
          className="p-1 bg-red-900/20 border border-red-800 text-red-400 rounded hover:bg-red-900/40 transition-all disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Renders stock display button
  return (
    <button
      onClick={() => setIsEditing(true)}
      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all hover:scale-105 ${
        currentStock === 0
          ? "bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400"
          : currentStock <= 5
          ? "bg-orange-100 dark:bg-orange-900/20 border border-orange-400 dark:border-orange-800 text-orange-700 dark:text-orange-400"
          : currentStock <= 10
          ? "bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400"
          : "bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400"
      }`}
    >
      {currentStock === 0 ? (
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          OUT
        </span>
      ) : (
        `${currentStock} in stock`
      )}
    </button>
  );
}

// Main products management component
export default function ProductsManagement() {
  const {
    products,
    isLoading: loading,
    error,
    refetch: refetchProducts,
  } = useProducts();
  const { categories, refetch: refetchCategories } = useCategories();

  // API mutations
  const { mutate: mutateDelete } = useApiMutation(deleteProduct, {
    successMessage: "Product deleted successfully",
  });

  // Creates mutation
  const { mutate: mutateCreate } = useApiMutation(createProduct, {
    successMessage: "Product created successfully",
  });

  // Updates mutation
  const { mutate: mutateUpdate } = useApiMutation(updateProduct);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Image upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "date">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Creates form
  const createForm = useAdminForm<ProductInput>({
    initialData: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: "",
      imageUrl: "",
      imagePublicId: "",
    },
    // Handles form submission for creating product
    onSubmit: async (data: ProductInput) => {
      try {
        // Upload image if selected
        if (selectedImage) {
          setIsUploadingImage(true);
          const uploadResult = await uploadImageToCloudinary(selectedImage);
          data.imageUrl = uploadResult.imageUrl;
          data.imagePublicId = uploadResult.imagePublicId;
          setIsUploadingImage(false);
        }

        // Validates image URL
        if (!data.imageUrl) {
          toast.error(
            "Product image is required. Please upload an image or provide an image URL."
          );
          return;
        }

        // Prepares product data
        const result = await mutateCreate(data);
        if (result) {
          setIsCreating(false);
          setSelectedImage(null);
          setImagePreview("");
          await refetchProducts();
        }
        // Catches errors during creation
      } catch (error: unknown) {
        setIsUploadingImage(false);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create product";
        toast.error(`Failed to create product: ${errorMessage}`);
      }
    },
  });

  // Updates form
  const updateForm = useAdminForm<ProductInput>({
    initialData: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: "",
      imageUrl: "",
      imagePublicId: "",
    },
    // Handles form submission for updating product
    onSubmit: async (data: ProductInput) => {
      if (!editingProduct) return;
      try {
        // Uploads new image if selected
        if (selectedImage) {
          setIsUploadingImage(true);
          const uploadResult = await uploadImageToCloudinary(selectedImage);
          data.imageUrl = uploadResult.imageUrl;
          data.imagePublicId = uploadResult.imagePublicId;
          setIsUploadingImage(false);
        }
        // Prepares product data
        const productData = {
          ...data,
          stock: Number(data.stock) || 0,
          price: Number(data.price) || 0,
        };

        // Updates product
        const result = await mutateUpdate(editingProduct.id, productData);
        if (result) {
          setIsEditing(false);
          setEditingProduct(null);
          setSelectedImage(null);
          setImagePreview("");
          await refetchProducts();
        }
        // Catches errors during update
      } catch (error) {
        setIsUploadingImage(false);
        toast.error(
          `Failed to update product: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
  });

  // Determines active form
  const activeForm = isCreating ? createForm : updateForm;

  // Fetches data
  const fetchData = async () => {
    await Promise.all([refetchProducts(), refetchCategories()]);
  };

  // Handles deleting product
  const handleDeleteProduct = async (id: string, name: string) => {
    await confirmAndDelete(
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      () => mutateDelete(id),
      refetchProducts
    );
  };

  // Starts editing product
  const startEdit = (product: Product) => {
    setEditingProduct(product);
    updateForm.setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock || 0,
      categoryId:
        typeof product.categoryId === "object"
          ? product.categoryId.id
          : product.categoryId,
      imageUrl: product.imageUrl || "",
      imagePublicId: product.imagePublicId || "",
    });
    // Sets image preview
    setImagePreview(product.imageUrl || "");
    setSelectedImage(null);
    setIsEditing(true);
    setIsCreating(false);
  };

  // Resets form state
  const resetForm = () => {
    setIsCreating(false);
    setIsEditing(false);
    setEditingProduct(null);
    setSelectedImage(null);
    setImagePreview("");
    createForm.reset();
    updateForm.reset();
  };

  // Image upload handlers
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Validates selected file
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size must be less than 5MB");
        return;
      }
      // Validates file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      // Sets selected image and preview
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handles removing selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    activeForm.setFormData({
      ...activeForm.formData,
      imageUrl: "",
      imagePublicId: "",
    });
  };

  // Filters and sorts products
  const filteredProducts = useMemo(() => {
    return (
      products
        .filter((product: Product) => {
          // Checks search term match
          const matchesSearch =
            textIncludes(product.name, searchTerm) ||
            textIncludes(product.description, searchTerm);

          // Checks category match
          const categoryId =
            typeof product.categoryId === "object"
              ? product.categoryId.id
              : product.categoryId;
          // Checks if category filter is applied
          const matchesCategory =
            !filterCategory || categoryId === filterCategory;

          return matchesSearch && matchesCategory;
        })
        // Sorts products
        .sort((a: Product, b: Product) => {
          if (sortBy === "name") {
            return sortByString(a, b, "name", sortOrder);
          } else if (sortBy === "price") {
            return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
          } else {
            return sortByDate(a, b, "createdAt", sortOrder);
          }
        })
    );
  }, [products, searchTerm, filterCategory, sortBy, sortOrder]);

  // Renders loading state
  if (loading && products.length === 0) {
    return <LoadingState message="Loading products..." />;
  }

  return (
    <div className="min-h-screen  text-white">
      <div className="container mx-auto p-6">
        <div className="flex flex-col mb-6">
          <BackButton />
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-3xl font-bold">
              <span className="bg-linear-to-r from-amber-600 to-yellow-600 dark:from-amber-200 dark:to-yellow-600 bg-clip-text text-transparent">
                Manage Products
              </span>
            </h1>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => fetchData()}
                disabled={loading}
                variant="primary"
                size="lg"
                title="Refresh products"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setIsCreating(true);
                  setIsEditing(false);
                  setEditingProduct(null);
                  createForm.reset();
                }}
                disabled={isCreating || isEditing}
              >
                + Create Product
              </Button>
            </div>
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        {/* Create/Edit Form */}
        {(isCreating || isEditing) && (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 shadow-xl mb-6">
            <h2 className="text-xl font-bold mb-6 text-amber-400">
              {isCreating ? "Create New Product" : "Edit Product"}
            </h2>
            <form onSubmit={activeForm.handleSubmit}>
              {activeForm.error && <ErrorAlert message={activeForm.error} />}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    value={activeForm.formData.name}
                    onChange={(e) =>
                      activeForm.setFormData({
                        ...activeForm.formData,
                        name: e.target.value,
                      })
                    }
                    required
                    disabled={activeForm.loading}
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
                    value={activeForm.formData.price}
                    onChange={(e) =>
                      activeForm.setFormData({
                        ...activeForm.formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                    required
                    disabled={activeForm.loading}
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
                    value={activeForm.formData.stock}
                    onChange={(e) =>
                      activeForm.setFormData({
                        ...activeForm.formData,
                        stock:
                          e.target.value === ""
                            ? 0
                            : parseInt(e.target.value, 10),
                      })
                    }
                    required
                    disabled={activeForm.loading}
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
                    value={activeForm.formData.description}
                    onChange={(e) =>
                      activeForm.setFormData({
                        ...activeForm.formData,
                        description: e.target.value,
                      })
                    }
                    required
                    disabled={activeForm.loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <CustomSelect
                    value={activeForm.formData.categoryId}
                    onChange={(value) =>
                      activeForm.setFormData({
                        ...activeForm.formData,
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
                    disabled={activeForm.loading}
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
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-2 bg-red-900/80 hover:bg-red-900 border border-red-800 text-red-400 rounded-lg transition-all"
                        disabled={activeForm.loading || isUploadingImage}
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
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, WEBP (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageSelect}
                        disabled={activeForm.loading || isUploadingImage}
                      />
                    </label>
                  )}

                  {/* Alternative: Manual URL Input */}
                  {!selectedImage && !imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">
                        Or enter image URL manually
                      </p>
                      <input
                        type="url"
                        className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        value={activeForm.formData.imageUrl}
                        onChange={(e) => {
                          const url = e.target.value;
                          activeForm.setFormData({
                            ...activeForm.formData,
                            imageUrl: url,
                            imagePublicId: url ? "manual-upload" : "", // Set a placeholder publicId for manual URLs
                          });
                          if (url) {
                            setImagePreview(url);
                          }
                        }}
                        placeholder="https://example.com/image.jpg"
                        disabled={activeForm.loading || isUploadingImage}
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

              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={resetForm}
                  disabled={activeForm.loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={activeForm.loading}
                  loading={activeForm.loading}
                >
                  {activeForm.loading
                    ? "Saving..."
                    : isCreating
                    ? "Create"
                    : "Update"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search products..."
              className="w-full"
            />
          </div>
          <CustomSelect
            value={filterCategory}
            onChange={(value) => setFilterCategory(value)}
            options={[
              { value: "", label: "All Categories" },
              ...categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              })),
            ]}
            className="min-w-[150px]"
          />
          <CustomSelect
            value={sortBy}
            onChange={(value) => setSortBy(value as "name" | "price" | "date")}
            options={[
              { value: "name", label: "Sort by Name" },
              { value: "price", label: "Sort by Price" },
              { value: "date", label: "Sort by Date" },
            ]}
          />
          <CustomSelect
            value={sortOrder}
            onChange={(value) => setSortOrder(value as "asc" | "desc")}
            options={[
              { value: "asc", label: "Ascending" },
              { value: "desc", label: "Descending" },
            ]}
          />
        </div>

        {/* Products Table */}
        <Table
          columns={[
            { key: "name", label: "Name" },
            { key: "description", label: "Description" },
            { key: "price", label: "Price" },
            { key: "stock", label: "Stock" },
            { key: "category", label: "Category" },
            { key: "createdAt", label: "Created At" },
            { key: "createdBy", label: "Created By" },
            { key: "actions", label: "Actions" },
          ]}
          data={filteredProducts}
          emptyMessage={
            searchTerm || filterCategory
              ? "No products found matching your filters"
              : "No products yet"
          }
          renderRow={(product: Product) => (
            <>
              <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white max-w-xs">
                <div className="line-clamp-3">{product.name}</div>
              </td>
              <td className="px-4 py-3 max-w-xs truncate text-gray-600 dark:text-gray-400">
                {product.description}
              </td>
              <td className="px-4 py-3 font-semibold text-amber-400">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <StockEditor
                  productId={product.id}
                  currentStock={product.stock || 0}
                  onStockUpdated={refetchProducts}
                />
              </td>
              <td className="px-4 py-3">
                <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-full text-xs text-gray-700 dark:text-gray-300">
                  {typeof product.categoryId === "object"
                    ? product.categoryId.name
                    : "Unknown"}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {new Date(product.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {product.createdBy
                  ? typeof product.createdBy === "object" &&
                    "name" in product.createdBy
                    ? product.createdBy.name
                    : "Admin"
                  : "N/A"}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    variant="edit"
                    size="md"
                    onClick={() => startEdit(product)}
                    disabled={isCreating || isEditing}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="md"
                    onClick={() =>
                      handleDeleteProduct(product.id, product.name)
                    }
                    disabled={isCreating || isEditing}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </>
          )}
        />

        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>
    </div>
  );
}
