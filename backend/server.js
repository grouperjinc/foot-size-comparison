import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import celebritiesRoutes from './routes/celebrities.js';
import { MongoClient, ServerApiVersion } from 'mongodb';

// Replace with your MongoDB URI
const uri = process.env.MONGO_URI;  // Ensure this is correctly set in .env

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const app = express();

// Log the MongoDB URI to ensure it's loaded correctly
console.log('Mongo URI:', process.env.MONGO_URI);

// Middlewares
app.use(bodyParser.json()); // Parse incoming JSON data
app.use('/api/celebrities', celebritiesRoutes); // Use celebrity routes

// This is a simple route to check if the backend is working
app.get('/', (req, res) => {
    res.send('Backend is working!');
  });

// Connect to MongoDB and ping the server
async function connectToDatabase() {
  try {
    // Connect the client to the server
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    // Start the server after a successful database connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

// Call the connect function to establish the connection and start the server
connectToDatabase();

// Close the connection when the application exits
process.on('SIGINT', async () => {
  await client.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});
