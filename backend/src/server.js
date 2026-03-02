import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Start the Server IMMEDIATELY (Crucial for Render)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NEURAL LINK ACTIVE ON PORT ${PORT}`);
});

// 3. Connect to Database in the background
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ CLUSTER ACCESS GRANTED"))
    .catch(err => console.error("❌ DB CONNECTION ERROR:", err));

// 4. Routes
// app.use('/api', notificationRoutes);