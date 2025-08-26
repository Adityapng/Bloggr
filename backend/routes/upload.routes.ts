import { Router } from "express";
import { getUploadSignature } from "../controllers/cloudinary/upload.controller";
import authenticateToken from "../middleware/authenticateUserToken";

const uploadsRoutes = Router();

uploadsRoutes.get("/signature", authenticateToken, getUploadSignature);
// uploadsRoutes.get(
//   "/metadata/:publicId(*)",
//   authenticateToken,
//   getAssetMetadata
// );

export default uploadsRoutes;
