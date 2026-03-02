import mongoose from "mongoose";

const RuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  // e.g., { "event_type": "SECURITY" }
  condition_json: { type: Object, required: true }, 
  // e.g., "FORCE_NOW", "ADJUST_PRIORITY"
  action: { type: String, required: true }, 
  priority_adjustment: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  deleted_at: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model("Rule", RuleSchema);