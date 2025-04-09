import dbConnect from '../lib/dbConnect.js';

export default async function handler(req, res) {
  console.log("📡 /api/celebrities called");

  try {
    await dbConnect();
    const Celebrity = (await import('../models/Celebrity.js')).default;

    if (req.method === 'GET') {
      const { shoeSize } = req.query;

      if (shoeSize) {
        const results = await Celebrity.find({ shoeSize });
        return res.status(200).json(results);
      }

      const results = await Celebrity.aggregate([{ $sample: { size: 10 } }]);
      return res.status(200).json(results);
    }

    if (req.method === 'POST') {
      const { name, shoeSize, image, category } = req.body;

      const newCelebrity = new Celebrity({ name, shoeSize, image, category });
      await newCelebrity.save();
      return res.status(201).json(newCelebrity);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('💥 Error in /api/celebrities:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
