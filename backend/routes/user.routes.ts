import { Router } from "express";
import authenticateUserToken from "../middleware/authenticateUserToken";
import {
  getUserProfile,
  deleteUserAvatarFromDB,
  deleteUserAvatarFromCloudinary,
  getUserPosts,
  getCurrectAuthenticatedUserDetails,
  updateUserProfile,
  getUserBookmarkedPosts,
  getUserLikedPosts,
} from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.patch(
  "/profile/avatar",
  authenticateUserToken,
  deleteUserAvatarFromDB,
  deleteUserAvatarFromCloudinary
);
userRoutes.get("/profile/:username", getUserProfile);
userRoutes.get("/:userid/posts", getUserPosts);
userRoutes.get(
  "/me",
  authenticateUserToken,
  getCurrectAuthenticatedUserDetails
);
userRoutes.get("/me/bookmarks", authenticateUserToken, getUserBookmarkedPosts);
userRoutes.get("/me/likes", authenticateUserToken, getUserLikedPosts);
userRoutes.patch("/me", authenticateUserToken, updateUserProfile);

export default userRoutes;
