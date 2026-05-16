require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
require('./config/supabase'); // Initialize Supabase

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1', apiRoutes);

// Root Route (To prevent 404 when visiting the main URL)
app.get('/', (req, res) => {
  res.send('ScholarDraft Backend API is Running on Vercel!');
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ScholarDraft API is running' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
  });
}

// Export for Vercel Serverless
module.exports = app;
