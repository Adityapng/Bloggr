import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

export const getUploadSignature = (req: Request, res: Response) => {
  const { folder } = req.query;
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        folder: folder,
        timestamp: timestamp,
      },
      process.env.CLOUDINARY_API_SECRET as string
    );
    // console.log("upload success");
    res.status(200).json({ timestamp, signature });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
