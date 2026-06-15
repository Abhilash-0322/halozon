import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
    banned: { type: Boolean, default: false },
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

    emailVerified: { type: Boolean, default: false },
    emailVerifyToken: String,
    emailVerifyExpires: Date,

    passwordResetToken: String,
    passwordResetExpires: Date,

    // Seller profile (embedded so a user can both buy and sell)
    sellerProfile: {
      storeName: { type: String, trim: true },
      slug: { type: String, lowercase: true, trim: true, index: true, sparse: true },
      description: { type: String, default: '' },
      logo: String,
      banner: String,
      country: { type: String, default: 'United States' },
      appliedAt: Date,
      approvedAt: Date,
      approved: { type: Boolean, default: false },
      rating: { type: Number, default: 0 },
      ratingCount: { type: Number, default: 0 },
      // Bank/payout (mock)
      payoutEmail: String,
      payoutMethod: { type: String, default: 'bank' },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
