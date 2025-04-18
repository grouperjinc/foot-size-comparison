import express from 'express';
import Celebrity from '../models/Celebrity.js';
import { Decimal128 } from 'mongodb';

const router = express.Router();

// Get celebrities by shoe size
router.get('/', async (req, res) => {
  const { shoeSize } = req.query;

  try {
    const size = parseFloat(shoeSize);  // Convert to float for range calculation
    console.log(`Received shoe size: ${shoeSize}, parsed as: ${size}`); // Log received shoe size

    if (isNaN(size)) {
      return res.status(400).json({ error: 'Invalid shoe size' });
    }

    const minSize = Decimal128.fromString((size - 0.5).toString());
    const maxSize = Decimal128.fromString((size + 0.5).toString());

    // Log the range being queried
    console.log(`Querying for shoe sizes between: ${minSize.toString()} and ${maxSize.toString()}`);

    const celebrities = await Celebrity.find({
      shoeSize: {
        $gte: minSize,
        $lte: maxSize
      }
    }).select('-image');  // Exclude the image field

    // Convert Decimal128 to string before sending to the frontend
    const celebritiesWithSize = celebrities.map((celeb) => ({
      ...celeb.toObject(),
      shoeSize: celeb.shoeSize.toString()  // Convert Decimal128 to string
    }));

    console.log("Found celebrities:", celebritiesWithSize);

    res.json(celebritiesWithSize);
  } catch (error) {
    console.error('Error during celebrity fetch:', error);
    res.status(400).json({ error: 'Error fetching celebrities' });
  }
});

export default router;
