import { Request, Response } from "express";
import Tag from "../../models/tag.model";
import connectDB from "../../config/connection";

export const getAllTagsCategorized = async (req: Request, res: Response) => {
  try {
    const allTags = await Tag.find({}).sort({ category: 1, name: 1 });

    const categorizedTags = allTags.reduce((acc, tag) => {
      const category = tag.category;

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(tag.name);

      return acc;
    }, {} as Record<string, string[]>);

    res.status(200).json(categorizedTags);
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    res
      .status(500)
      .json({
        error: "Internal server error",
        details: (error as Error).message,
      });
  }
};
