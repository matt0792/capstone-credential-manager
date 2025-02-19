import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import divisionRoutes from "./routes/divisionRoutes.js";
import ouRoutes from "./routes/ouRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/employee", employeeRoutes);
app.use("/api/division", divisionRoutes);
app.use("/api/ou", ouRoutes);
app.use("/api/auth", authRoutes);

export default app;
