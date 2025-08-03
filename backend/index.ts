import cors from "cors";
import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import connectDB from "./config/connection";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import decodeUserIfPresent from "./middleware/decodeIfUserExist";
import authenticateUserToken from "./middleware/authenticateUserToken";
import User from "./models/users";

const app = express();

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
  credentials: true, // if you need to send cookies
};

connectDB();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", decodeUserIfPresent, async (req, res) => {
  const currentUser = await User.findOne({ _id: req.user.userid });
  res.end(`Hello ${currentUser?.firstName}`);
});

app.get("/profile", authenticateUserToken);

app.use("/api/users", authRoutes);

const PORT = Number(process.env.PORT) || 3030;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started at Port ${PORT}`);
});
