import dbConnect from '../lib/dbConnect.js';
import addSecurityHeaders from '../middleware/securityHeaders.js';
import rateLimit from '../middleware/rateLimit.js';
import handleCors from '../middleware/cors.js';

export default async function handler(req, res) {
  console.log("🔍 /api/search called");

  addSecurityHeaders(res);
  if (!handleCors(req, res)) return;
  if (!rateLimit(req, res)) return;

  try {
    await dbConnect();

    const Celebrity = (await import('../models/Celebrity.js')).default;

    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: "Missing name query parameter" });
    }

    const regex = new RegExp(name, 'i'); // case-insensitive match
    const results = await Celebrity.find({ name: regex }).limit(10);

    console.log(`✅ Found ${results.length} match(es)`);
    return res.status(200).json(results);
  } catch (err) {
    console.error("❌ Error in /api/search:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
