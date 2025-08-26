import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

export const getUploadSignature = (req: Request, res: Response) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        folder: "blog_post_images",
        timestamp: timestamp,
      },
      process.env.CLOUDINARY_API_SECRET as string
    );

    res.status(200).json({ timestamp, signature });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// export const getAssetMetadata = async (req: Request, res: Response) => {
//   try {
//     // We need to encode the public_id because it contains slashes
//     const publicId = encodeURIComponent(req.params.publicId);

//     // Use the Cloudinary Admin API to get details about an asset
//     // Setting resource_type to 'image' and type to 'upload' is good practice
//     const result = await cloudinary.api.resource(publicId, {
//       resource_type: "image",
//       type: "upload",
//     });

//     res.status(200).json(result);
//   } catch (error: any) {
//     console.error("Error fetching asset metadata:", error);
//     // Cloudinary sends a 404 in the error object if not found
//     if (error.http_code === 404) {
//       return res.status(404).json({ error: "Asset not found." });
//     }
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
