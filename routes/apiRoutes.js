const express = require('express');
const router = express.Router();
const Celebrity = require('../models/Celebrity'); // Assuming you have a Celebrity model

// Route to find celebrities by shoe size
router.get('/celebrities', async (req, res) => {
  try {
    const { shoeSize } = req.query;
    if (!shoeSize) {
      return res.status(400).json({ message: 'Shoe size is required' });
    }

    const matchingCelebrities = await Celebrity.find({ shoeSize: parseInt(shoeSize) });
    res.json(matchingCelebrities);
  } catch (error) {
    console.error('Error fetching celebrities by shoe size:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
