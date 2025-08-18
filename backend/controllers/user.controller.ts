import { Request, Response } from "express";
import User from "../models/user.model";

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const userID = req.user.userid;

    const { avatarURL } = req.user;

    if (!avatarURL) {
      return res.status(400).json({ error: "Avatar URL is required." });
    }

    await User.findByIdAndUpdate(userID, { $set: { avatarURL } });

    res.status(200).json({ message: "Avatar updated successfully." });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
