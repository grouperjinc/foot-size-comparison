// backend/models/Celebrity.js
import mongoose from 'mongoose';

const celebritySchema = new mongoose.Schema({
  name: String,
  shoeSize: Number,
  image: String,
  category: String, // Actor, Athlete, Music, etc.
});


// what I am doing for serverless testing
export default mongoose.models.Celebrity || mongoose.model('Celebrity', CelebritySchema);

/* what I had before serverless
const Celebrity = mongoose.model('Celebrity', celebritySchema);
export default Celebrity;
*/