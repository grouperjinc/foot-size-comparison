import mongoose from 'mongoose';

// Define the Celebrity schema
const celebritySchema = new mongoose.Schema({
  name: { type: String, required: true },  // Name of the celebrity
  shoeSize: { 
    type: mongoose.Schema.Types.Decimal128, 
    required: true, 
    index: true  // Create an index for shoeSize for faster searches
  },
  category: { type: String, required: true },  // Category (e.g., Actor, Musician, etc.)
});

// Create the Celebrity model using the schema
const Celebrity = mongoose.model('Celebrity', celebritySchema);

// Export the model for use in other parts of the app
export default Celebrity;
