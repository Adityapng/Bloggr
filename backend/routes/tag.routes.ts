import { Router } from "express";
import { getAllTagsCategorized } from "../controllers/tags/tag.controller";
// import { ensureDatabaseConnection } from "../middleware/databaseConnection";

const tagRoutes = Router();

tagRoutes.get("/", getAllTagsCategorized);

export default tagRoutes;
