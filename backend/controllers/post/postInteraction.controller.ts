import mongoose from "mongoose";
import Post from "../../models/post.model";
import Comment from "../../models/comment.model";
import { Response, Request } from "express";

const likeHandeller = async (req: Request, res: Response) => {
  try {
    const { postid } = req.params;
    const userid = req.user.userid;

    if (!userid) {
      return res.status(400).json({ error: "Login to like a post" });
    }

    const post = await Post.findById(postid);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const hasLikedPost = post.likes.includes(userid);

    if (hasLikedPost) {
      post.likes = post.likes.filter(
        (id: mongoose.Types.ObjectId) => id.toString() !== userid
      );
    } else {
      post.likes.push(userid);
    }

    await post.save();

    res.status(200).json({
      likeCount: post.likeCount,
      userHasLiked: !hasLikedPost,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const bookmarkHandeller = async (req: Request, res: Response) => {
  try {
    const { postid } = req.params;
    const userid = req.user.userid;

    if (!userid) {
      return res.status(400).json({ error: "Login to bookmark a post" });
    }

    const post = await Post.findById(postid);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const hasBookmarkedPost = post.bookmarks.includes(userid);

    if (hasBookmarkedPost) {
      post.bookmarks = post.bookmarks.filter(
        (id: mongoose.Types.ObjectId) => id.toString() !== userid
      );
    } else {
      post.bookmarks.push(userid);
    }

    await post.save();

    res.status(200).json({
      bookmarkCount: post.bookmarkCount,
      userHasBookmarked: !hasBookmarkedPost,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const commentHandeller = async (req: Request, res: Response) => {
  try {
    const { postid } = req.params;
    const { content } = req.body;
    const { userid } = req.user;

    if (!userid) {
      return res.status(400).json({ error: "Login to like a post" });
    }

    const post = await Post.findById(postid);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = new Comment({
      content,
      author: userid,
      post: postid,
    });

    await newComment.save();

    await Post.findByIdAndUpdate(postid, { $inc: { commentCount: 1 } });

    const populatedComment = await Comment.findById(newComment._id).populate(
      "author",
      "username avatarUrl"
    );

    res.status(201).json(populatedComment);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export { likeHandeller, commentHandeller, bookmarkHandeller };
