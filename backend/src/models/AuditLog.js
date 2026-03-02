import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  notification_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notification",
    required: true,
    index: true
  },

  decision: {
    type: String,
    enum: ["NOW", "LATER", "NEVER"],
    required: true
  },

  reason: { type: String, required: true },

  rule_triggered: { type: String, default: null },

  ai_used: { type: Boolean, default: false },

  fallback_used: { type: Boolean, default: false },

  timestamp: { type: Date, default: Date.now }

});

export default mongoose.model("AuditLog", AuditLogSchema);