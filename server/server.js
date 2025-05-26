import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; // if using JWT in cookies
import connectDB from "./config/db.js";
import companyRoutes from "./routes/companyRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// 🔐 Enable CORS with credentials support
app.use(
  cors({
    origin: "http://localhost:3000", // frontend
    credentials: true,
  })
);

// 🌐 Middleware
app.use(express.json()); // Parse JSON body
app.use(cookieParser()); // Parse cookies

// 🔌 Connect to DB
connectDB();

// 🛣️ Routes
app.use("/api/companies", companyRoutes);
app.use("/api/auth", authRoutes);

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
