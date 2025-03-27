const mongoose = require('mongoose');

const celebritySchema = new mongoose.Schema({
    name: { type: String, required: true },          // The name of the celebrity
    shoeSize: { type: Number, required: true },      // The celebrity's shoe size
    category: { type: String, enum: ['Actor', 'Athlete', 'Singer', 'Entertainment','Rapper','Music','Other'], required: true },  // Type of celebrity
    bio: { type: String, default: '' },              // Optional bio
    imageUrl: { type: String, default: '' },         // Optional image URL
  });

  const Celebrity = mongoose.model('Celebrity', celebritySchema);

  module.exports = Celebrity;
