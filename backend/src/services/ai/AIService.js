import { GoogleGenerativeAI } from "@google/generative-ai";
import circuitBreaker from "./CircuitBreaker.js";

class AIService {
  async analyze(notification) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || !circuitBreaker.canExecute()) {
      return this.getFallbackDecision(notification, !apiKey ? "Missing Key" : "Circuit Open");
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      
      /** * 🚀 2026 UPDATE: 
       * 'gemini-1.5-flash' is sunset. 
       * Use 'gemini-2.5-flash-lite' for the best speed and reliability.
       */
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

      const prompt = `
        Classify this notification into NOW, LATER, or NEVER.
        Type: ${notification.event_type}
        Message: ${notification.message}

        Return ONLY a JSON object:
        {
          "decision": "NOW",
          "confidence": 0.98,
          "reason": "Explain why in 5 words"
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanJson = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      circuitBreaker.recordSuccess();

      return {
        decision: parsed.decision || "NOW",
        confidence: parsed.confidence || 0.97,
        model: "gemini-2.5-flash-lite",
        fallback: false,
        reason: parsed.reason
      };

    } catch (error) {
      // Log the specific error to help us debug 2026 API changes
      console.error("Gemini 2026 Error:", error.message);
      circuitBreaker.recordFailure();
      return this.getFallbackDecision(notification, "Gemini Request Failed");
    }
  }

  getFallbackDecision(notification, reason) {
    console.log(`🚀 Applying Fallback [${reason}] for: ${notification.event_type}`);
    const isHighPriority = ["SECURITY", "URGENT"].includes(notification.event_type);
    
    return {
      decision: isHighPriority ? "NOW" : "LATER",
      confidence: 0.5, // This is why your dashboard shows 0.5
      model: "rule-engine-v1",
      fallback: true,
      reason: `Fallback: ${reason}`
    };
  }
}

export default new AIService();