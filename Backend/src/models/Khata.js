const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    type:      { type: String, enum: ['debit', 'credit'], required: true },
    amount:    { type: Number, required: true, min: 0.01 },
    note:      { type: String, default: '', trim: true, maxlength: 200 },
    date:      { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: true, timestamps: false }
);

const khataSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true, maxlength: 100, index: true },
    phone:        { type: String, default: '', trim: true, maxlength: 20 },
    address:      { type: String, default: '', trim: true, maxlength: 200 },
    totalBaki:    { type: Number, default: 0 },
    transactions: { type: [transactionSchema], default: [] },
    isActive:     { type: Boolean, default: true, index: true },
    createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { transform: (_, ret) => { delete ret.__v; return ret; } },
  }
);

// Recalculate totalBaki from all transactions
khataSchema.methods.recalcBaki = function () {
  this.totalBaki = this.transactions.reduce((sum, t) => {
    return t.type === 'debit' ? sum + t.amount : sum - t.amount;
  }, 0);
  // Round to 2 decimal places to avoid floating point drift
  this.totalBaki = Math.round(this.totalBaki * 100) / 100;
};

// Compound index for fast list queries
khataSchema.index({ isActive: 1, customerName: 1 });

module.exports = mongoose.model('Khata', khataSchema);
