import jwt from "jsonwebtoken";
import User from "../models/users";

const secret = process.env.JWT_SECRET as string;

const generateToken = (user: any) => {
  const payload = {
    userid: user._id,
    username: user.username,
    role: user.role,
  };

  const token = jwt.sign(payload, secret, {
    expiresIn: "1h",
  });

  return token;
};

export { generateToken };
