const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema(
  {
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
    date: { type: Date, required: true, default: Date.now },
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    yellowCards: { type: Number, default: 0 },
    redCards: { type: Number, default: 0 },
    minutesPlayed: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 10, default: 0 },
    comments: { type: String, trim: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Performance', performanceSchema);
