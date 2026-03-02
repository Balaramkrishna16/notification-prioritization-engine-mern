import mongoose from "mongoose";

const SystemHealthSchema = new mongoose.Schema({
  ai_status: {
    type: String,
    enum: ["UP", "DOWN", "CIRCUIT_OPEN"],
    default: "UP"
  },

  failure_count: { type: Number, default: 0 },

  circuit_open_until: { type: Date, default: null },

  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model("SystemHealth", SystemHealthSchema);