import express from 'express';
import Celebrity from '../models/Celebrity.js'; // Import the Celebrity model
import { Decimal128 } from 'mongodb'; // Import Decimal128 for precision handling
const router = express.Router();

// Get celebrities by shoe size
router.get('/', async (req, res) => {
  const { shoeSize } = req.query;

  try {
    // Ensure shoeSize is a float value
    const size = parseFloat(shoeSize);  // Convert to float for range calculation
    console.log(`Received shoe size: ${shoeSize}, parsed as: ${size}`); // Log the received shoe size

    if (isNaN(size)) {
      console.error('Invalid shoe size:', shoeSize);
      return res.status(400).json({ error: 'Invalid shoe size' });
    }

    // Convert the size to Decimal128 for proper comparison in the query
    const minSize = Decimal128.fromString((size - 0.5).toString());
    const maxSize = Decimal128.fromString((size + 0.5).toString());

    // Log the query range
    console.log(`Querying for shoe sizes between: ${minSize.toString()} and ${maxSize.toString()}`);

    // Query for celebrities with shoe sizes within ±0.5 range
    const celebrities = await Celebrity.find({
      shoeSize: {
        $gte: minSize,
        $lte: maxSize
      }
    }).select('-image');  // Exclude the image field

    console.log("Found celebrities:", celebrities); // Log the result

    res.json(celebrities);
  } catch (error) {
    console.error("Error during celebrity fetch:", error);
    res.status(400).json({ error: 'Error fetching celebrities' });
  }
});

export default router;
