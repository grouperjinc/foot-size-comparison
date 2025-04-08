// backend/models/Celebrity.js
import mongoose from 'mongoose';

const celebritySchema = new mongoose.Schema({
  name: String,
  shoeSize: Number,
  image: String,
  category: String, // Actor, Athlete, Music, etc.
});

const Celebrity = mongoose.model('Celebrity', celebritySchema);
export default Celebrity;
