"use client";

import { useState, useEffect, useRef } from "react";
import { createProduct, updateProduct, deleteProduct } from "../data";
import type { Product, ProductInput } from "../types";
import {
  useAdminForm,
  useApiMutation,
  useDeleteConfirmation,
} from "@/src/shared/hooks";
import { useCategories } from "@/src/features/categories/hooks";
import toast from "react-hot-toast";
import Button from "@/src/shared/ui/Button";
import ErrorAlert from "@/src/shared/ui/ErrorAlert";
import LoadingState from "@/src/shared/ui/LoadingState";
import BackButton from "@/src/shared/ui/BackButton";
import ConfirmDialog from "@/src/shared/ui/ConfirmDialog";
import {
  ProductForm,
  ProductFilters,
  ProductsTable,
  UnsavedProductsPanel,
} from "@/src/features/products";
import {
  useProducts,
  useProductFormSubmission,
  useProductFilters,
  useFormMode,
  useUnsavedProducts,
} from "@/src/features/products/hooks";
import { MAX_UNSAVED_PRODUCTS } from "@/src/features/products/utils/unsavedProductsStorage";
import {
  loadSavedFormData,
  saveFormData,
  clearFormData,
  EDIT_FORM_STORAGE_KEY,
} from "@/src/features/products/utils/editFormStorage";
import type { UnsavedProduct } from "../types";

