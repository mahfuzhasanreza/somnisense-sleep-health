require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const Prediction = require('./models/Prediction');

const User = require('./models/User');
const auth = require('./middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_fallback_key';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { username, email } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// Helper function to forward request and log to MongoDB
async function forwardAndLog(req, res, endpoint) {
  try {
    const requestData = req.body;
    const userId = req.user.userId; // Extracted from auth middleware
    let userEmail = req.user.email; 
    
    if (!userEmail) {
      const user = await User.findById(userId);
      userEmail = user ? user.email : 'unknown@example.com';
    } 

    // Forward request to FastAPI
    const response = await axios.post(`${FASTAPI_URL}${endpoint}`, requestData);
    const responseData = response.data;

    // Save to MongoDB
    const predictionLog = new Prediction({
      userId,
      userEmail,
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
app.post('/api/predict', auth, (req, res) => forwardAndLog(req, res, '/predict'));
app.post('/api/felt-predict', auth, (req, res) => forwardAndLog(req, res, '/felt-predict'));

// Fetch past predictions
app.get('/api/predictions', auth, async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user.userId }).sort({ timestamp: -1 });
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
