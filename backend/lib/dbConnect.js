// backend/lib/dbConnect.js
import mongoose from 'mongoose';

let isConnected = false; // global cache

export default async function dbConnect() {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI not set in environment variables");
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}
