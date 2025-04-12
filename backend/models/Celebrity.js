// backend/models/Celebrity.js
import mongoose from 'mongoose';

const celebritySchema = new mongoose.Schema({
  name: String,
  shoeSize: Number,
  category: String,
  // Removed 'image' or 'footImage' field
});

const Celebrity = mongoose.model('Celebrity', celebritySchema);

export default Celebrity;

/* what I had before serverless
const Celebrity = mongoose.model('Celebrity', celebritySchema);
export default Celebrity;
*/


