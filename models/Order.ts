import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    image: String,
    price: Number,
    qty: Number,
    isPrime: Boolean,
  },
  { _id: false }
);

const AddressSchema = new mongoose.Schema(
  {
    fullName: String,
    street: String,
    apt: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    phone: String,
  },
  { _id: false }
);

const TrackingEventSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ['ordered', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'] },
    label: String,
    location: String,
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [OrderItemSchema],
    addresses: [AddressSchema],
    shippingAddress: AddressSchema,
    paymentMethod: {
      brand: String,
      last4: String,
    },
    itemsTotal: Number,
    shippingFee: Number,
    tax: Number,
    couponCode: String,
    couponDiscount: { type: Number, default: 0 },
    giftWrap: { type: Boolean, default: false },
    giftWrapFee: { type: Number, default: 0 },
    giftMessage: String,
    total: Number,
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    trackingEvents: [TrackingEventSchema],
    deliveryEta: Date,
    // Per-item assignment to address index (itemIndex -> addressIndex)
    itemAddressMap: [{ type: Number }],
    refundedAt: Date,
    refundAmount: Number,
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
