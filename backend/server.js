import express from 'express';
import bodyParser from 'body-parser';
import celebritiesRoutes from './routes/celebrities.js';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb'; // ✅ Fixed

dotenv.config(); // Load .env variables

const uri = process.env.MONGO_URI; // ✅ Should be set in backend/.env

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const app = express();

console.log('Mongo URI:', process.env.MONGO_URI);

app.use(bodyParser.json());
app.use('/api/celebrities', celebritiesRoutes);

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

async function connectToDatabase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

connectToDatabase();

process.on('SIGINT', async () => {
  await client.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});
