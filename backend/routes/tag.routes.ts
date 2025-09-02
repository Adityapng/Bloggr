import { Router } from "express";
import { getAllTagsCategorized } from "../controllers/tags/tag.controller";

const tagRoutes = Router();

tagRoutes.get("/", getAllTagsCategorized);

export default tagRoutes;
