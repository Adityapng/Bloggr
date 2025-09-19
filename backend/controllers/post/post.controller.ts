import { Request, Response } from "express";
import Post from "../../models/post.model";
import { Types } from "mongoose";
import Tag from "../../models/tag.model";
import connectDB from "../../config/connection";

export const getAllPost = async (req: Request, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const categoryFilter = req.query.filter as string;

    const perPage = 10;
    const skip = (page - 1) * perPage;

    const filterQuery: { [key: string]: any } = { status: "published" };
    await connectDB();

    if (categoryFilter && categoryFilter !== "All") {
      const tagsInCategory = await Tag.find({
        category: categoryFilter,
      }).select("_id");

      const tagIds = tagsInCategory.map((tag) => tag._id);

      if (tagIds.length > 0) {
        filterQuery.tags = { $in: tagIds };
        // console.log(tagIds, "yghhhh");
      } else {
        filterQuery._id = null;
      }
    }

    // console.log("Executing post query with filter:", filterQuery);

    const totalPosts = await Post.countDocuments(filterQuery);

    const posts = await Post.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .populate("author", "username firstName lastName avatarUrl")
      .populate("tags", "name slug category");

    // console.log(posts);

    const totalPages = Math.ceil(totalPosts / perPage);

    res.status(200).json({
      posts,
      currentPage: page,
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
    // console.log(
    //   "registered user accessed the blog, userid added to reads array and registeredReader array"
    // );
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
    // console.log(
    //   "anonymous user accessed the blog, userid added to reads array"
    // );
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
    await connectDB();
    // console.log(
    //   `User ID for read count from [get post from slug]: ${requesterId}`
    // );

    const requestedPost = await Post.findOne({ slug: slug })
      .populate("author", "username avatarUrl firstName lastName _id")
      .populate("tags", "name slug category");

    if (!requestedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(requestedPost);
    if (req.cookies.token) {
      // console.log("user view counter initiated from getpostbyslug");

      incrementUserViewCount(requestedPost._id as Types.ObjectId, requesterId);
    }
    if (req.cookies.anon_user_token) {
      // console.log("anonymous view counter initiated from getpostbyslug");

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
    const {
      title,
      content,
      coverImage,
      tags: tagnames,
      status,
      wordCount,
    } = req.body;

    const authorId = req.user.userid;

    const MAX_WORDS = 10000;
    const MIN_WORDS = 50;
    await connectDB();
    if (wordCount > MAX_WORDS) {
      return res.status(400).json({
        error: `Post exceeds the maximum word limit of ${MAX_WORDS} words.`,
      });
    }
    if (wordCount < MIN_WORDS) {
      return res.status(400).json({
        error: `Post must be at least ${MIN_WORDS} words long.`,
      });
    }

    const foundTags = await Tag.find({ name: { $in: tagnames } });
    const tagIds = foundTags.map((tag) => tag._id);

    const newPost = new Post({
      title,
      content,
      coverImage,
      tags: tagIds,
      status,
      author: authorId,
      wordCount: wordCount,
      likes: [authorId],
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
