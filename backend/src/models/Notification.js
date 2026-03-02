import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  user_id: { type: String, required: true, index: true },

  event_type: { type: String, required: true, index: true },

  message: { type: String, required: true },

  source: { type: String },

  priority_hint: { type: Number, default: 0 },

  channel: { type: String },

  metadata: { type: Object },

  dedupe_key: { type: String, index: true },

  // 🆕 Required for LATER queue expiry checks
  expires_at: { type: Date, default: null },

  // ✅ Correctly implemented Soft Delete
  deleted_at: { type: Date, default: null },

  status: {
    type: String,
    enum: ["NOW", "LATER", "NEVER"],
    default: "LATER",
    index: true
  },

  // 🤖 AI Integration Fields
  ai_processed: { type: Boolean, default: false },
  ai_model: String,
  ai_confidence: Number,
  // 🆕 Store the specific decision the AI made
  ai_decision: { type: String, enum: ["NOW", "LATER", "NEVER"], default: null },
  ai_fallback_used: { type: Boolean, default: false },
  ai_error: String,

  // 🕒 Timestamp for ordering and metrics
  created_at: { type: Date, default: Date.now }

}, { timestamps: true }); // Automatically manages createdAt and updatedAt

export default mongoose.model("Notification", NotificationSchema);