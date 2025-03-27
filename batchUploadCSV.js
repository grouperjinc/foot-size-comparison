const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser'); // You need to install this dependency
const Celebrity = require('./models/Celebrity'); // Assuming you have a Celebrity model

// MongoDB connection string (replace with your own if necessary)
mongoose.connect('mongodb://127.0.0.1:27017/footSizeComparison')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Function to check if the celebrity already exists in the database by name and shoe size
const checkForDuplicate = async (celebrities) => {
  // Find all existing entries at once
  const existingCelebrities = await Celebrity.find({
    $or: celebrities.map(celebrity => ({ name: celebrity.name, shoeSize: celebrity.shoeSize }))
  });

  // Create a map to quickly check for duplicates
  const existingNamesAndSizes = new Set(existingCelebrities.map(celebrity => `${celebrity.name}_${celebrity.shoeSize}`));

  return celebrities.filter(celebrity => {
    return existingNamesAndSizes.has(`${celebrity.name}_${celebrity.shoeSize}`);
  });
};

// Function to validate CSV data
const validateData = (data) => {
  // Check for required fields (adjust based on your schema)
  if (!data.name || !data.shoeSize || !data.category) {
    return 'Missing required fields (name, shoeSize, category)';
  }

  // Ensure shoe size is a valid number
  if (isNaN(data.shoeSize)) {
    return 'Shoe size must be a valid number';
  }

  // You can add other validation checks (e.g., imageUrl format, category validity)
  return null;
};

// Function to batch upload celebrities from the CSV file
const batchUploadFromCSV = async (filePath) => {
  const celebritiesToInsert = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      // Validate the data in the CSV row
      const error = validateData(row);
      if (error) {
        console.error(`Skipping invalid row: ${error}`, row);
        return; // Skip invalid data
      }

      // Add valid data to the array
      celebritiesToInsert.push({
        name: row.name,
        shoeSize: parseFloat(row.shoeSize), // Convert shoeSize to number if necessary
        category: row.category,             // Assuming category is a valid value
        imageUrl: row.imageUrl || '',       // Default to empty string if no imageUrl
        bio: row.bio || '',                 // Default to empty string if no bio
      });
    })
    .on('end', async () => {
      if (celebritiesToInsert.length === 0) {
        console.log('No valid data to insert.');
        return;
      }

      // Check for duplicates before inserting
      const duplicates = await checkForDuplicate(celebritiesToInsert);
      if (duplicates.length > 0) {
        console.log(`Skipping ${duplicates.length} duplicate(s):`, duplicates);
      }

      // Filter out duplicates from the array before inserting
      const uniqueCelebrities = celebritiesToInsert.filter(celebrity => 
        !duplicates.some(dup => dup.name === celebrity.name && dup.shoeSize === celebrity.shoeSize)
      );

      if (uniqueCelebrities.length === 0) {
        console.log('No valid celebrities to insert after filtering duplicates.');
        return;
      }

      // Insert the valid data into the database
      try {
        const result = await Celebrity.insertMany(uniqueCelebrities, { ordered: false });
        console.log(`${result.length} celebrities inserted successfully.`);
      } catch (error) {
        console.error('Error inserting celebrities:', error);
      }
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
    });
};

// Specify the path to your CSV file here
const filePath = './celebrities.csv';  // Adjust path if necessary

// Start the batch upload process
batchUploadFromCSV(filePath);
