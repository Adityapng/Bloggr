import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "../config/tokens";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      sessionId?: string;
    }
  }
}

const decodeUserIfPresent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.cookies?.token;
  const anonToken = req.cookies?.anon_user_token;

  // console.log(
  //   `[Decode] AuthToken: ${authToken ? "Present" : "None"}, AnonToken: ${
  //     anonToken || "None"
  //   }`
  // );

  if (authToken) {
    try {
      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(authToken, secret) as UserPayload;

      req.user = decoded;
      req.sessionId = decoded.userid;

      // console.log(`[Decode] Authenticated user found: ${decoded.userid}`);
    } catch (error) {
      req.sessionId = anonToken;
      // console.log(
      //   `[Decode] Invalid auth token. Falling back to anon session: ${anonToken}`
      // );
    }
  } else {
    req.sessionId = anonToken;
    // console.log(`[Decode] Guest session found: ${anonToken}`);
  }

  next();
};

export default decodeUserIfPresent;
