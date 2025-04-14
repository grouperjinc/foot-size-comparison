// backend/models/Celebrity.js
import mongoose from 'mongoose';

const celebritySchema = new mongoose.Schema({
  name: String,
  shoeSize: { type: Number, index: true }, // Index on shoeSize for faster queries
  category: String,
  image: String
});


const Celebrity = mongoose.model('Celebrity', celebritySchema);

export default Celebrity;

/* what I had before serverless
const Celebrity = mongoose.model('Celebrity', celebritySchema);
export default Celebrity;
*/


