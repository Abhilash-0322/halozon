/* eslint-disable no-console */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/halozon';
const bcrypt = require('bcryptjs');

const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected');

  // Create admin
  const adminHash = await bcrypt.hash('admin123', 10);
  await User.updateOne(
    { email: 'admin@halozon.com' },
    {
      $set: {
        name: 'halozon Admin',
        email: 'admin@halozon.com',
        password: adminHash,
        role: 'admin',
        emailVerified: true,
      },
    },
    { upsert: true }
  );
  console.log('Admin: admin@halozon.com / admin123');

  // Create demo seller
  const sellerHash = await bcrypt.hash('seller123', 10);
  await User.updateOne(
    { email: 'seller@halozon.com' },
    {
      $set: {
        name: 'AuraCraft Studio',
        email: 'seller@halozon.com',
        password: sellerHash,
        role: 'seller',
        emailVerified: true,
        sellerProfile: {
          storeName: 'AuraCraft Studio',
          slug: 'auracraft-studio',
          description: 'Premium handcrafted electronics accessories. Free shipping on orders $35+.',
          logo: '',
          country: 'United States',
          appliedAt: new Date(),
          approvedAt: new Date(),
          approved: true,
          rating: 4.7,
          ratingCount: 128,
          payoutEmail: 'seller@halozon.com',
          payoutMethod: 'bank',
        },
      },
    },
    { upsert: true }
  );
  console.log('Seller: seller@halozon.com / seller123');

  // Apply some demo products to the seller
  const seller = await User.findOne({ email: 'seller@halozon.com' });
  if (seller) {
    const count = await Product.countDocuments({ sellerId: seller._id });
    if (count === 0) {
      const demoProducts = [
        {
          title: 'AuraCraft Handcrafted Wooden Phone Stand',
          slug: 'auracraft-wooden-phone-stand-' + Math.random().toString(36).slice(2, 6),
          brand: 'AuraCraft',
          description: 'Beautifully handcrafted walnut wood phone stand. Each piece is unique.',
          features: ['Solid walnut wood', 'Holds all phone sizes', 'Non-slip base'],
          price: 34.99,
          listPrice: 49.99,
          images: [
            `https://picsum.photos/seed/auracraft-wood-${Math.random()}/600/600`,
            `https://picsum.photos/seed/auracraft-wood-b-${Math.random()}/600/600`,
          ],
          categorySlug: 'electronics',
          stock: 25,
          isPrime: true,
          seller: 'AuraCraft Studio',
          sellerId: seller._id,
          sellerName: 'AuraCraft Studio',
          rating: 4.8,
          ratingCount: 47,
          sold: 89,
        },
        {
          title: 'AuraCraft Premium Leather AirPods Case',
          slug: 'auracraft-leather-airpods-' + Math.random().toString(36).slice(2, 6),
          brand: 'AuraCraft',
          description: 'Genuine Italian leather AirPods case with carabiner clip.',
          features: ['Italian leather', 'Carabiner included', 'Wireless charging compatible'],
          price: 24.99,
          listPrice: 34.99,
          images: [
            `https://picsum.photos/seed/auracraft-leather-${Math.random()}/600/600`,
            `https://picsum.photos/seed/auracraft-leather-b-${Math.random()}/600/600`,
          ],
          categorySlug: 'electronics',
          stock: 50,
          isPrime: true,
          seller: 'AuraCraft Studio',
          sellerId: seller._id,
          sellerName: 'AuraCraft Studio',
          rating: 4.6,
          ratingCount: 73,
          sold: 142,
        },
        {
          title: 'AuraCraft Bamboo Wireless Charging Pad',
          slug: 'auracraft-bamboo-pad-' + Math.random().toString(36).slice(2, 6),
          brand: 'AuraCraft',
          description: 'Eco-friendly bamboo wireless charging pad. 10W fast charge.',
          features: ['10W fast charge', 'Bamboo finish', 'LED indicator'],
          price: 29.99,
          listPrice: 39.99,
          images: [
            `https://picsum.photos/seed/auracraft-bamboo-${Math.random()}/600/600`,
          ],
          categorySlug: 'electronics',
          stock: 30,
          isPrime: true,
          seller: 'AuraCraft Studio',
          sellerId: seller._id,
          sellerName: 'AuraCraft Studio',
          rating: 4.5,
          ratingCount: 28,
          sold: 56,
        },
      ];
      await Product.insertMany(demoProducts);
      console.log(`Inserted ${demoProducts.length} demo seller products`);
    }
  }

  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
