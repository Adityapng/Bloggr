import { Router } from "express";
import {
  getAllPost,
  getPostBySlug,
  createPost,
} from "../controllers/post/post.controller";
import {
  commentHandeller,
  bookmarkHandeller,
  getComment,
  postLikeHandeller,
  CommentLikeHandeller,
} from "../controllers/post/postInteraction.controller";
import authenticateUserToken from "../middleware/authenticateUserToken";

const postRoutes = Router();

postRoutes.get("/", getAllPost);
postRoutes.get("/:slug", getPostBySlug);
postRoutes.post("/", authenticateUserToken, createPost);
postRoutes.post("/:postid/like", authenticateUserToken, postLikeHandeller);
postRoutes.post("/:postid/bookmark", authenticateUserToken, bookmarkHandeller);
postRoutes.post("/:postid/comment", authenticateUserToken, commentHandeller);
postRoutes.get("/comment/:postid", getComment);
postRoutes.post("/comment/:commentid/like", CommentLikeHandeller);

export default postRoutes;
