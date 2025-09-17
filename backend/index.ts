import cors, { CorsOptions } from "cors";
import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import connectDB from "./config/connection";
import cookieParser from "cookie-parser";
import decodeUserIfPresent from "./middleware/decodeIfUserExist";
import apiRoutes from "./routes/api.routes";
import homeRoutes from "./routes/home.routes";
import configureCloudinary from "./config/cloudinary";
import { ensureSessionIdentifier } from "./middleware/ensureSessionIdentifier";

const app = express();
connectDB()
  .then(() => {
    console.log("Database connection established for this instance.");
  })
  .catch((err) => {
    console.error(
      "Failed to establish database connection for this instance:",
      err
    );
  });

configureCloudinary();

// TODO remove this once developement is done
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000" || "",
];

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(ensureSessionIdentifier);

app.use("/api", decodeUserIfPresent, apiRoutes);
app.use("/", decodeUserIfPresent, homeRoutes);

if (process.env.NODE_ENV !== "production") {
  const PORT = Number(process.env.PORT) || 5050;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started for development at Port ${PORT}`);
  });
}

export default app;
