import express from "express";
import { createNotification } from "../controllers/notificationController.js";
import { getMetrics } from "../controllers/metricsController.js";
import { getRules, createRule, deleteRule } from "../controllers/rulesController.js";
import { getAuditLogs } from "../controllers/auditController.js";
import { getLaterQueue } from "../controllers/queueController.js";
import { login } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import circuitBreaker from "../services/ai/CircuitBreaker.js";

const router = express.Router();

/**
 * @section Authentication
 * Logic: Matches frontend fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`)
 */
router.post("/auth/login", login);

/**
 * @section Dashboard & Metrics
 * Logic: Matches dashboard.js fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/metrics`)
 */
router.get("/notifications/metrics", protect, getMetrics);

/**
 * @section Event Ingestion
 * Logic: For the Simulator to send new events
 */
router.post("/notifications", createNotification);

/**
 * @section Protected Management Routes
 * Require "Authorization: Bearer <token>" header.
 */

// Audit Logs
router.get("/audit-logs", protect, getAuditLogs);

// Rules Management
router.get("/rules", protect, getRules);
router.post("/rules", protect, createRule);
router.delete("/rules/:id", protect, deleteRule);

// Queue Management (LATER bucket)
router.get("/queue/later", protect, getLaterQueue);

/**
 * @section System Health
 */
router.get("/health", (req, res) => {
  res.json({ 
    status: "UP", 
    ai_circuit: circuitBreaker.getState(), 
    timestamp: new Date() 
  });
});

export default router;