// backend/lib/dbConnect.js
import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI is not defined in environment variables");
  }

  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGO_URI, {
        bufferCommands: false,
        // You can add options like dbName here if needed
        // dbName: 'celebrity-db'
      });
    }

    cached.conn = await cached.promise;
    console.log("✅ Connected to MongoDB");
    return cached.conn;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
