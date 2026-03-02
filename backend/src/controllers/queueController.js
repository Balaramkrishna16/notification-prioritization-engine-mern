import Notification from "../models/Notification.js";

/**
 * Fetch notifications currently in the LATER queue
 */
export const getLaterQueue = async (req, res) => {
  try {
    // Fetch notifications that are deferred and not yet soft-deleted
    const queue = await Notification.find({ 
      status: "LATER", 
      deleted_at: null 
    })
    .sort({ created_at: -1 });

    res.json(queue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};