import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isPrime: { type: Boolean, default: false },
    addresses: [
      {
        label: String,
        fullName: String,
        street: String,
        apt: String,
        city: String,
        state: String,
        zip: String,
        country: { type: String, default: 'United States' },
        phone: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    paymentMethods: [
      {
        label: String,
        cardNumberLast4: String,
        brand: String,
        expiry: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    primeExpiresAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
