import Notification from "../models/Notification.js";
import aiService from "../services/ai/AIService.js";

export const processAI = async (notificationId) => {
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) return { decision: "NOW", reason: "Not found" };

    // Call Gemini Service
    const aiResult = await aiService.analyze(notification);

    // Update MongoDB with AI results
    notification.ai_processed = true;
    notification.ai_decision = aiResult.decision;
    notification.ai_confidence = aiResult.confidence;
    notification.status = aiResult.decision; // Override the status with AI choice
    notification.ai_reason = aiResult.reason;

    await notification.save();
    
    console.log(`✅ [AI Finalized] ID: ${notificationId} | Decision: ${aiResult.decision}`);
    
    return aiResult; // Return this to the controller

  } catch (error) {
    console.error("AI Processor Error:", error.message);
    return { decision: "NOW", reason: "AI processing failed" };
  }
};