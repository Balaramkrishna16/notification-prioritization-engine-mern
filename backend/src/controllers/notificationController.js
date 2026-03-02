import Notification from "../models/Notification.js";

export const createNotification = async (req, res) => {
  try {
    const { title, body, source } = req.body;

    // AI Classification logic would go here. 
    // For now, we'll simulate an AI decision.
    const classifications = ['NOW', 'LATER', 'NEVER'];
    const aiDecision = classifications[Math.floor(Math.random() * 3)];

    const newNotification = new Notification({
      title,
      body,
      source: source || 'Simulator',
      classification: aiDecision,
      confidence: 0.95,
      createdAt: new Date()
    });

    await newNotification.save();

    res.status(201).json({
      success: true,
      data: newNotification
    });
  } catch (error) {
    res.status(500).json({ message: "Notification Dispatch Error" });
  }
};