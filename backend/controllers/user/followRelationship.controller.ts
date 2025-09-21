import mongoose from "mongoose";
import User from "../../models/user.model";
import { Response, Request } from "express";
import connectDB from "../../config/connection";

export const followController = {
  follow: async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await connectDB();
      const requesterId = req.user.userid;
      const { targetId } = req.params;
      console.log(requesterId);
      console.log(targetId);

      if (!requesterId || !targetId) {
        throw new Error("Missing user ID(s)");
      }

      await User.updateOne(
        { _id: targetId },
        { $addToSet: { followers: requesterId } },
        { session }
      );

      await User.updateOne(
        { _id: requesterId },
        { $addToSet: { following: targetId } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: "Followed successfully." });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      console.error("Follow transaction error:", error);
      res.status(500).json({ error: "Failed to follow." });
    }
  },

  unfollow: async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await connectDB();
      const requesterId = req.user.userid;
      const { targetId } = req.params;

      if (!requesterId || !targetId) {
        throw new Error("Missing user ID(s)");
      }

      await User.updateOne(
        { _id: targetId },
        { $pull: { followers: requesterId } },
        { session }
      );

      await User.updateOne(
        { _id: requesterId },
        { $pull: { following: targetId } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: "Unfollowed successfully." });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      console.error("Unfollow transaction error:", error);
      res.status(500).json({ error: "Failed to unfollow." });
    }
  },
};
