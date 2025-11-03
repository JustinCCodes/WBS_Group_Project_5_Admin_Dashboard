import { useState } from "react";
import type { ProductInput } from "../types";

// Hook to manage image upload logic for products
export const useImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Handles image selection and validation
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        return { error: "Image size must be less than 5MB" };
      }
      if (!file.type.startsWith("image/")) {
        return { error: "Please select a valid image file" };
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    return { error: null };
  };

  // Handles removing the selected image
  const handleRemoveImage = (
    setFormData: (data: ProductInput) => void,
    currentFormData: ProductInput
  ) => {
    setSelectedImage(null);
    setImagePreview("");
    setFormData({
      ...currentFormData,
      imageUrl: "",
      imagePublicId: "",
    });
  };

  // Resets image upload state
  const resetImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setIsUploadingImage(false);
  };

  return {
    selectedImage,
    imagePreview,
    isUploadingImage,
    setImagePreview,
    setIsUploadingImage,
    handleImageSelect,
    handleRemoveImage,
    resetImage,
  };
};
