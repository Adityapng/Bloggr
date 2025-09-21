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
  getUserDraftedPosts,
  getUserLikedPosts,
  getFollowStatus,
  getUserArchivedPosts,
  handleArchivePost,
  handleUnarchivePost,
  handleDeletePost,
} from "../controllers/user.controller";
import { followController } from "../controllers/user/followRelationship.controller";
import { ensureDatabaseConnection } from "../middleware/databaseConnection";

const userRoutes = Router();

userRoutes.use(ensureDatabaseConnection);

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
userRoutes.get("/me/drafts", authenticateUserToken, getUserDraftedPosts);
userRoutes.get("/me/archive", authenticateUserToken, getUserArchivedPosts);
userRoutes.patch(
  "/me/post/:postid/archive",
  authenticateUserToken,
  handleArchivePost
);
userRoutes.patch(
  "/me/post/:postid/unarchive",
  authenticateUserToken,
  handleUnarchivePost
);
userRoutes.patch(
  "/me/post/:postid/move-to-trash",
  authenticateUserToken,
  handleUnarchivePost
);
userRoutes.delete(
  "/me/post/:postid/delete",
  authenticateUserToken,
  handleDeletePost
);

export default userRoutes;
