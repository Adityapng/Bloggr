// import { Request, Response, NextFunction } from "express";
// import mongoose from "mongoose";

// export const checkDbConnection = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // Directly check the Mongoose connection state.
//   // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
//   if (mongoose.connection.readyState === 1) {
//     // If we are connected, proceed.
//     return next();
//   }

//   // If not connected, send a 503 error.
//   // The 'connectDB' function in a controller will handle the actual connection attempt.
//   // This middleware's only job is to be a fast health check.
//   console.warn("Database connection health check failed: Not connected.");
//   return res
//     .status(503)
//     .json({ error: "Service Unavailable: Database is not connected." });
// };
