import cron from "node-cron";
import Notification from "../models/Notification.js";
import decisionEngine from "../services/decision/DecisionEngine.js";

export function startLaterQueueProcessor() {
  // 🕒 Runs every 5 minutes to re-evaluate deferred events
  cron.schedule("*/5 * * * *", async () => {
    console.log("--- 🕒 Running LATER Queue Re-evaluation ---");

    try {
      // 1️⃣ Fetch pending notifications
      // Exclude soft-deleted items and only pick those already processed by AI
      const laterNotifications = await Notification.find({
        status: "LATER",
        ai_processed: true,
        deleted_at: null 
      }).limit(50); // Increased batch size for better throughput

      for (let notification of laterNotifications) {
        try {
          // 2️⃣ Expiry Check: Mandatory for LATER queue cleanup
          if (notification.expires_at && notification.expires_at < new Date()) {
            notification.status = "NEVER";
            await notification.save();
            console.log(`[Expired] ID: ${notification._id} -> NEVER`);
            continue; // Skip further re-evaluation if expired
          }

          // 3️⃣ Re-evaluate Decision
          // The engine checks if Fatigue limits or Rules have changed
          const result = await decisionEngine.evaluate(notification);

          // 4️⃣ Update status only if the engine gives a clear new direction
          if (result.decision !== "LATER") {
            notification.status = result.decision;
            await notification.save();
            console.log(`[Re-classified] ID: ${notification._id} -> ${result.decision}`);
          }

        } catch (error) {
          console.error(`Error re-evaluating notification ${notification._id}:`, error.message);
        }
      }

    } catch (error) {
      console.error("LATER queue critical error:", error.message);
    }
  });
}