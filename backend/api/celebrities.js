// backend/api/celebrities.js
import dbConnect from '../lib/dbConnect.js';
import Celebrity from '../models/Celebrity.js';

export default async function handler(req, res) {
  console.log("📡 /api/celebrities called");

  try {
    await dbConnect();

    if (req.method === 'GET') {
      const { shoeSize } = req.query;

      let results;
      if (shoeSize) {
        results = await Celebrity.find({ shoeSize: Number(shoeSize) });
      } else {
        results = await Celebrity.aggregate([{ $sample: { size: 10 } }]);
      }

      return res.status(200).json(results);
    }

    if (req.method === 'POST') {
      const { name, shoeSize, image, category } = req.body;
      const newCelebrity = new Celebrity({ name, shoeSize, image, category });
      await newCelebrity.save();
      return res.status(201).json(newCelebrity);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);

  } catch (err) {
    console.error('💥 Error in /api/celebrities:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
