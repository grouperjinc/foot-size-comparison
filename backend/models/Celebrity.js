import mongoose from 'mongoose';

const celebritySchema = new mongoose.Schema({
  name: String,
  shoeSize: Number,
  footImage: String,
});

const Celebrity = mongoose.model('Celebrity', celebritySchema);

export default Celebrity;
