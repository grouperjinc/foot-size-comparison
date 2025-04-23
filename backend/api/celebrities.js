import dbConnect from '../lib/dbConnect.js';
import addSecurityHeaders from '../middleware/securityHeaders.js';
import rateLimit from '../middleware/rateLimit.js';
import handleCors from '../middleware/cors.js';
import { Decimal128 } from 'mongodb';

export default async function handler(req, res) {
  console.log("📡 /api/celebrities called");

  addSecurityHeaders(res);
  if (!handleCors(req, res)) return;
  if (!rateLimit(req, res)) return;

  try {
    await dbConnect();

    const Celebrity = (await import('../models/Celebrity.js')).default;

    if (req.method === 'GET') {
      const { shoeSize } = req.query;

      if (shoeSize) {
        const size = parseFloat(shoeSize);
        if (isNaN(size)) {
          return res.status(400).json({ error: 'Invalid shoeSize parameter' });
        }

        const lower = Decimal128.fromString((size - 0.5).toString());
        const upper = Decimal128.fromString((size + 0.5).toString());

        const results = await Celebrity.find({
          shoeSize: { $gte: lower, $lte: upper }
        });

        return res.status(200).json(results);
      }

      // Default: return 10 random celebrities
      const results = await Celebrity.aggregate([{ $sample: { size: 10 } }]);
      return res.status(200).json(results);
    }

    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('❌ Error in /api/celebrities:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
