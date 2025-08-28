import { fetcher } from "./fetcher";
import { MAX_FILE_SIZE } from "./tiptap-utils";

/**
  @param file 
  @param onProgress 
  @param abortSignal
  @returns 
 **/

export interface CloudinaryUploadResult {
  asset_id: string;
  public_id: string;
  version: number;
  width: number;
  height: number;
  format: string;
  resource_type: "image" | "video" | "raw";
  created_at: string;
  bytes: number;
  type: "upload";
  etag: string;
  url: string;
  secure_url: string;
  folder?: string;
  original_filename: string;
}

//TODO Add upload image finction with cloudinary
const getCloudinarySignature = async () => {
  try {
    const path = "/api/uploads/signature";
    const response = await fetcher(path);

    if (!response.ok) {
      throw new Error("Failed to get a signature from the server.");
    }
    return response.json();
  } catch (error) {
    console.error("Error getting Cloudinary signature:", error);
    throw error;
  }
};

export const handleImageUpload = async (
  file: File
): Promise<CloudinaryUploadResult> => {
  if (!file) {
    throw new Error("No file provided.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds the maximum of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
    );
  }

  const { signature, timestamp } = await getCloudinarySignature();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp);
  formData.append("folder", "blog_post_images");

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

  const response = await fetch(cloudinaryUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Cloudinary upload failed: ${errorData.error.message}`);
  }

  return response.json();
};
