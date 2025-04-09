// backend/lib/dbConnect.js
import mongoose from 'mongoose';

let isConnected = false;

export default async function dbConnect() {
  if (isConnected) {
    console.log("✅ Using existing DB connection");
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI is not defined in environment variables");
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
