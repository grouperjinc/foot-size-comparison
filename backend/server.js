import express from 'express';
import bodyParser from 'body-parser';
import celebritiesRoutes from './routes/celebrities.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // ✅ Use Mongoose if you're using models

dotenv.config(); // Load environment variables

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use('/api/celebrities', celebritiesRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB!'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Export the app so Vercel can handle it as a serverless function
export default app;
