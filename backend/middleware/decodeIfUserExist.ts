import { log } from "console";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const decodeUserIfPresent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as any;
    req.user = decoded;
    console.log(req.cookies.token);

    next();
  } catch (error) {
    next();
  }
};

export default decodeUserIfPresent;
