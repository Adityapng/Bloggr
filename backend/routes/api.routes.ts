import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import postRoutes from "./post.routes";
import categoryRoutes from "./category.routes";
import tagRoutes from "./tag.routes";
import searchRoutes from "./search.routes";
import uploadsRoutes from "./upload.routes";

const apiRoutes = Router();

// apiRoutes.use((req, res, next) => {
//   console.log(
//     `BACKEND API ROUTER HIT: Method: [${req.method}], URL: [${req.originalUrl}]`
//   );
//   next(); // Pass control to the next route
// });

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/users", userRoutes);
apiRoutes.use("/posts", postRoutes);
apiRoutes.use("/categories", categoryRoutes);
apiRoutes.use("/tags", tagRoutes);
apiRoutes.use("/search", searchRoutes);
apiRoutes.use("/uploads", uploadsRoutes);

// app.get("/profile", authenticateUserToken);

export default apiRoutes;
