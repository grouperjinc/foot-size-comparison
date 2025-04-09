import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dbConnect from '../lib/dbConnect.js';

export default async function handler(req, res) {
  console.log("📡 Celebrities API called");

  try {
    await dbConnect(); // <-- this connects to MongoDB
    console.log("✅ Connected to DB");

    if (req.method === 'GET') {
      const { shoeSize } = req.query;

      const Celebrity = (await import('../models/Celebrity.js')).default;

      if (shoeSize) {
        const celebrities = await Celebrity.find({ shoeSize });
        return res.status(200).json(celebrities);
      } else {
        const celebrities = await Celebrity.aggregate([{ $sample: { size: 10 } }]);
        return res.status(200).json(celebrities);
      }
    }

    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("❌ Error in handler:", err);
    res.status(500).json({ error: 'Server error' });
  }
}


dotenv.config();

// MongoDB connection
if (!mongoose.connection.readyState) {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// Define schema and model
const celebritySchema = new mongoose.Schema({
  name: String,
  shoeSize: Number,
  image: String,
  category: String,
});

const Celebrity = mongoose.models.Celebrity || mongoose.model('Celebrity', celebritySchema);

// Main handler function
export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { shoeSize } = req.query;

    if (!shoeSize) {
      return res.status(400).json({ error: 'shoeSize is required' });
    }

    try {
      const celebrities = await Celebrity.find({ shoeSize });
      res.status(200).json(celebrities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch celebrities' });
    }
  } else if (method === 'POST') {
    const { name, shoeSize, image, category } = req.body;

    try {
      const celebrity = new Celebrity({ name, shoeSize, image, category });
      await celebrity.save();
      res.status(201).json(celebrity);
    } catch (error) {
      res.status(400).json({ error: 'Failed to add celebrity' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
