import natural from "natural";
import Notification from "../../../models/Notification.js";

class NearDedupeStrategy {
  async execute(notification) {

    const recent = await Notification.find({
      user_id: notification.user_id,
      created_at: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
    });

    for (let item of recent) {
      const similarity = natural.JaroWinklerDistance(
        notification.message,
        item.message
      );

      if (similarity > 0.85) {
        return {
          decision: "NEVER",
          reason: "Near duplicate detected",
          stopProcessing: true
        };
      }
    }

    return null;
  }
}

export default NearDedupeStrategy;