import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percent', 'fixed', 'freeship'], required: true },
    amount: { type: Number, required: true }, // percent (e.g. 10) or fixed amount (e.g. 5) or 0 for freeship
    minOrder: { type: Number, default: 0 },
    maxDiscount: Number,
    active: { type: Boolean, default: true },
    startsAt: Date,
    expiresAt: Date,
    usageLimit: Number,
    usageCount: { type: Number, default: 0 },
    perUserLimit: Number,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
