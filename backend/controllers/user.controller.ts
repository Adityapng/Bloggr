import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import Post from "../models/post.model";

const deleteUserAvatarFromDB = async (req: Request, res: Response) => {
  // const cloudinary = require("cloudinary").v2;
  try {
    const userID = req.user.userid;
    // const { imagePublicID } = req.body;

    // if (!imagePublicID) {
    //   return res.status(400).json({ error: "No image public ID provided." });
    // }

    // const result = await cloudinary.uploader.destroy(imagePublicID);

    // if (result.result !== "ok") {
    //   return res
    //     .status(404)
    //     .json({ error: "Image not found or already deleted." });
    // }

    const user = await User.findOneAndUpdate(
      { _id: userID },
      { $set: { profilePicturePublicID: "", avatarURL: "" } },
      { new: true }
    );
    console.log(user, "this is teh userid from delete avatar");

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
    const { username } = req.params;
    const requestedUserId = await User.findOne({ username: username }).select(
      "_id"
    );

    const results = await Post.aggregate([
      {
        $match: {
          author: requestedUserId,
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
      { username: username },
      { $set: { totalReads: TotalReads } },
      { new: true }
    )
      .populate("followers", "username avatarUrl fullName")
      .populate("following", "username avatarUrl fullName");

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
    const { userid } = req.params;

    const posts = await Post.find({ author: userid })
      .sort({ createdAt: -1 })
      .populate("author", "username firstName lastName avatarUrl");
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting user posts:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getUserBookmarkedPosts = async (req: Request, res: Response) => {
  try {
    const { userid } = req.user;

    const posts = await Post.find({ bookmarks: { $in: userid } })
      .sort({ createdAt: -1 })
      .populate("author", "username firstName lastName avatarUrl");
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting user posts:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getUserLikedPosts = async (req: Request, res: Response) => {
  try {
    const { userid } = req.user;

    const posts = await Post.find({ likes: { $in: userid } })
      .sort({ createdAt: -1 })
      .populate("author", "username firstName lastName avatarUrl");
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting user posts:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getCurrectAuthenticatedUserDetails = async (
  req: Request,
  res: Response
) => {
  try {
    const userid = req.user.userid;

    const results = await Post.aggregate([
      {
        $match: {
          author: userid,
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
      .populate("followers", "username avatarUrl fullName")
      .populate("following", "username avatarUrl fullName");

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

export {
  deleteUserAvatarFromDB,
  deleteUserAvatarFromCloudinary,
  getUserProfile,
  getUserPosts,
  getCurrectAuthenticatedUserDetails,
  updateUserProfile,
  getUserBookmarkedPosts,
  getUserLikedPosts,
};
