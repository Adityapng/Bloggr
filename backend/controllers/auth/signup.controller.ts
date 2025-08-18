import { generateToken } from "../../config/tokens";
import User from "../../models/user.model";
import { Request, Response } from "express";

const handleUserSignup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const existingUsername = await User.findOne({
      username: username.toLowerCase(),
    });
    if (existingUsername) {
      return res
        .status(400)
        .json({ error: "A user already exists with this username" });
    }

    const newUSer = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: password,
    });

    const savedUser = await newUSer.save();

    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    const token = generateToken(userWithoutPassword);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
      path: "/",
    });
    console.log(token);

    res.status(200).json({
      message: "Signin successful",
      user: {
        id: userWithoutPassword._id,
        username: userWithoutPassword.username,
        role: userWithoutPassword.role,
      },
    });
  } catch (error) {
    console.log("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default handleUserSignup;
