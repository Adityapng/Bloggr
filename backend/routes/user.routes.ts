import { Router } from "express";
import authenticateUserToken from "../middleware/authenticateUserToken";
import { updateUserAvatar } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.put("/profile/avatar", authenticateUserToken, updateUserAvatar);

export default userRoutes;
