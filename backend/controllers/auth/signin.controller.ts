import User from "../../models/user.model";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { generateToken } from "../../config/tokens";

const handleUserSignin = async (req: Request, res: Response) => {
  try {
    // console.log("Current NODE_ENV:", process.env.NODE_ENV);
    const { username, email, password } = req.body;

    if (!(username || email) || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    const lowerCaseLoginID = (username || email).toLowerCase();

    // console.log("🔍 Looking for user:", lowerCaseLoginID);

    const user = await User.findOne({
      $or: [{ email: lowerCaseLoginID }, { username: lowerCaseLoginID }],
    }).select("+password");

    // console.log("👤 User found:", user ? "Yes" : "No");

    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found, Signup to continue." });
    }

    // console.log("🔐 Checking password...");

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    // console.log("✅ Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // console.log("🎫 Generating token...");
    // console.log("User data:", user.toJSON());

    const token = generateToken(user.toObject());

    // console.log("Token generated:", token ? "✅ Success" : "❌ Failed");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      path: "/",
    });

    res.clearCookie("anon_user_token", { path: "/" });

    res.status(200).json({
      message: "Signin successful",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Signin error:", error);

    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    res.status(500).json({
      error: "Internal server error",
      ...(process.env.NODE_ENV === "development" && { details: error.message }),
    });
  }
};

export default handleUserSignin;
