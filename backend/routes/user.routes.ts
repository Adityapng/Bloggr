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
  getFollowStatus,
} from "../controllers/user.controller";
import { followController } from "../controllers/user/followRelationship.controller";

const userRoutes = Router();

userRoutes.patch(
  "/profile/avatar",
  authenticateUserToken,
  deleteUserAvatarFromDB,
  deleteUserAvatarFromCloudinary
);
userRoutes.patch("/me", authenticateUserToken, updateUserProfile);
userRoutes.patch(
  "/:targetId/follow",
  authenticateUserToken,
  followController.follow
);
userRoutes.patch(
  "/:targetId/unfollow",
  authenticateUserToken,
  followController.unfollow
);

userRoutes.get("/profile/:username", getUserProfile);
userRoutes.get("/:userid/posts", getUserPosts);
userRoutes.get(
  "/:targetId/checkFollowStatus",
  authenticateUserToken,
  getFollowStatus
);
userRoutes.get(
  "/me",
  authenticateUserToken,
  getCurrectAuthenticatedUserDetails
);
userRoutes.get("/me/bookmarks", authenticateUserToken, getUserBookmarkedPosts);
userRoutes.get("/me/likes", authenticateUserToken, getUserLikedPosts);

export default userRoutes;
