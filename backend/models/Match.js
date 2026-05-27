const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    opponent: { type: String, required: true, trim: true },
    matchDate: { type: Date, required: true },
    stadium: { type: String, required: true, trim: true },
    competition: { type: String, trim: true }, // e.g. League, Cup, Friendly
    homeOrAway: { type: String, enum: ['Home', 'Away'], default: 'Home' },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Postponed', 'Cancelled'],
      default: 'Scheduled',
    },
    result: {
      teamScore: { type: Number, default: null },
      opponentScore: { type: Number, default: null },
      outcome: { type: String, enum: ['Win', 'Loss', 'Draw', null], default: null },
    },
    lineup: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Match', matchSchema);
