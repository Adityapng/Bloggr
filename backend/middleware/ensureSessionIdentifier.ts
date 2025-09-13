import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export const ensureSessionIdentifier = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.cookies.token;
  const anonToken = req.cookies.anon_user_token;

  // if (authToken || anonToken) {
  //   console.log("auth ", authToken || "anon ", anonToken);

  //   return next();
  // }
  // console.log(" ");
  // console.log(" ");
  // console.log(anonToken);
  // console.log(" ");
  // console.log(" ");

  const anonymousId: string = uuidv4();
  // console.log("anon id generated from ensureSessionIdentifier");

  res.cookie("anon_user_token", anonymousId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    path: "/",
  });

  req.cookies.anon_user_token = anonymousId;
  // console.log(
  //   "anon id set to cookies in req object from ensureSessionIdentifier"
  // );

  next();
};
