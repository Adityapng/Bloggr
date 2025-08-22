import { MAX_FILE_SIZE } from "./tiptap-utils";

/**
  @param file 
  @param onProgress 
  @param abortSignal
  @returns 
 **/

// interface ReturnImageData {
//   imageURL: string;
//   imageHeight: number;
//   imageWidth: number;
//   imageAspectRatio: string;
//   imageAspectRatioNumerator: number;
//   imageAspectRatioDenominator: number;
// }

//TODO Add upload image finction with cloudinary
const getCloudinarySignature = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";
    const response = await fetch(`${apiUrl}/api/uploads/signature`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to get a signature from the server.");
    }
    console.log(response);
    return response.json();
  } catch (error) {
    console.error("Error getting Cloudinary signature:", error);
    throw error;
  }
};

export const handleImageUpload = async (file: File): Promise<string> => {
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

  const data = await response.json();
  // const getImageAspectRatio = (input1: number, input2: number) => {
  //   function myFunction(a: number, b: number) {
  //     if (b === 0) {
  //       return a;
  //     }
  //     return myFunction(b, a % b);
  //   }
  //   const result = myFunction(input1, input2);
  //   const ARnumerator = data.height / result;
  //   const ARdenominator = data.width / result;
  //   const aspectRatio = `${ARnumerator}/${ARdenominator}`;
  //   const returnData = {
  //     aspectRatio: aspectRatio,
  //     ARnumerator: ARnumerator,
  //     ARdenominator: ARdenominator,
  //   };
  //   return returnData;
  // };
  // const returnData = getImageAspectRatio(data.height, data.width);
  // const imageData: ReturnImageData = {
  //   imageURL: data.secure_url,
  //   imageHeight: data.height,
  //   imageWidth: data.width,
  //   imageAspectRatio: returnData.aspectRatio,
  //   imageAspectRatioNumerator: returnData.ARnumerator,
  // imageAspectRatioDenominator: returnData.ARdenominator,
  // };

  return data.secure_url;
};
