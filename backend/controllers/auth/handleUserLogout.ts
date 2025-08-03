import User from "../../models/users";
import { Request, Response } from "express";

const handleUserLogout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};

export default handleUserLogout;
