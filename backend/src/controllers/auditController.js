import Notification from "../models/Notification.js";

export const getAuditLogs = async (req, res) => {
  try {
    // Fetches the last 50 events, newest first
    const logs = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50);

    // Map DB fields to match frontend expectations
    const formattedLogs = logs.map(log => ({
      _id: log._id,
      createdAt: log.createdAt,
      event_type: log.event_type || "GENERAL",
      decision: log.classification, // Ensure this matches your DB field
      reason: log.reason || "Processed by Gemini Neural Engine"
    }));

    res.json(formattedLogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve intelligence logs" });
  }
};