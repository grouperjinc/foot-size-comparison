// backend/routes/celebrities.js
import express from 'express';
import Celebrity from '../models/Celebrity.js'; // Note the `.js` extension!
const router = express.Router();

// Add a new celebrity
router.post('/add', async (req, res) => {
  const { name, shoeSize, footImage } = req.body;
  const celebrity = new Celebrity({ name, shoeSize, footImage });

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
    const celebrities = await Celebrity.find({ shoeSize });
    res.json(celebrities);
  } catch (error) {
    console.error("Error during celebrity fetch:", error);
    res.status(400).json({ error: 'Error fetching celebrities' });
  }
});

export default router;
