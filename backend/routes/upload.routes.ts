import { Router } from "express";
import { getUploadSignature } from "../controllers/cloudinary/upload.controller";
import authenticateToken from "../middleware/authenticateUserToken";

const uploadsRoutes = Router();

uploadsRoutes.get("/signature", authenticateToken, getUploadSignature);

export default uploadsRoutes;
