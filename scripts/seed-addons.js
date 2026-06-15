/* eslint-disable no-console */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/halozon';

const Coupon = mongoose.model('Coupon', new mongoose.Schema({}, { strict: false }));
const Bundle = mongoose.model('Bundle', new mongoose.Schema({}, { strict: false }));
const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

const COUPONS = [
  { code: 'WELCOME10', type: 'percent', amount: 10, minOrder: 0, maxDiscount: 50, description: '10% off your first order (max $50)' },
  { code: 'SAVE20', type: 'percent', amount: 20, minOrder: 100, maxDiscount: 100, description: '20% off when you spend $100+' },
  { code: 'FLASH25', type: 'percent', amount: 25, minOrder: 50, maxDiscount: 75, description: 'Flash sale — 25% off (max $75)' },
  { code: 'PRIME5', type: 'fixed', amount: 5, minOrder: 25, description: '$5 off any order $25+' },
  { code: 'BIGSAVE15', type: 'fixed', amount: 15, minOrder: 75, description: '$15 off when you spend $75+' },
  { code: 'FREESHIP', type: 'freeship', amount: 0, minOrder: 0, description: 'Free shipping on any order' },
  { code: 'SUMMER30', type: 'percent', amount: 30, minOrder: 150, maxDiscount: 150, description: 'Summer blowout — 30% off $150+ (max $150)' },
  { code: 'STUDENT10', type: 'percent', amount: 10, minOrder: 0, description: '10% student discount' },
];

async function makeBundles() {
  const products = await Product.find().select('_id title categorySlug price').lean();
  const byCat = {};
  for (const p of products) {
    const c = p.categorySlug || 'misc';
    if (!byCat[c]) byCat[c] = [];
    byCat[c].push(p);
  }

  const bundles = [];
  const cats = Object.keys(byCat).slice(0, 6);
  let i = 0;
  for (const cat of cats) {
    const items = byCat[cat].slice(0, 3);
    if (items.length >= 2) {
      i += 1;
      bundles.push({
        name: cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) + ' Essentials Bundle',
        slug: `${cat}-bundle-${i}`,
        description: `Save when you buy these ${items.length} items together`,
        productIds: items.slice(0, 3).map((p) => p._id),
        bundleDiscountPercent: 10,
      });
    }
  }

  function findP(substr) {
    return products.find((p) => p.title.toLowerCase().includes(substr.toLowerCase()));
  }

  const themed = [
    {
      name: 'Movie Night Bundle',
      slug: 'movie-night',
      description: 'Everything you need for the perfect movie night',
      productIds: [
        findP('TV')?._id,
        findP('Soundbar')?._id || findP('BoomBar')?._id,
        findP('Streaming')?._id,
      ].filter(Boolean),
      bundleDiscountPercent: 12,
    },
    {
      name: 'Smart Home Starter',
      slug: 'smart-home-starter',
      description: 'Kickstart your smart home',
      productIds: [
        findP('Echo Dot')?._id,
        findP('Smart Bulb')?._id || findP('GlowLight')?._id,
        findP('SmartPlug')?._id,
      ].filter(Boolean),
      bundleDiscountPercent: 10,
    },
    {
      name: 'Work From Home Kit',
      slug: 'wfh-kit',
      description: 'Be productive from home',
      productIds: [
        findP('BookLite')?._id,
        findP('Monitor')?._id || findP('GamerX')?._id,
        findP('Keyboard')?._id || findP('MechKey')?._id,
      ].filter(Boolean),
      bundleDiscountPercent: 15,
    },
  ];
  bundles.push(...themed);
  return bundles.filter((b) => b.productIds.length >= 2);
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected');

  console.log('Upserting coupons…');
  for (const c of COUPONS) {
    await Coupon.updateOne({ code: c.code }, { $set: { ...c, active: true } }, { upsert: true });
  }

  console.log('Building bundles…');
  const bundles = await makeBundles();
  for (const b of bundles) {
    await Bundle.updateOne({ slug: b.slug }, { $set: { ...b, active: true } }, { upsert: true });
  }

  await User.updateOne({ email: 'demo@halozon.com' }, { $set: { emailVerified: true } });
  await Order.updateMany({}, { $set: { status: 'delivered' } });

  console.log(`Inserted ${COUPONS.length} coupons, ${bundles.length} bundles.`);
  console.log('Demo user verified. Existing orders marked delivered.');
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
