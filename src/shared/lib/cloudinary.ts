// Cloudinary Image Upload Function (Direct Upload)
export const uploadImageToCloudinary = async (
  file: File
): Promise<{ imageUrl: string; imagePublicId: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
  );
  formData.append("folder", "products");

  // Cloudinary cloud name from environment variables
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Validates cloud name
  if (!cloudName) {
    throw new Error(
      "Cloudinary cloud name not configured. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to your .env.local file."
    );
  }

  // Makes post request to Cloudinary upload endpoint
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  // Handles upload errors
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error?.message || "Failed to upload image to Cloudinary"
    );
  }

  // Parses response data
  const data = await response.json();

  return {
    imageUrl: data.secure_url,
    imagePublicId: data.public_id,
  };
};
