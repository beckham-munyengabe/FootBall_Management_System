const mongoose = require('mongoose');

// Generic finance ledger: expense or income
const financeSchema = new mongoose.Schema(
  {
    expenseName: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['Expense', 'Income'],
      default: 'Expense',
    },
    category: {
      type: String,
      enum: [
        'Salary',
        'Equipment',
        'Travel',
        'Stadium',
        'Medical',
        'Sponsorship',
        'TicketSales',
        'Other',
      ],
      default: 'Other',
    },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now },
    description: { type: String, trim: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // accountant
  },
  { timestamps: true }
);

module.exports = mongoose.model('Finance', financeSchema);
