const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Celebrity = require('./models/Celebrity'); // Ensure correct path

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Route 1: Search for celebrities by shoe size (Primary focus)
app.get('/api/celebrities', async (req, res) => {
  try {
    const { shoeSize } = req.query;
    if (!shoeSize || isNaN(shoeSize)) {
      return res.status(400).json({ message: 'Invalid shoe size' });
    }

    const parsedShoeSize = parseFloat(shoeSize);

    console.log("Parsed shoe size:", parsedShoeSize); // Log the parsed shoe size before querying

    const matchingCelebrities = await Celebrity.find({ shoeSize: parsedShoeSize });

    if (matchingCelebrities.length === 0) {
      console.log("No celebrities found with this shoe size.");  // Log if no matches found
      return res.status(404).json({ message: 'No celebrities found with this shoe size' });
    }

    console.log("Matching celebrities:", matchingCelebrities);  // Log the matching results
    res.json(matchingCelebrities);
  } catch (error) {
    console.error('Error fetching celebrities by shoe size:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route 2: Dynamic name search (Partial matches)
app.get('/api/search', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.json([]); // Return empty array if no name entered
    }

    const matches = await Celebrity.find({ name: { $regex: name, $options: 'i' } }) // Case-insensitive search
      .limit(10); // Limit results for performance

    res.json(matches);
  } catch (error) {
    console.error('Error fetching celebrity name matches:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route 3: Test database connection (ensure data is fetched)
app.get('/api/test-db', async (req, res) => {
  try {
    const celebrities = await Celebrity.find(); // Query all celebrities
    res.json(celebrities); // Send as JSON response
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Database query failed' });
  }
});

// Route 4: Add new celebrity (Insert into DB)
app.post('/api/celebrities', async (req, res) => {
  const { name, shoeSize, profession, imageUrl } = req.body;

  // Validate the required fields
  if (!name || !shoeSize) {
    return res.status(400).json({ message: 'Name and shoe size are required' });
  }

  try {
    // Create a new celebrity document
    const newCelebrity = new Celebrity({
      name,
      shoeSize,
      profession,
      imageUrl,
    });

    // Save the new celebrity to the database
    await newCelebrity.save();

    // Send success response with the created celebrity details
    res.status(201).json({
      message: 'Celebrity added successfully',
      celebrity: newCelebrity,
    });
  } catch (error) {
    console.error('Error adding new celebrity:', error);
    res.status(500).json({ message: 'Failed to add new celebrity' });
  }
});

// Route for Bulk Insert of Celebrities
app.post('/api/celebrities/bulk', async (req, res) => {
  console.log('Bulk insert request received');
  const celebritiesData = req.body;
  
  // Validate if the data is an array
  if (!Array.isArray(celebritiesData)) {
    return res.status(400).json({ message: 'The data must be an array' });
  }

  try {
    // Insert multiple celebrities
    const result = await Celebrity.insertMany(celebritiesData);
    res.status(201).json({ message: 'Celebrities added successfully', data: result });
  } catch (error) {
    console.error('Error inserting celebrities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route 5: for fetching a celebrity's details by their ID
app.get('/api/celebrities/:id', async (req, res) => {
  try {
    const { id } = req.params;  // Get the celebrity ID from the URL params
    const celebrity = await Celebrity.findById(id);  // Find the celebrity by their ID
    
    if (!celebrity) {
      return res.status(404).json({ message: 'Celebrity not found' });
    }
    
    res.json(celebrity);  // Send back the celebrity details as JSON
  } catch (error) {
    console.error('Error fetching celebrity details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route 5: Fetch a single celebrity by ID
app.get('/api/celebrities/:id', async (req, res) => {
  try {
    const celebrity = await Celebrity.findById(req.params.id);
    
    if (!celebrity) {
      return res.status(404).json({ message: 'Celebrity not found' });
    }

    res.json(celebrity);
  } catch (error) {
    console.error('Error fetching celebrity by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/footSizeComparison')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));
 
  /* was giving error message
mongoose.connect('mongodb://127.0.0.1:27017/footSizeComparison', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));*/

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
