const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    trainingDate: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: ['Present', 'Absent', 'Late', 'Excused'],
    },
    notes: { type: String, trim: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // coach
  },
  { timestamps: true }
);

attendanceSchema.index({ playerId: 1, trainingDate: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
