import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
// 1. Import your main app logic
import app from './app.js'; 

const PORT = process.env.PORT || 5000;

// 2. DATABASE CONNECTION (Keep this in server.js)
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error("❌ CRITICAL: MONGO_URI is missing!");
} else {
    mongoose.connect(mongoURI)
        .then(() => console.log("✅ CLUSTER ACCESS GRANTED"))
        .catch(err => console.error("❌ DB CONNECTION ERROR:", err));
}

// 3. START SERVER using the 'app' from app.js
// This pulls in all the CORS and /api/auth routes automatically
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NEURAL LINK ACTIVE ON PORT ${PORT}`);
});