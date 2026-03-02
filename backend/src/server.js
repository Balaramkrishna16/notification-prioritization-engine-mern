import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

// Import your routes here (uncomment when ready)
// import notificationRoutes from './routes/notificationRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// 1. MIDDLEWARE 
// Combine your CORS settings into one block
app.use(cors({
  origin: [
    "https://notification-prioritization-engine-tau.vercel.app", 
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 2. ROUTES
// app.use('/api', notificationRoutes);

// 3. DATABASE CONNECTION
// We keep the URI check to avoid the "undefined" error you saw earlier
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error("❌ CRITICAL: MONGO_URI is missing from Environment Variables!");
} else {
    mongoose.connect(mongoURI)
        .then(() => console.log("✅ CLUSTER ACCESS GRANTED"))
        .catch(err => console.error("❌ DB CONNECTION ERROR:", err));
}

// 4. START SERVER
// Binding to 0.0.0.0 is correct for Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NEURAL LINK ACTIVE ON PORT ${PORT}`);
});