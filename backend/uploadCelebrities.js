import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';

mongoose.connect('mongodb+srv://readwriteuser:oWFBe0sXH6E8Xz2X@celebrity-cluster.qas2zsj.mongodb.net/celebrity-db?retryWrites=true&w=majority&appName=celebrity-cluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Error connecting to MongoDB:', err));

// Remove the 'image' field from the schema
const celebritySchema = new mongoose.Schema({
  name: String,
  shoeSize: Number,
  category: String,
  // Remove image field
});

const Celebrity = mongoose.model('Celebrity', celebritySchema);

const uploadCelebrities = () => {
  const results = [];

  fs.createReadStream('celebrities.csv') // Path to your CSV file
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const celebrity of results) {
          // Check if the celebrity already exists
          const existingCelebrity = await Celebrity.findOne({ name: celebrity.name });

          if (!existingCelebrity) {
            // Create a new celebrity entry without the image field
            const newCelebrity = new Celebrity({
              name: celebrity.name,
              shoeSize: parseInt(celebrity.shoeSize), // Ensure it's a number
              category: celebrity.category,
              // No image field
            });

            await newCelebrity.save();
            console.log(`Added celebrity: ${celebrity.name}`);
          } else {
            console.log(`Celebrity ${celebrity.name} already exists.`);
          }
        }
        console.log('Upload finished!');
      } catch (error) {
        console.error('Error uploading celebrities:', error);
      }
    });
};

uploadCelebrities();