// Main container component for managing products
export default function ProductsManagementContainer() {
  // Data fetching
  const {
    products,
    isLoading: loading,
    error,
    refetch: refetchProducts,
  } = useProducts();
  const { categories, refetch: refetchCategories } = useCategories();

  // Form mode management
  const {
    isCreating,
    isEditing,
    editingProduct,
    startCreating,
    startEditing,
    closeForm,
    resetForm,
  } = useFormMode();

  // Filtering
  const {
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredProducts,
  } = useProductFilters(products);

  // Unsaved products
  const {
    unsavedProducts,
    activeProductId,
    setActiveProductId,
    createProduct: createUnsavedProduct,
    updateProduct: updateUnsavedProductData,
    deleteProduct: deleteUnsavedProductData,
    setActive,
    refreshUnsavedProducts,
  } = useUnsavedProducts();

  // Image upload and form submission
  const {
    selectedImage,
    imagePreview,
    isUploadingImage,
    setImagePreview,
    handleImageSelect,
    handleRemoveImage,
    prepareFormDataWithImage,
    resetImageState,
  } = useProductFormSubmission();

  // Delete sconfirmation
  const {
    dialogProps,
    openDeleteConfirm,
    handleConfirmDelete,
    handleCancelDelete,
  } = useDeleteConfirmation("Product");

  // Cancels confirmation state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Unsaved product delete confirmation state
  const [unsavedDeleteConfirm, setUnsavedDeleteConfirm] = useState<{
    show: boolean;
    productId: string;
    productName: string;
  }>({ show: false, productId: "", productName: "" });

  // Form state
  const initialFormData: ProductInput = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
    imageUrl: "",
    imagePublicId: "",
  };

  // Local form data state
  const [formData, setFormData] = useState<ProductInput>(initialFormData);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Create product form
  const createForm = useAdminForm<ProductInput>({
    initialData: initialFormData,
    onSubmit: async (data) => {
      setIsCreatingProduct(true);
      try {
        // Use the current formData state, not the form's internal data
        const preparedData = await prepareFormDataWithImage(formData);
        const result = await createProduct(preparedData);

        // Remove from unsaved products after successful creation
        if (activeProductId) {
          deleteUnsavedProductData(activeProductId);
          setActiveProductId(null);
        }

        toast.success("Product created successfully!");
        resetForm();
        setFormData(initialFormData);
        resetImageState();
      } catch (error) {
        throw error;
      } finally {
        setIsCreatingProduct(false);
      }
    },
    onSuccess: () => {
      refetchProducts(true);
      closeForm();
    },
  });

  // Update product form
  const updateForm = useAdminForm<ProductInput>({
    initialData: initialFormData,
    onSubmit: async (data) => {
      if (!editingProduct) return;
      setIsCreatingProduct(true);
      try {
        // Use the current formData state, not the form's internal data
        const preparedData = await prepareFormDataWithImage(formData);
        await updateProduct(editingProduct.id, preparedData);
        toast.success("Product updated successfully!");
        clearFormData(EDIT_FORM_STORAGE_KEY);
        resetForm();
        setFormData(initialFormData);
        resetImageState();
      } catch (error) {
        throw error;
      } finally {
        setIsCreatingProduct(false);
      }
    },
    onSuccess: () => {
      refetchProducts(true);
      closeForm();
    },
  });

  // Delete mutation
  const { mutate: mutateDelete } = useApiMutation(deleteProduct, {
    successMessage: "Product deleted successfully",
    onSuccess: () => refetchProducts(true),
  });

  // Auto save for unsaved products
  useEffect(() => {
    if (isCreating && activeProductId && formData.name.trim()) {
      updateUnsavedProductData(activeProductId, formData);
    }
  }, [formData, isCreating, activeProductId]);

  // Auto save for edit form
  useEffect(() => {
    if (isEditing && editingProduct) {
      saveFormData(EDIT_FORM_STORAGE_KEY, formData);
    }
  }, [formData, isEditing, editingProduct]);

  // Handles starting create mode (opens last draft or creates new one)
  const handleStartCreate = () => {
    // If there are existing unsaved products resume the most recent one
    if (unsavedProducts.length > 0) {
      const mostRecentProduct = unsavedProducts[unsavedProducts.length - 1];
      handleSelectUnsavedProduct(mostRecentProduct);
      toast.success(
        `Resumed draft: ${mostRecentProduct.name || "Untitled Product"}`
      );
      return;
    }

    // No existing drafts create a new one
    handleCreateNewProduct();
  };

  // Handles creating a new product (always creates new used by "Create New Product" button)
  const handleCreateNewProduct = () => {
    // Checks if we reached the maximum number of unsaved products
    if (unsavedProducts.length >= MAX_UNSAVED_PRODUCTS) {
      toast.error(
        `Maximum ${MAX_UNSAVED_PRODUCTS} unsaved products reached. Please save or delete some before creating new ones.`
      );
      return;
    }

    // Creates a new draft
    const newProductId = createUnsavedProduct();
    setActiveProductId(newProductId);
    startCreating();
    setFormData(initialFormData);
    resetImageState();
  };

  // Handles selecting an unsaved product
  const handleSelectUnsavedProduct = (product: UnsavedProduct) => {
    setActiveProductId(product.id);
    setFormData(product.formData);
    if (product.formData.imageUrl) {
      setImagePreview(product.formData.imageUrl);
    }
    startCreating();
  };

  // Handles deleting an unsaved product (open confirmation)
  const handleDeleteUnsavedProduct = (
    productId: string,
    productName: string
  ) => {
    setUnsavedDeleteConfirm({ show: true, productId, productName });
  };

  // Confirms delete unsaved product
  const handleConfirmDeleteUnsaved = () => {
    const { productId } = unsavedDeleteConfirm;
    deleteUnsavedProductData(productId);
    if (activeProductId === productId) {
      closeForm();
      setFormData(initialFormData);
      resetImageState();
      setActiveProductId(null);
    }
    setUnsavedDeleteConfirm({ show: false, productId: "", productName: "" });
    toast.success("Unsaved product deleted");
  };

  // Handles starting edit mode
  const handleStartEdit = (product: Product) => {
    // Loads saved draft if exists
    const savedDraft = loadSavedFormData(EDIT_FORM_STORAGE_KEY);

    const editFormData: ProductInput = savedDraft || {
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
    };

    setFormData(editFormData);
    if (editFormData.imageUrl) {
      setImagePreview(editFormData.imageUrl);
    }
    startEditing(product);
  };

  // Handles canceling form (with confirmation)
  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = () => {
    if (isEditing) {
      clearFormData(EDIT_FORM_STORAGE_KEY);
    }
    closeForm();
    setFormData(initialFormData);
    resetImageState();
    setActiveProductId(null);
    setShowCancelConfirm(false);
    toast.success("Changes discarded");
  };

  // Handles closing form (save draft for unsaved products)
  const handleCloseForm = () => {
    if (isCreating && activeProductId) {
      // Draft is already saved via auto save
      toast.success("Product draft saved");
    }
    if (isEditing) {
      toast.success("Edit draft saved");
    }
    closeForm();
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col mb-6">
          <BackButton />
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                <span className="bg-linear-to-r from-amber-600 to-yellow-600 dark:from-amber-200 dark:to-yellow-600 bg-clip-text text-transparent">
                  Products Management
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Total Products:{" "}
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {products.length}
                </span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isCreating || isEditing ? (
                <>
                  <Button
                    onClick={handleCancelClick}
                    variant="danger"
                    size="lg"
                    disabled={isCreatingProduct}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCloseForm}
                    variant="secondary"
                    size="lg"
                    disabled={isCreatingProduct}
                  >
                    Save Draft
                  </Button>
                </>
              ) : (
                <Button onClick={handleStartCreate} size="lg">
                  + Create Product
                </Button>
              )}
            </div>
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        {/* Unsaved Products Panel */}
        {isCreating && unsavedProducts.length > 0 && (
          <UnsavedProductsPanel
            unsavedProducts={unsavedProducts}
            activeProductId={activeProductId}
            onSelectProduct={handleSelectUnsavedProduct}
            onDeleteProduct={handleDeleteUnsavedProduct}
            onCreateNew={handleCreateNewProduct}
            maxProducts={MAX_UNSAVED_PRODUCTS}
          />
        )}

        {/* Create/Edit Form */}
        {(isCreating || isEditing) && (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 shadow-xl mb-6">
            <h2 className="text-xl font-bold mb-6 text-amber-400">
              {isCreating ? "Create New Product" : "Edit Product"}
            </h2>
            <form
              onSubmit={
                isCreating ? createForm.handleSubmit : updateForm.handleSubmit
              }
            >
              <ProductForm
                formData={formData}
                onFormDataChange={setFormData}
                categories={categories}
                imagePreview={imagePreview}
                onImageSelect={handleImageSelect}
                onRemoveImage={() => handleRemoveImage(formData, setFormData)}
                isLoading={isCreatingProduct}
                isUploadingImage={isUploadingImage}
                error={
                  (isCreating ? createForm.error : updateForm.error) ||
                  undefined
                }
              />

              {/* Submit Button - Centered at bottom */}
              <div className="flex justify-center pt-6 mt-6 border-t border-gray-200 dark:border-zinc-700">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isCreatingProduct || isUploadingImage}
                  className="min-w-[200px]"
                >
                  {isCreatingProduct
                    ? "Saving..."
                    : isEditing
                    ? "Update Product"
                    : "Create Product"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterCategory={filterCategory}
          onCategoryChange={setFilterCategory}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          categories={categories}
        />

        {/* Products Table */}
        <ProductsTable
          products={filteredProducts}
          searchTerm={searchTerm}
          filterCategory={filterCategory}
          isCreating={isCreating}
          isEditing={isEditing}
          onEdit={handleStartEdit}
          onDelete={openDeleteConfirm}
          onStockUpdated={() => refetchProducts(true)}
        />

        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      <ConfirmDialog
        {...dialogProps}
        onConfirm={() => handleConfirmDelete(mutateDelete)}
        onCancel={handleCancelDelete}
      />

      <ConfirmDialog
        isOpen={showCancelConfirm}
        title="Discard Changes?"
        message="Are you sure you want to cancel? Any unsaved changes will be lost."
        confirmText="Discard"
        cancelText="Keep Editing"
        variant="danger"
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />

      <ConfirmDialog
        isOpen={unsavedDeleteConfirm.show}
        title="Delete Draft Product?"
        message={`Are you sure you want to delete "${unsavedDeleteConfirm.productName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDeleteUnsaved}
        onCancel={() =>
          setUnsavedDeleteConfirm({
            show: false,
            productId: "",
            productName: "",
          })
        }
      />
    </div>
  );
}
