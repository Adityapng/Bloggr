import { Router } from "express";
import {
  getAllPost,
  getPostBySlug,
  createPost,
  updatePost,
} from "../controllers/post/post.controller";
import {
  commentHandeller,
  bookmarkHandeller,
  getComment,
  postLikeHandeller,
  CommentLikeHandeller,
} from "../controllers/post/postInteraction.controller";
import authenticateUserToken from "../middleware/authenticateUserToken";
// import { ensureDatabaseConnection } from "../middleware/databaseConnection";

const postRoutes = Router();

// postRoutes.use(ensureDatabaseConnection);

postRoutes.get("/", getAllPost);
postRoutes.get("/:slug", getPostBySlug);
postRoutes.post("/", authenticateUserToken, createPost);
postRoutes.patch("/:postId", authenticateUserToken, updatePost);
postRoutes.post("/:postid/like", authenticateUserToken, postLikeHandeller);
postRoutes.post("/:postid/bookmark", authenticateUserToken, bookmarkHandeller);
postRoutes.post("/:postid/comment", authenticateUserToken, commentHandeller);
postRoutes.get("/comment/:postid", getComment);
postRoutes.post("/comment/:commentid/like", CommentLikeHandeller);

export default postRoutes;
