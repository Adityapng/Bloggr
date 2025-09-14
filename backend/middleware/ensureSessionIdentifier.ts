import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export const ensureSessionIdentifier = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.cookies.token;
  const anonToken = req.cookies.anon_user_token;
  if (authToken || anonToken) {
    return next();
  }
  console.log("[Session] New visitor detected. Generating anonymous token.");
  const anonymousId: string = uuidv4();

  const domain =
    process.env.NODE_ENV === "production" ? "bloggr.space" : undefined;

  console.log(
    `Setting cookie with domain: ${domain} (from session identifier)`
  ); // For debugging

  res.cookie("anon_user_token", anonymousId, {
    httpOnly: true,
    secure: true,
    // secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    // domain: domain,
    expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    path: "/",
  });

  req.cookies.anon_user_token = anonymousId;

  next();
};
