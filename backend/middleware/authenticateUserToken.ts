import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticateUserToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    req.user = decoded;
    // console.log(token);
    // console.log(decoded);

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Invalid token" });
    }
    return res.status(500).json({ error: "Authentication error" });
  }
};

export default authenticateUserToken;
