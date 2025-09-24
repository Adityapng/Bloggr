import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import Post from "../models/post.model";
import connectDB from "../config/connection";
import mongoose from "mongoose";

const deleteUserAvatarFromDB = async (req: Request, res: Response) => {
  // const cloudinary = require("cloudinary").v2;
  try {
    await connectDB();
    const userID = req.user.userid;

    const user = await User.findOneAndUpdate(
      { _id: userID },
      { $set: { profilePicturePublicID: "", avatarURL: "" } },
      { new: true }
    );
    // console.log(user, "this is teh userid from delete avatar");

    res
      .status(200)
      .json({ message: "Avatar updated successfully.", updateddata: user });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
const deleteUserAvatarFromCloudinary = async (req: Request, res: Response) => {
  const cloudinary = require("cloudinary").v2;
  try {
    const { imagePublicID } = req.body;

    if (!imagePublicID) {
      return res.status(400).json({ error: "No image public ID provided." });
    }

    const result = await cloudinary.uploader.destroy(imagePublicID);

    if (result.result !== "ok") {
      return res
        .status(404)
        .json({ error: "Image not found or already deleted." });
    }

    res.status(200).json({ message: "Avatar updated successfully." });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getUserProfile = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { username } = req.params;
    const requestedUserId = await User.findOne({ username: username }).select(
      "_id"
    );

    const results = await Post.aggregate([
      {
        $match: {
          author: requestedUserId?._id,
        },
      },
      {
        $group: {
          _id: null,
          totalReads: { $sum: { $size: "$reads" } },
        },
      },
    ]);
    const TotalReads = results[0]?.totalReads || 0;
    // console.log(requestedUserId);
    // console.log(results);

    const userdata = await User.findOneAndUpdate(
      { username: username },
      { $set: { totalReads: TotalReads } },
      { new: true }
    )
      .populate("followers", "username avatarURL firstName lastName")
      .populate("following", "username avatarURL firstName lastName");

    if (!userdata) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(userdata);
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getUserPosts = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { userid } = req.params;
    const posts = await Post.find({ author: userid, status: "published" })
      .sort({ createdAt: -1 })
      .populate("author", "username firstName lastName avatarURL");

    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting user posts:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getUserBookmarkedPosts = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { userid } = req.user;
    const posts = await Post.find({ bookmarks: { $in: userid } })
      .sort({ createdAt: -1 })
      .populate("author", "username firstName lastName avatarURL");

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting user posts:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getUserLikedPosts = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { userid } = req.user;

    const posts = await Post.find({ likes: { $in: userid } })
      .sort({ createdAt: -1 })
      .populate("author", "username firstName lastName avatarURL");
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting user posts:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getUserDraftedPosts = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { userid } = req.user;

    const posts = await Post.find({ author: userid, status: "draft" })
      .sort({ createdAt: -1 })
      .populate("author", "username firstName lastName avatarURL");
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting user posts:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
const getUserArchivedPosts = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { userid } = req.user;

    const posts = await Post.find({ author: userid, status: "archived" })
      .sort({ createdAt: -1 })
      .populate("author", "username firstName lastName avatarURL");
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting user posts:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
const handleArchivePost = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { postid } = req.params;
    const userid = req.user?.userid; // Make sure this exists

    if (!postid || !userid) {
      return res.status(400).json({ error: "Missing post ID or user ID" });
    }

    const result = await Post.findOneAndUpdate(
      { _id: postid }, // Make sure user owns the post
      { status: "archived" },
      { new: true } // Return the updated document
    );

    if (!result) {
      return res
        .status(404)
        .json({ error: "Post not found or not authorized" });
    }

    return res.status(200).json({ message: "Post archived", post: result });
  } catch (error) {
    console.error("Error archiving post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleUnarchivePost = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { postid } = req.params;
    const userid = req.user?.userid; // Make sure this exists

    if (!postid || !userid) {
      return res.status(400).json({ error: "Missing post ID or user ID" });
    }

    const result = await Post.findOneAndUpdate(
      { _id: postid }, // Make sure user owns the post
      { status: "published" },
      { new: true } // Return the updated document
    );

    if (!result) {
      return res
        .status(404)
        .json({ error: "Post not found or not authorized" });
    }

    return res.status(200).json({ message: "Post archived", post: result });
  } catch (error) {
    console.error("Error archiving post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleMoveToTrash = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { postid } = req.params;

    if (!postid) {
      return res.status(400).json({ error: "Missing post ID" });
    }

    const trashedPost = await Post.findOneAndUpdate(
      { _id: postid },
      { status: "trash" },
      { new: true }
    );

    if (!trashedPost) {
      return res
        .status(404)
        .json({ error: "Post not found or not authorized" });
    }

    return res.status(200).json({ message: "Post moved to trash" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleDeletePost = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { postid } = req.params;

    if (!postid) {
      return res.status(400).json({ error: "Missing post ID" });
    }
    console.log("delete req eceived for post", postid);

    const deletedPost = await Post.findOneAndDelete({
      _id: postid,
    });
    console.log(deletedPost);

    if (!deletedPost) {
      return res
        .status(404)
        .json({ error: "Post not found or not authorized" });
    }

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getCurrectAuthenticatedUserDetails = async (
  req: Request,
  res: Response
) => {
  try {
    await connectDB();
    const userid = req.user.userid;
    const objectUserId = mongoose.Types.ObjectId.createFromHexString(userid);
    const results = await Post.aggregate([
      {
        $match: {
          author: objectUserId,
        },
      },
      {
        $group: {
          _id: null,
          totalReads: { $sum: { $size: "$reads" } },
        },
      },
    ]);

    const TotalReads = results[0]?.totalReads || 0;

    const userdata = await User.findOneAndUpdate(
      { _id: userid },
      { $set: { totalReads: TotalReads } },
      { new: true }
    )
      .populate("followers", "username avatarURL firstName lastName")
      .populate("following", "username avatarURL firstName lastName");

    if (!userdata) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(userdata);
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const updateUserProfile = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const userId = req.user.userid;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFollowStatus = async (req: Request, res: Response) => {
  const userid = req.user.userid;
  const { targetId } = req.params;

  try {
    await connectDB();
    const isFollowing = !!(await User.exists({
      _id: targetId,
      followers: userid,
    }));
    res.status(200).json({ isFollowing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  deleteUserAvatarFromDB,
  deleteUserAvatarFromCloudinary,
  getUserProfile,
  getUserPosts,
  getCurrectAuthenticatedUserDetails,
  updateUserProfile,
  getUserBookmarkedPosts,
  getUserLikedPosts,
  getUserDraftedPosts,
  getFollowStatus,
  getUserArchivedPosts,
  handleArchivePost,
  handleUnarchivePost,
  handleDeletePost,
  handleMoveToTrash,
};
