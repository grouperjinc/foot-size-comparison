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
    console.log("Shoe size requested:", shoeSize);
    // Fetch celebrities without the 'footImage' field
    const celebrities = await Celebrity.find({ shoeSize }).select('-image'); // Exclude the image field
    res.json(celebrities);
  } catch (error) {
    console.error("Error during celebrity fetch:", error);
    res.status(400).json({ error: 'Error fetching celebrities' });
  }
});

export default router;
