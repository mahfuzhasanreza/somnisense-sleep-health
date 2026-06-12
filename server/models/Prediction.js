const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  requestData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
    enum: ['/predict', '/felt-predict']
  },
  responseData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Prediction', predictionSchema);
