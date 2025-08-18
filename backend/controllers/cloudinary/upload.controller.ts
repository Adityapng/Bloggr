import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

export const getUploadSignature = (req: Request, res: Response) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
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
