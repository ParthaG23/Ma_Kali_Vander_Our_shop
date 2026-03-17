const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true, maxlength: 100, index: true },
    category: { type: String, default: 'General', trim: true, maxlength: 60 },
    price:    { type: Number, required: true, min: 0 },
    stock:    { type: Number, default: 0, min: 0 },
    unit:     { type: String, default: 'kg', trim: true, maxlength: 20 },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
    toJSON: { transform: (_, ret) => { delete ret.__v; return ret; } },
  }
);

productSchema.index({ isActive: 1, name: 1 });

module.exports = mongoose.model('Product', productSchema);
