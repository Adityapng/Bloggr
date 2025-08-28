import { Router, Response, Request } from "express";
import User from "../models/user.model";

const homeRoutes = Router();

homeRoutes.get("/", async (req: Request, res: Response) => {
  try {
    if (req.user) {
      const currentUser = await User.findById(req.user.userid);
      if (!currentUser) {
        return res.json({ isLoggedIn: false, user: null });
      }

      return res.json({
        isLoggedIn: true,
        user: currentUser,
      });
    } else {
      return res.json({
        isLoggedIn: false,
        user: {
          id: req.sessionId,
          username: "Guest",
        },
      });
    }
  } catch (error) {
    console.error("API Error at root:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default homeRoutes;
