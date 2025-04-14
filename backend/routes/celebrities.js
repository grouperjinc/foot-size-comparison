// backend/routes/celebrities.js
import express from 'express';
import Celebrity from '../models/Celebrity.js'; // Note the `.js` extension!
const router = express.Router();

// Add a new celebrity
router.post('/add', async (req, res) => {
  const { name, shoeSize, category } = req.body; // Removed 'footImage'
  const celebrity = new Celebrity({ name, shoeSize, category }); // Removed 'footImage'

  try {
    await celebrity.save();
    res.status(201).json(celebrity);
  } catch (error) {
    res.status(400).json({ error: 'Error saving celebrity' });
  }
});

// Get celebrities by shoe size
router.get('/', async (req, res) => {
  const { shoeSize } = req.query;

  try {
    // Ensure shoeSize is a float value
    const size = parseFloat(shoeSize);

    if (isNaN(size)) {
      return res.status(400).json({ error: 'Invalid shoe size' });
    }

    // Query for celebrities with shoe sizes within a ±0.5 range
    const celebrities = await Celebrity.find({
      shoeSize: {
        $gte: size - 0.5,  // Allow up to 0.5 smaller
        $lte: size + 0.5   // Allow up to 0.5 larger
      }
    }).select('-image'); // Exclude the image field to prevent unnecessary data

    console.log("Shoe size requested:", shoeSize);
    res.json(celebrities);
  } catch (error) {
    console.error("Error during celebrity fetch:", error);
    res.status(400).json({ error: 'Error fetching celebrities' });
  }
});

export default router;
