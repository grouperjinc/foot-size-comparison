// backend/routes/celebrities.js
const express = require('express');
const Celebrity = require('../models/Celebrity');
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
    const celebrities = await Celebrity.find({ shoeSize });
    res.json(celebrities);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching celebrities' });
  }
});

module.exports = router;
