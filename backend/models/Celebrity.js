import mongoose from 'mongoose';

// Define the Celebrity schema
const celebritySchema = new mongoose.Schema({
  name: { type: String, required: true },
  shoeSize: { 
    type: mongoose.Schema.Types.Decimal128, 
    required: true, 
    index: true 
  },
  category: { type: String, required: true },
  funFact: { type: String, default: '' } // ✅ Add this line for the fun fact
});

// Create the Celebrity model using the schema
const Celebrity = mongoose.model('Celebrity', celebritySchema);

export default Celebrity;
