import { Router, Response, Request } from "express";
import User from "../models/user.model";

const homeRoutes = Router();

homeRoutes.get("/", async (req: Request, res: Response) => {
  try {
    if (req.user) {
      const currentUser = await User.findOne({ _id: req.user.userid });

      console.log(currentUser);
      return res.json({
        isLoggedIn: true,
        user: currentUser,
      });
    } else {
      return res.json({
        isLoggedIn: false,
        user: null,
      });
    }
  } catch (error) {
    console.error("API Error at root:", error);
    return res.status(500).json({ isLoggedIn: false, user: null });
  }
});

export default homeRoutes;
