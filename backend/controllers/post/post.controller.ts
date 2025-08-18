import { Request, Response } from "express";
import Post from "../../models/post.model";

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
      .limit(perPage);

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

export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const requestedPost = await Post.findOne({ slug: slug }).populate(
      "author",
      "username avatarUrl"
    );

    if (!requestedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(requestedPost);
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
