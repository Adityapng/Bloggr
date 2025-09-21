import { Router } from "express";
import { getAllTagsCategorized } from "../controllers/tags/tag.controller";
import { ensureDatabaseConnection } from "../middleware/databaseConnection";

const tagRoutes = Router();

tagRoutes.get("/", ensureDatabaseConnection, getAllTagsCategorized);

export default tagRoutes;
