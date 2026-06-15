import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    title: String,
    body: String,
    helpful: { type: Number, default: 0 },
    helpfulVoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    verified: { type: Boolean, default: true },
    verifiedBuyer: { type: Boolean, default: false },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    brand: String,
    description: { type: String, default: '' },
    features: [String],
    price: { type: Number, required: true, min: 0 },
    listPrice: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    images: { type: [String], default: [] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    categorySlug: String,
    subCategory: String,
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    reviews: [ReviewSchema],
    stock: { type: Number, default: 50 },
    lowStockThreshold: { type: Number, default: 5 },
    sold: { type: Number, default: 0 },
    isPrime: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isDeal: { type: Boolean, default: false },
    dealEndsAt: Date,
    fastShipping: { type: Boolean, default: true },
    freeShipping: { type: Boolean, default: true },
    seller: { type: String, default: 'halozon.com' },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, sparse: true },
    sellerName: String,
    sellerSlug: { type: String, index: true, sparse: true },
    colors: [String],
    sizes: [String],
    tags: [String],
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ title: 'text', description: 'text', brand: 'text', tags: 'text' });
ProductSchema.index({ categorySlug: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ isDeal: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
