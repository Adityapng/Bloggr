import jwt from "jsonwebtoken";
import ms = require("ms");

export interface UserPayload {
  userid: string;
  username: string;
  role: string;
}

const secret = process.env.JWT_SECRET as string;

const generateToken = (user: any) => {
  const payload: UserPayload = {
    userid: user._id,
    username: user.username,
    role: user.role,
  };

  const token = jwt.sign(payload, secret, {
    expiresIn: ms("14d"),
  });

  return token;
};

export { generateToken };
