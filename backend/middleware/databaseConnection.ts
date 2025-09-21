import { Request, Response, NextFunction } from "express";
import { DatabaseConnection } from "../config/connection";

export const ensureDatabaseConnection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const dbConnection = DatabaseConnection.getInstance();

  if (!dbConnection.getConnectionStatus()) {
    return res.status(503).json({ error: "Database unavailable" });
  }

  next();
};
