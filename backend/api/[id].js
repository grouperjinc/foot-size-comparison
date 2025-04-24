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
      const celeb = await Celebrity.findById(id).lean(); // ✅ Convert to plain JS object
      if (!celeb) {
        return res.status(404).json({ error: 'Celebrity not found' });
      }

      // ✅ Convert Decimal128 to plain number
      celeb.shoeSize = parseFloat(celeb.shoeSize?.toString?.() ?? '0');

      return res.status(200).json(celeb);
    } catch (err) {
      console.error("❌ Error fetching celebrity by ID:", err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
