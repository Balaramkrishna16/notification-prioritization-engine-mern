import Fatigue from "../../../models/Fatigue.js";

class FatigueStrategy {
  async execute(notification) {
    const ONE_HOUR_AGO = new Date(Date.now() - 60 * 60 * 1000);

    // 1️⃣ Attempt to increment only if the last activity was within the last hour
    let record = await Fatigue.findOneAndUpdate(
      { 
        user_id: notification.user_id,
        last_event_time: { $gte: ONE_HOUR_AGO } 
      },
      { 
        $inc: { count_last_hour: 1 }, 
        $set: { last_event_time: new Date() } 
      },
      { new: true }
    );

    // 2️⃣ If no recent record exists, reset the counter to 1
    // This handles both new users and users who haven't received a notification in > 1 hour.
    if (!record) {
      record = await Fatigue.findOneAndUpdate(
        { user_id: notification.user_id },
        { 
          $set: { 
            count_last_hour: 1, 
            last_event_time: new Date() 
          } 
        },
        { upsert: true, new: true }
      );
    }

    // 3️⃣ Threshold Check
    // The challenge requires tracking per-user frequency to reduce alert fatigue.
    if (record.count_last_hour > 10) {
      return {
        decision: "LATER",
        reason: "User fatigue threshold exceeded (Max 10/hr)",
        stopProcessing: false // Allow priority adjustment to still occur if needed
      };
    }

    return null;
  }
}

export default FatigueStrategy;