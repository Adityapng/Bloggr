import { Request, Response } from "express";

const handleUserLogout = async (req: Request, res: Response) => {
  try {
    // The options (httpOnly, secure, etc.) MUST match the options used when setting the cookie.
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Must match the setting used in login
      maxAge: 0, // Tell the browser to expire it immediately
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
