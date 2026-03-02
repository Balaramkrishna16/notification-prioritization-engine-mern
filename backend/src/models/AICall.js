import mongoose from "mongoose";

const AICallSchema = new mongoose.Schema({
  notification_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notification",
    required: true
  },

  model_name: { type: String },

  confidence: { type: Number },

  raw_response: { type: Object },

  fallback_used: { type: Boolean, default: false },

  status: {
    type: String,
    enum: ["SUCCESS", "FAILED"],
    default: "SUCCESS"
  },

  created_at: { type: Date, default: Date.now }

});

export default mongoose.model("AICall", AICallSchema);