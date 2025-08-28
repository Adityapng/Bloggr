import { Request, Response } from "express";

const handleUserLogout = async (req: Request, res: Response) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error during logout" });
  }
};

export default handleUserLogout;
