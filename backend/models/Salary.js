const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema(
  {
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    amount: { type: Number, required: true, min: 0 },
    month: { type: String, required: true }, // e.g. "2026-05"
    paymentDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    notes: { type: String, trim: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

salarySchema.index({ playerId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Salary', salarySchema);
