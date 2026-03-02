import express from "express";
import cors from "cors";
import notificationRoutes from "./routes/notificationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { startLaterQueueProcessor } from "./jobs/laterQueueProcessor.js";

const app = express();

// --- 1. GLOBAL MIDDLEWARE ---
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
    // 🛡️ Added your primary Vercel URL
    "https://notification-prioritization-engine-tau.vercel.app", 
    // 🛡️ Keeping your git-specific URL just in case
    "https://notification-prioritizati-git-a87795-krishnas-projects-45bcd286.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// --- 2. ROUTES ---
app.use("/api", notificationRoutes);
app.use("/api/auth", authRoutes);

// --- 3. ERROR HANDLING ---
app.use(errorHandler);

// --- 4. BACKGROUND JOBS ---
startLaterQueueProcessor();

export default app;