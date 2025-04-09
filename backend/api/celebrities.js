import dbConnect from '../lib/dbConnect.js';
import addSecurityHeaders from '../middleware/securityHeaders.js';
import rateLimit from '../middleware/rateLimit.js';
import handleCors from '../middleware/cors.js';

export default async function handler(req, res) {
  console.log("📡 /api/celebrities called");

  // ✅ Set security headers
  addSecurityHeaders(res);

  // ✅ Handle CORS (optional, but helps with browser-based access)
  if (!handleCors(req, res)) return;

  // ✅ Basic rate-limiting
  if (!rateLimit(req, res)) return;

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

    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('❌ Error in /api/celebrities:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
