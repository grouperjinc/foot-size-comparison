const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Use the same MongoClient instance from server.js
const client = new MongoClient(process.env.MONGO_URI);

// Route to get all celebrities
router.get('/', async (req, res) => {
  try {
    // Connect to the database
    const database = client.db('celebrity-db'); // Replace with your actual database name
    const collection = database.collection('celebrities'); // Replace with your actual collection name
    
    // Query the database to get all celebrities
    const celebrityList = await collection.find().toArray();
    
    // Send the list of celebrities as the response
    res.json(celebrityList);
  } catch (error) {
    console.error('Error retrieving celebrities:', error);
    res.status(500).send('Error retrieving celebrities');
  }
});

module.exports = router;
