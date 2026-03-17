const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true, maxlength: 60 },
    email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:    { type: String, select: false },        // excluded by default
    role:        { type: String, enum: ['user', 'admin'], default: 'user', index: true },
    firebaseUid: { type: String, default: null, index: true, sparse: true },
    isActive:    { type: Boolean, default: true, index: true },
    lastLogin:   { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password — must explicitly select password field first
userSchema.methods.matchPassword = async function (entered) {
  if (!this.password) return false;
  return bcrypt.compare(entered, this.password);
};

// Index for fast email lookups
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
