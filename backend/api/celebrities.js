import dbConnect from '../lib/dbConnect.js';
import Celebrity from '../models/Celebrity.js';

export default async function handler(req, res) {
  console.log("📡 Celebrities API called");

  try {
    await dbConnect();
    console.log("✅ Connected to MongoDB");

    const { method } = req;

    if (method === 'GET') {
      const { shoeSize } = req.query;

      if (shoeSize) {
        const results = await Celebrity.find({ shoeSize });
        return res.status(200).json(results);
      } else {
        const random = await Celebrity.aggregate([{ $sample: { size: 10 } }]);
        return res.status(200).json(random);
      }

    } else if (method === 'POST') {
      const { name, shoeSize, image, category } = req.body;

      const newCeleb = new Celebrity({ name, shoeSize, image, category });
      await newCeleb.save();
      return res.status(201).json(newCeleb);

    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }

  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: 'Server error' });
  }
}
