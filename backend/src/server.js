import mongoose from "mongoose";
import dotenvFlow from "dotenv-flow";
import dns from "dns";
import app from "./app.js";

dotenvFlow.config();

// Force IPv4 resolution
dns.setDefaultResultOrder("ipv4first");

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
})
.then(() => {
  console.log("✅ MongoDB Connected");

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error("❌ DB Connection Error:", err);
});

