import Notification from "../../../models/Notification.js";

class ExactDedupeStrategy {
  async execute(notification) {
    const oneMinAgo = new Date(Date.now() - 60000);
    
    // Use optional chaining ?. to prevent the "Cannot read message" error
    const messageContent = notification.content?.message || "";

    const duplicate = await Notification.findOne({
      user_id: notification.user_id,
      "content.message": messageContent,
      createdAt: { $gte: oneMinAgo }
    });

    if (duplicate && messageContent !== "") {
      return {
        decision: "NEVER",
        reason: "Duplicate detected within 60s",
        stopProcessing: true
      };
    }
    return null;
  }
}
export default ExactDedupeStrategy;