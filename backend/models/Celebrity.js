// backend/models/Celebrity.js
const mongoose = require('mongoose');

const celebritySchema = new mongoose.Schema({
  name: String,
  shoeSize: Number,
  image: String,
  category: String, // Actor, Athlete, Music, etc.
});

module.exports = mongoose.model('Celebrity', celebritySchema);

