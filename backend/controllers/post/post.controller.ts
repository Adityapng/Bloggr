import { Request, Response } from "express";
import Post from "../../models/post.model";
import { Types } from "mongoose";
import { log } from "console";

export const getAllPost = async (req: Request, res: Response) => {
  try {
    const { page, tag } = req.query;

    const currentPage = parseInt(page as string) || 1;
    const perPage = 10;
    const skip = (currentPage - 1) * perPage;

    const conditionalFiltering: { [key: string]: any } = {};

    if (tag && tag !== "none") {
      conditionalFiltering.tags = tag;
    }

    const totalPosts = await Post.countDocuments(conditionalFiltering);

    const posts = await Post.find(conditionalFiltering)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .populate("author", "username firstName lastName avatarUrl");

    const totalPages = Math.ceil(totalPosts / perPage);

    res.status(200).json({
      posts,
      currentPage: currentPage,
      totalPages,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const incrementUserViewCount = async (
  postId: Types.ObjectId,
  userid: string | null
) => {
  try {
    if (userid) {
      await Post.findByIdAndUpdate(
        postId,
        {
          $addToSet: { registeredReader: userid, reads: userid },
        },
        { new: true }
      );
    }
    console.log(
      "registered user accessed the blog, userid added to reads array and registeredReader array"
    );
  } catch (error) {
    console.error(
      `Failed to add user ${userid} to increment view count for post ${postId}:`,
      error
    );
  }
};

const incrementAnonViewCount = async (
  postId: Types.ObjectId,
  userid: string | null
) => {
  try {
    if (userid) {
      await Post.findByIdAndUpdate(
        postId,
        {
          $addToSet: { reads: userid },
        },
        { new: true }
      );
    }
    console.log(
      "anonymous user accessed the blog, userid added to reads array"
    );
  } catch (error) {
    console.error(
      `Failed to add user ${userid} to increment view count for post ${postId}:`,
      error
    );
  }
};

export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const requesterId = req.sessionId || null;

    console.log(
      `User ID for read count from [get post from slug]: ${requesterId}`
    );

    const requestedPost = await Post.findOne({ slug: slug }).populate(
      "author",
      "username avatarUrl firstName lastName"
    );

    if (!requestedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(requestedPost);
    if (req.cookies.token) {
      console.log("user view counter initiated from getpostbyslug");

      incrementUserViewCount(requestedPost._id as Types.ObjectId, requesterId);
    }
    if (req.cookies.anon_user_token) {
      console.log("anonymous view counter initiated from getpostbyslug");

      incrementAnonViewCount(requestedPost._id as Types.ObjectId, requesterId);
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, coverImage, tags, status } = req.body;

    const authorId = req.user.userid;

    const newPost = new Post({
      title,
      content,
      coverImage,
      tags,
      status,
      author: authorId,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
