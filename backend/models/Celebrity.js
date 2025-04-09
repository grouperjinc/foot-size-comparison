// backend/models/Celebrity.js
import mongoose from 'mongoose';

const celebritySchema = new mongoose.Schema({
    name: String,
    shoeSize: Number,
    image: String,
    category: String,
  }, { collection: 'celebrities' }); // ✅ match the real collection name
  

// what I am doing for serverless testing
export default mongoose.models.celebrity || mongoose.model('celebrity', celebritySchema);
  

/* what I had before serverless
const Celebrity = mongoose.model('Celebrity', celebritySchema);
export default Celebrity;
*/


