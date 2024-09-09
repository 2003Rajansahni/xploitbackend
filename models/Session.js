// models/Session.js
const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loggedInAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', SessionSchema);
