const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userInput: {
    stress_score: Number,
    sleep_duration_hrs: Number,
    caffeine_mg_before_bed: Number,
    screen_time_before_bed_mins: Number,
    wake_episodes_per_night: Number,
    // Add other flexible fields if necessary
  },
  predictionResult: {
    prediction: Number,
    recommendations: [String]
  },
  endpoint: {
    type: String,
    required: true,
    enum: ['/predict', '/felt-predict']
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, { strict: false }); // allows other mixed fields if they exist

module.exports = mongoose.model('Prediction', predictionSchema);
