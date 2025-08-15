import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import resumeRoutes from "./routes/resumeRoute.js";
import jobInfoRoutes from "./routes/jobInfoRoute.js";
import manageJobsRoutes from "./routes/manageJobsRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import connectDbB from "./config/db.js";

import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
//import {scrapeOnlineJobs} from "./scraper-onlinejobs.js";
import jobsInfo from "./models/jobsInfoModel.js";
import jobInfoRoute from "./routes/jobInfoRoute.js";

dotenv.config();
const app = express();

// Connect to DB
connectDbB();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // allow cookies to be sent
  })
);

// No sessions or Passport; pure JWT-based auth

// Routes
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({ dest: path.join(__dirname, "uploads") });

const jobs = [];

// Insert all 50 jobs
// jobsInfo.insertMany(jobs)
//     .then(() => {
//         console.log("50 unique IT job posts inserted successfully!");
//         mongoose.connection.close();
//     })
//     .catch((err) => {
//         console.error(err);
//         mongoose.connection.close();
//     });

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/resume", resumeRoutes);
app.use("/jobs", jobInfoRoutes);
app.use("/jobs", manageJobsRoutes);
app.use("/dashboard", manageJobsRoutes);
app.use("/admin", adminRoutes);

// Simple health check to verify server is up
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Centralized error handler to avoid dropping connections
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Server error" });
});

// Start server
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
