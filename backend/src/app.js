import express from "express";
import cors from "cors";
import notificationRoutes from "./routes/notificationRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // 👈 1. Import your auth routes
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { startLaterQueueProcessor } from "./jobs/laterQueueProcessor.js";

const app = express();

// --- 1. GLOBAL MIDDLEWARE ---
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));

app.use(express.json());

// --- 2. ROUTES ---
app.use("/api", notificationRoutes);
app.use("/api/auth", authRoutes); // 👈 2. Mount the auth routes here

// --- 3. ERROR HANDLING ---
app.use(errorHandler);

// --- 4. BACKGROUND JOBS ---
startLaterQueueProcessor();

export default app;