console.log("🚀 [id] route STARTED");

import dbConnect from '../../lib/dbConnect.js';
import addSecurityHeaders from '../../middleware/securityHeaders.js';
import rateLimit from '../../middleware/rateLimit.js';
import handleCors from '../../middleware/cors.js';

export default async function handler(req, res) {
  console.log("📡 GET /api/celebrities/[id] called");

  addSecurityHeaders(res);
  if (!handleCors(req, res)) return;
  if (!rateLimit(req, res)) return;

  await dbConnect();
  const Celebrity = (await import('../../models/Celebrity.js')).default;

  const {
    query: { id },
    method,
  } = req;

  if (method === 'GET') {
    try {
      const celeb = await Celebrity.findById(id).lean(); // Use lean() for plain object

      if (!celeb) {
        return res.status(404).json({ error: 'Celebrity not found' });
      }

      // Ensure shoeSize is a number
      if (
        celeb.shoeSize &&
        typeof celeb.shoeSize === 'object' &&
        typeof celeb.shoeSize.toString === 'function'
      ) {
        celeb.shoeSize = parseFloat(celeb.shoeSize.toString());
      }

      console.log(`✅ Returning ${celeb.name} with size ${celeb.shoeSize}`);
      return res.status(200).json({
        _id: celeb._id,
        name: celeb.name,
        shoeSize: celeb.shoeSize,
        image: celeb.image,
        category: celeb.category,
        funFact: celeb.funFact || '', // ✅ Add this line explicitly
      });

    } catch (err) {
      console.error("❌ Error fetching celebrity by ID:", err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
