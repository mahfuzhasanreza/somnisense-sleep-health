require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const Prediction = require('./models/Prediction');

const app = express();
const PORT = process.env.PORT || 5000;
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Helper function to forward request and log to MongoDB
async function forwardAndLog(req, res, endpoint) {
  try {
    const requestData = req.body;

    // Forward request to FastAPI
    const response = await axios.post(`${FASTAPI_URL}${endpoint}`, requestData);
    const responseData = response.data;

    // Save to MongoDB
    const predictionLog = new Prediction({
      userInput: requestData,
      endpoint,
      predictionResult: responseData
    });
    
    // Non-blocking save
    predictionLog.save().catch(err => console.error('Error saving to MongoDB:', err));

    // Return response to frontend
    res.status(200).json(responseData);
  } catch (error) {
    console.error(`Error forwarding request to FastAPI (${endpoint}):`, error.message);
    
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { detail: 'Internal Server Error' };
    
    res.status(status).json(data);
  }
}

// Routes
app.post('/api/predict', (req, res) => forwardAndLog(req, res, '/predict'));
app.post('/api/felt-predict', (req, res) => forwardAndLog(req, res, '/felt-predict'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
