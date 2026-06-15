import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: String,
    image: String,
    price: Number,
    frequencyMonths: { type: Number, enum: [1, 2, 3, 6], default: 1 },
    discountPercent: { type: Number, default: 5 },
    active: { type: Boolean, default: true },
    nextDeliveryAt: Date,
    lastChargedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
