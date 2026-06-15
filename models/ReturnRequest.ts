import mongoose from 'mongoose';

const ReturnItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    image: String,
    qty: Number,
    price: Number,
    reason: String,
    condition: { type: String, enum: ['new', 'like_new', 'used', 'damaged'], default: 'new' },
  },
  { _id: false }
);

const ReturnRequestSchema = new mongoose.Schema(
  {
    rma: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    orderNumber: String,
    items: [ReturnItemSchema],
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'received', 'refunded'],
      default: 'requested',
    },
    reason: String,
    notes: String,
    refundAmount: Number,
    refundIssuedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.ReturnRequest ||
  mongoose.model('ReturnRequest', ReturnRequestSchema);
