import mongoose from 'mongoose';

const StockAlertSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

StockAlertSchema.index({ email: 1, productId: 1 }, { unique: true });

export default mongoose.models.StockAlert || mongoose.model('StockAlert', StockAlertSchema);
