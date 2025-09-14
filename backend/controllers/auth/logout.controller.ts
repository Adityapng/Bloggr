import { Request, Response } from "express";

const handleUserLogout = async (req: Request, res: Response) => {
  try {
    const domain =
      process.env.NODE_ENV === "production" ? ".vercel.app" : undefined;

    console.log(
      `Setting cookie with domain: ${domain} (from logout controller)`
    ); // For debugging

    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 0,
      path: "/",
      // domain: domain,
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
