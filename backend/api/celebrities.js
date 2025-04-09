console.log("📡 /api/celebrities called");

try {
  await dbConnect();
  console.log("✅ Connected to MongoDB");

  const Celebrity = (await import('../models/Celebrity.js')).default;
  console.log("📦 Model loaded");

  if (req.method === 'GET') {
    const { shoeSize } = req.query;
    console.log("🔍 shoeSize =", shoeSize);

    if (shoeSize) {
      const results = await Celebrity.find({ shoeSize });
      console.log("✅ Found:", results.length, "results");
      return res.status(200).json(results);
    }

    const results = await Celebrity.aggregate([{ $sample: { size: 10 } }]);
    console.log("🎲 Randomized sample:", results.length);
    return res.status(200).json(results);
  }

  if (req.method === 'POST') {
    const { name, shoeSize, image, category } = req.body;
    console.log("🆕 New entry:", { name, shoeSize, image, category });

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
