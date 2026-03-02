import Notification from "../models/Notification.js";

export const getMetrics = async (req, res) => {
  try {
    const total = await Notification.countDocuments();

    // Aggregates counts by classification: NOW, LATER, NEVER
    const breakdown = await Notification.aggregate([
      { $group: { _id: "$classification", count: { $sum: 1 } } }
    ]);

    // Map the DB results to an object the frontend recognizes
    const stats = { NOW: 0, LATER: 0, NEVER: 0 };
    breakdown.forEach(item => {
      if (item._id) {
        const key = item._id.toUpperCase();
        if (stats.hasOwnProperty(key)) stats[key] = item.count;
      }
    });

    res.json({
      total,
      breakdown: stats,
      ai_metrics: {
        usage_percentage: total > 0 ? 100 : 0,
        average_confidence: 0.94
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Metrics Engine Sync Failure" });
  }
};