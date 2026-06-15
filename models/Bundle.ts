import mongoose from 'mongoose';

const BundleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    bundleDiscountPercent: { type: Number, default: 5 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Bundle || mongoose.model('Bundle', BundleSchema);
