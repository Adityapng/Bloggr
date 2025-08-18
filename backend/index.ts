import cors from "cors";
import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import connectDB from "./config/connection";
import cookieParser from "cookie-parser";
import decodeUserIfPresent from "./middleware/decodeIfUserExist";
import authenticateUserToken from "./middleware/authenticateUserToken";
import apiRoutes from "./routes/api.routes";
import homeRoutes from "./routes/home.routes";
import configureCloudinary from "./config/cloudinary";

const app = express();
connectDB();
configureCloudinary();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://192.168.1.7:3000",
    "http://192.168.2.125:3000",
    "http://10.206.239.19:3000",
    /^http:\/\/10\.\d+\.\d+\.\d+:3000$/,
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

// app.get("/test-route", (req, res) => {
//   res.status(200).json({ message: "Test route is working!" });
// });

app.use("/api", apiRoutes);
app.use("/", decodeUserIfPresent, homeRoutes);

const PORT = Number(process.env.PORT) || 3030;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started at Port ${PORT}`);
});
