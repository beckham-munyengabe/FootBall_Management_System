const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    coachName: { type: String, required: true, trim: true },
    role: {
      type: String,
      required: true,
      enum: ['Head Coach', 'Assistant Coach', 'Goalkeeping Coach', 'Fitness Coach'],
    },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    nationality: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coach', coachSchema);
