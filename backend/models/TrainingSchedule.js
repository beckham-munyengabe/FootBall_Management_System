const mongoose = require('mongoose');

const trainingScheduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // e.g. "16:00"
    endTime: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // coach
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('TrainingSchedule', trainingScheduleSchema);
