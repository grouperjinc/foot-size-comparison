// backend/routes/celebrities.js
import express from 'express';
import Celebrity from '../models/Celebrity.js';
import { Decimal128 } from 'mongodb';
const router = express.Router();

// Get celebrities by shoe size
router.get('/', async (req, res) => {
  const { shoeSize } = req.query;

  try {
    const size = parseFloat(shoeSize); // Convert to float for range calculation
    console.log(`Received shoe size: ${shoeSize}, parsed as: ${size}`); // Log the received shoe size

    if (isNaN(size)) {
      return res.status(400).json({ error: 'Invalid shoe size' });
    }

    // Create Decimal128 values for the range
    const minSize = Decimal128.fromString((size - 0.5).toString());
    const maxSize = Decimal128.fromString((size + 0.5).toString());

    // Log the range being queried
    console.log(`Querying for shoe sizes between: ${minSize.toString()} and ${maxSize.toString()}`);

    // Query for celebrities with shoe sizes within ±0.5 range
    const celebrities = await Celebrity.find({
      shoeSize: {
        $gte: minSize,
        $lte: maxSize
      }
    }).select('-image');  // Exclude the image field

    // Log the results returned by the database
    console.log("Found celebrities with shoe sizes within range:", celebrities);

    res.json(celebrities); // Send the celebrities back to the frontend
  } catch (error) {
    console.error('Error during celebrity fetch:', error);
    res.status(400).json({ error: 'Error fetching celebrities' });
  }
});

export default router;
