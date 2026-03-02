import mongoose from "mongoose";

const FatigueSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },

  count_last_hour: { type: Number, default: 0 },

  last_event_time: { type: Date, default: Date.now }

});

export default mongoose.model("Fatigue", FatigueSchema);