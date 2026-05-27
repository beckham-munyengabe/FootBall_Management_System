const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional link to auth user
    playerName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 10, max: 60 },
    position: {
      type: String,
      required: true,
      enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
    },
    jerseyNumber: { type: Number, required: true, min: 1, max: 99, unique: true },
    nationality: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    salary: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

playerSchema.index({ playerName: 'text', nationality: 'text' });

module.exports = mongoose.model('Player', playerSchema);
