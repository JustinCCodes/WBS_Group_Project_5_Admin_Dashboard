import { useState } from "react";
import { uploadImageToCloudinary } from "@/src/shared/lib/cloudinary";
import type { ProductInput } from "../types";
import type {
  UseProductFormSubmissionOptions,
  UseProductFormSubmissionReturn,
} from "../types";
import toast from "react-hot-toast";

// Hook to manage product form submission logic
export const useProductFormSubmission = (
  options: UseProductFormSubmissionOptions = {}
) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Handles image selection and validation
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handles removing the selected image
  const handleRemoveImage = (
    formData: ProductInput,
    setFormData: (data: ProductInput) => void
  ) => {
    setSelectedImage(null);
    setImagePreview("");
    setFormData({
      ...formData,
      imageUrl: "",
      imagePublicId: "",
    });
  };

  // Prepares form data by uploading image and validating fields
  const prepareFormDataWithImage = async (
    data: ProductInput
  ): Promise<ProductInput> => {
    // Upload image if selected
    if (selectedImage) {
      setIsUploadingImage(true);
      try {
        const uploadResult = await uploadImageToCloudinary(selectedImage);
        data.imageUrl = uploadResult.imageUrl;
        data.imagePublicId = uploadResult.imagePublicId;
      } catch (error) {
        setIsUploadingImage(false);
        throw error;
      }
      setIsUploadingImage(false);
    }

    // Validates required fields
    if (!data.name || data.name.trim() === "") {
      throw new Error("Product name is required");
    }

    if (!data.description || data.description.trim() === "") {
      throw new Error("Product description is required");
    }

    if (!data.categoryId || data.categoryId === "") {
      throw new Error("Please select a category");
    }

    if (!data.imageUrl || data.imageUrl === "") {
      throw new Error(
        "Product image is required. Please upload an image or provide an image URL."
      );
    }

    if (!data.imagePublicId || data.imagePublicId === "") {
      throw new Error("Image public ID is missing. Please upload an image.");
    }

    if (data.price < 0) {
      throw new Error("Price must be a positive number");
    }

    if (data.stock < 0) {
      throw new Error("Stock cannot be negative");
    }

    return data;
  };

  const resetImageState = () => {
    setSelectedImage(null);
    setImagePreview("");
    setIsUploadingImage(false);
  };

  return {
    selectedImage,
    imagePreview,
    isUploadingImage,
    setImagePreview,
    handleImageSelect,
    handleRemoveImage,
    prepareFormDataWithImage,
    resetImageState,
  };
};
