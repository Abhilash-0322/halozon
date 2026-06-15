/* eslint-disable no-console */
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/halozon';

const Category = mongoose.model('Category', new mongoose.Schema({}, { strict: false }));
const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

// Curated high-quality image URLs from picsum + unsplash patterns
const img = (seed, w = 800, h = 800) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', description: 'TVs, Audio, Cameras & more', icon: '📺', featured: true, order: 1 },
  { name: 'Computers', slug: 'computers', description: 'Laptops, Desktops & Accessories', icon: '💻', featured: true, order: 2 },
  { name: 'Smart Home', slug: 'smart-home', description: 'Echo, Ring, Smart Plugs', icon: '🏠', featured: true, order: 3 },
  { name: 'Books', slug: 'books', description: 'Bestsellers & new releases', icon: '📚', featured: true, order: 4 },
  { name: 'Home & Kitchen', slug: 'home-and-kitchen', description: 'Cookware, Furniture, Décor', icon: '🍳', featured: true, order: 5 },
  { name: 'Fashion', slug: 'fashion', description: 'Clothing, Shoes & Jewelry', icon: '👕', featured: true, order: 6 },
  { name: 'Toys & Games', slug: 'toys-and-games', description: 'For kids of all ages', icon: '🎮', featured: true, order: 7 },
  { name: 'Beauty', slug: 'beauty', description: 'Skincare, makeup & fragrances', icon: '💄', featured: true, order: 8 },
  { name: 'Sports & Outdoors', slug: 'sports-and-outdoors', description: 'Equipment, Apparel & more', icon: '⚽', featured: false, order: 9 },
  { name: 'Grocery', slug: 'grocery', description: 'Snacks, drinks & essentials', icon: '🛒', featured: false, order: 10 },
  { name: 'Pet Supplies', slug: 'pet-supplies', description: 'Food, toys & care', icon: '🐶', featured: false, order: 11 },
  { name: 'Tools & Home Improvement', slug: 'tools', description: 'Power tools, hand tools', icon: '🔧', featured: false, order: 12 },
  { name: 'Automotive', slug: 'automotive', description: 'Parts, accessories & tires', icon: '🚗', featured: false, order: 13 },
  { name: 'Office Products', slug: 'office', description: 'Office supplies & furniture', icon: '📎', featured: false, order: 14 },
];

function makeProducts() {
  const items = [];
  const seed = (n) => `halozon-${n}-${Math.random().toString(36).slice(2, 6)}`;

  // ELECTRONICS - 12
  const e = [
    { title: 'AuraView 55" Class QLED 4K UHD Smart TV', brand: 'AuraView', price: 449.99, listPrice: 699.99, sub: 'electronics', features: ['Quantum Dot Color', '120Hz refresh rate', 'Built-in Alexa', '4 HDMI ports'], desc: 'A stunning 55-inch QLED 4K TV with quantum dot technology delivering over a billion shades of pure color. Built-in voice assistant, 120Hz refresh rate for smooth motion, and four HDMI ports for all your devices.' },
    { title: 'AuraView 65" Class OLED 4K Smart TV', brand: 'AuraView', price: 1299.99, listPrice: 1799.99, sub: 'electronics', features: ['OLED', 'Dolby Vision IQ', '120Hz', 'HDMI 2.1'], desc: 'Premium OLED display with perfect blacks, infinite contrast, and Dolby Vision IQ for an immersive cinematic experience.' },
    { title: 'PulseBuds Pro Wireless Earbuds', brand: 'Pulse', price: 89.99, listPrice: 149.99, sub: 'electronics', features: ['Active Noise Cancellation', '30hr battery', 'Wireless charging'], desc: 'Studio-quality audio with adaptive noise cancellation. Up to 30 hours of total battery life with the charging case.' },
    { title: 'PulseBuds Lite Wireless Earbuds', brand: 'Pulse', price: 39.99, listPrice: 69.99, sub: 'electronics', features: ['24hr battery', 'IPX5 water resistant'], desc: 'Crisp sound, snug fit, all-day comfort. The reliable everyday earbud.' },
    { title: 'NovaStream 4K Streaming Stick', brand: 'NovaStream', price: 39.99, listPrice: 49.99, sub: 'electronics', features: ['4K HDR', 'Dolby Atmos', 'Voice remote'], desc: 'The most powerful streaming stick. 4K HDR support with Dolby Atmos audio and a hands-free voice remote.' },
    { title: 'SnapShot Pro Mirrorless Camera', brand: 'SnapShot', price: 1099.0, listPrice: 1499.0, sub: 'electronics', features: ['24MP sensor', '4K video', 'In-body stabilization'], desc: 'A compact mirrorless camera that delivers professional image quality with a 24MP full-frame sensor.' },
    { title: 'BoomBar 5.1 Surround Sound System', brand: 'BoomBar', price: 299.0, listPrice: 449.0, sub: 'electronics', features: ['Dolby Atmos', 'Wireless sub', 'Bluetooth'], desc: 'Cinema-grade surround sound with wireless subwoofer for deep, room-filling bass.' },
    { title: 'Echo Dot (5th Gen) Smart Speaker', brand: 'AuraVoice', price: 39.99, listPrice: 49.99, sub: 'smart-home', features: ['Voice assistant', 'Smart hub built-in'], desc: 'Our most popular smart speaker. Now with clearer vocals, deeper bass, and a built-in smart home hub.' },
    { title: 'AuraVoice Show 8 Smart Display', brand: 'AuraVoice', price: 109.99, listPrice: 149.99, sub: 'smart-home', features: ['8" HD display', 'Auto-framing camera'], desc: 'A vibrant 8-inch smart display with a 13MP camera that auto-frames you on video calls.' },
    { title: 'HyperDrone Pro 4K Drone', brand: 'HyperDrone', price: 599.0, listPrice: 799.0, sub: 'electronics', features: ['4K HDR video', '40min flight', 'Obstacle avoidance'], desc: 'Capture cinematic aerial footage with a stabilized 4K HDR camera and 40-minute flight time.' },
    { title: 'ClearCast USB Condenser Microphone', brand: 'ClearCast', price: 79.99, listPrice: 119.99, sub: 'electronics', features: ['Cardioid', 'USB-C', 'Tap-mute'], desc: 'Broadcast-quality audio for streaming, podcasting, and video calls. Plug-and-play with USB-C.' },
    { title: 'PhantomVR Wireless Gaming Headset', brand: 'Phantom', price: 349.0, listPrice: 449.0, sub: 'electronics', features: ['Wireless VR', '4K per eye', 'Inside-out tracking'], desc: 'The next generation of wireless VR. 4K resolution per eye with inside-out tracking for total freedom.' },
  ];

  // COMPUTERS - 8
  const c = [
    { title: 'BookLite 14" Ultra-thin Laptop', brand: 'BookLite', price: 699.0, listPrice: 999.0, sub: 'computers', features: ['14" 2.8K OLED', '16GB RAM', '512GB SSD'], desc: 'Stunning 2.8K OLED display in an impossibly thin and light aluminum chassis.' },
    { title: 'BookLite Pro 16" Laptop', brand: 'BookLite', price: 1499.0, listPrice: 1899.0, sub: 'computers', features: ['16" 4K OLED', '32GB RAM', '1TB SSD', 'RTX 4070'], desc: 'Pro-grade performance for creators and developers. 4K OLED and discrete GPU.' },
    { title: 'Chromio 14" Chromebook Plus', brand: 'Chromio', price: 449.0, listPrice: 599.0, sub: 'computers', features: ['14" FHD touch', '16GB RAM'], desc: 'A premium Chromebook with a brilliant touchscreen and all-day battery life.' },
    { title: 'GamerX 32" Curved Gaming Monitor', brand: 'GamerX', price: 329.0, listPrice: 449.0, sub: 'computers', features: ['165Hz', '1ms response', 'QHD'], desc: 'Lightning-fast 165Hz refresh rate on a curved QHD display.' },
    { title: 'MechKey Wireless Mechanical Keyboard', brand: 'MechKey', price: 89.99, listPrice: 129.99, sub: 'computers', features: ['Hot-swappable', 'RGB', 'Wireless'], desc: 'Premium hot-swappable mechanical keyboard with RGB lighting and tri-mode wireless.' },
    { title: 'MechKey Ergo Split Keyboard', brand: 'MechKey', price: 199.0, listPrice: 269.0, sub: 'computers', features: ['Split design', 'Tented', 'Mechanical'], desc: 'Ergonomic split mechanical keyboard designed to reduce strain during long typing sessions.' },
    { title: 'HyperGlide MX Master Wireless Mouse', brand: 'HyperGlide', price: 79.99, listPrice: 99.99, sub: 'computers', features: ['8K DPI sensor', 'Multi-device'], desc: 'Our flagship productivity mouse with an 8K DPI sensor and seamless multi-device switching.' },
    { title: 'PixelStream Webcam 4K', brand: 'PixelStream', price: 119.0, listPrice: 169.0, sub: 'computers', features: ['4K HDR', 'Auto-framing'], desc: 'Look your best on every call with 4K HDR and AI auto-framing.' },
  ];

  // SMART HOME - 6
  const s = [
    { title: 'AuraVoice Show 15 Smart Display', brand: 'AuraVoice', price: 249.0, listPrice: 279.0, sub: 'smart-home', features: ['15.6" Full HD', 'Wall-mountable'], desc: 'A beautiful 15.6-inch smart display that doubles as a wall-mounted photo frame.' },
    { title: 'RingGuard Pro Video Doorbell', brand: 'RingGuard', price: 179.0, listPrice: 229.0, sub: 'smart-home', features: ['2K HDR', 'Package detection'], desc: 'See every detail with 2K HDR video and intelligent package detection.' },
    { title: 'GlowLight Smart Bulb 4-Pack', brand: 'GlowLight', price: 49.99, listPrice: 79.99, sub: 'smart-home', features: ['16M colors', 'Voice control'], desc: 'Set the perfect mood with 16 million colors and full voice control.' },
    { title: 'SmartPlug WiFi Outlet (4-Pack)', brand: 'ConnectAll', price: 24.99, listPrice: 39.99, sub: 'smart-home', features: ['WiFi', 'Voice control'], desc: 'Control any outlet from anywhere. Schedules, timers, and voice assistant support.' },
    { title: 'ThermoSmart WiFi Thermostat', brand: 'ThermoSmart', price: 199.0, listPrice: 249.0, sub: 'smart-home', features: ['Adaptive scheduling', 'Energy reports'], desc: 'Saves energy automatically with adaptive learning and detailed energy reports.' },
    { title: 'VacBot Robot Vacuum & Mop', brand: 'VacBot', price: 399.0, listPrice: 549.0, sub: 'smart-home', features: ['LiDAR navigation', 'Self-emptying'], desc: 'Self-emptying robot vacuum and mop with LiDAR mapping of your entire home.' },
  ];

  // BOOKS - 8
  const b = [
    { title: 'The Midnight Library', brand: 'RiverPress', price: 13.99, listPrice: 17.99, sub: 'books', features: ['Hardcover', '320 pages'], desc: 'A dazzling novel about regrets, hopes, and second chances. A #1 New York Times bestseller.' },
    { title: 'Atomic Habits', brand: 'RiverPress', price: 11.99, listPrice: 16.99, sub: 'books', features: ['Paperback', '320 pages'], desc: 'An easy & proven way to build good habits & break bad ones.' },
    { title: 'Project Hail Mary', brand: 'RiverPress', price: 14.99, listPrice: 19.99, sub: 'books', features: ['Hardcover', '496 pages'], desc: 'A lone astronaut. An impossible mission. An ally he never imagined he\'d have.' },
    { title: 'The Silent Patient', brand: 'Macmillan', price: 9.99, listPrice: 14.99, sub: 'books', features: ['Paperback', '336 pages'], desc: 'The record-breaking psychological thriller of the year.' },
    { title: 'Dune: The Complete Saga', brand: 'Macmillan', price: 39.99, listPrice: 54.99, sub: 'books', features: ['Box set', '6 books'], desc: 'All six novels in Frank Herbert\'s Dune saga in a stunning collector\'s box set.' },
    { title: 'Educated: A Memoir', brand: 'RiverPress', price: 12.99, listPrice: 16.99, sub: 'books', features: ['Paperback', '334 pages'], desc: 'An unforgettable memoir about a young woman who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge.' },
    { title: 'Klara and the Sun', brand: 'Macmillan', price: 14.99, listPrice: 18.99, sub: 'books', features: ['Hardcover', '320 pages'], desc: 'A magnificent novel from the Nobel laureate Kazuo Ishiguro.' },
    { title: 'The Four Winds', brand: 'RiverPress', price: 13.99, listPrice: 17.99, sub: 'books', features: ['Paperback', '464 pages'], desc: 'A powerful novel about the strength of a woman determined to save her family during the Great Depression.' },
  ];

  // HOME & KITCHEN - 8
  const h = [
    { title: 'ChefForge 10-Piece Cookware Set', brand: 'ChefForge', price: 159.0, listPrice: 249.0, sub: 'home-and-kitchen', features: ['Stainless steel', 'Dishwasher safe'], desc: 'Restaurant-grade tri-ply stainless steel cookware, oven-safe to 600°F.' },
    { title: 'BrewMaster Pro Coffee Maker', brand: 'BrewMaster', price: 199.0, listPrice: 279.0, sub: 'home-and-kitchen', features: ['Built-in grinder', 'Thermal carafe'], desc: 'Barista-quality coffee at home with a built-in burr grinder and precise temperature control.' },
    { title: 'ChefForge 8-Quart Pressure Cooker', brand: 'ChefForge', price: 99.99, listPrice: 149.99, sub: 'home-and-kitchen', features: ['7-in-1', 'Stainless'], desc: 'Pressure cook, slow cook, sauté, steam, and more — all in one pot.' },
    { title: 'AeroFry XL Digital Air Fryer', brand: 'AeroFry', price: 119.0, listPrice: 159.0, sub: 'home-and-kitchen', features: ['5.8QT capacity', 'Digital'], desc: 'Crispy, delicious fried food with little to no oil. Family-sized 5.8-quart basket.' },
    { title: 'CloudRest Memory Foam Pillow (2-Pack)', brand: 'CloudRest', price: 39.99, listPrice: 59.99, sub: 'home-and-kitchen', features: ['Cooling gel', 'Washable cover'], desc: 'Contoured memory foam with cooling gel layer for a cool, restorative sleep.' },
    { title: 'RoboMix 9-in-1 Stand Mixer', brand: 'RoboMix', price: 299.0, listPrice: 449.0, sub: 'home-and-kitchen', features: ['5-quart', '9 attachments'], desc: 'Powerful 500W motor with 9 attachments for every kitchen task.' },
    { title: 'EcoVac Handheld Cordless Vacuum', brand: 'EcoVac', price: 89.99, listPrice: 129.99, sub: 'home-and-kitchen', features: ['Cordless', 'HEPA filter'], desc: 'Lightweight, cordless, and powerful enough for the toughest messes.' },
    { title: 'CozyCloud Weighted Blanket', brand: 'CozyCloud', price: 79.99, listPrice: 119.99, sub: 'home-and-kitchen', features: ['15lb', 'Breathable cotton'], desc: 'Calming deep-pressure stimulation in a breathable cotton cover.' },
  ];

  // FASHION - 6
  const f = [
    { title: 'StrideFlex Men\'s Running Shoes', brand: 'StrideFlex', price: 79.99, listPrice: 119.99, sub: 'fashion', features: ['Lightweight', 'Cushioned sole'], colors: ['Black', 'White', 'Gray', 'Blue'], sizes: ['8', '9', '10', '11', '12'], desc: 'Cushioned, breathable, and built for daily miles.' },
    { title: 'UrbanTrek Waterproof Hiking Boots', brand: 'UrbanTrek', price: 119.0, listPrice: 159.0, sub: 'fashion', features: ['Waterproof', 'Vibram sole'], colors: ['Brown', 'Black'], sizes: ['8', '9', '10', '11', '12'], desc: 'Tackle any trail with waterproof leather and grippy Vibram outsoles.' },
    { title: 'AeroLite Performance Hoodie', brand: 'AeroLite', price: 49.99, listPrice: 79.99, sub: 'fashion', features: ['Moisture-wicking'], colors: ['Black', 'Navy', 'Gray', 'Olive'], sizes: ['S', 'M', 'L', 'XL'], desc: 'Featherweight performance fabric that wicks moisture and moves with you.' },
    { title: 'EcoStitch Classic Denim Jacket', brand: 'EcoStitch', price: 79.99, listPrice: 109.99, sub: 'fashion', features: ['100% cotton'], colors: ['Indigo', 'Black', 'Stone'], sizes: ['S', 'M', 'L', 'XL'], desc: 'Timeless silhouette, sustainable cotton, built to last.' },
    { title: 'LumiLux Minimalist Watch', brand: 'LumiLux', price: 149.0, listPrice: 199.0, sub: 'fashion', features: ['Sapphire crystal', 'Swiss movement'], colors: ['Silver', 'Gold', 'Rose Gold'], desc: 'Swiss quartz movement, sapphire crystal, and a 5ATM water resistance.' },
    { title: 'SolarWrap UV-Protect Sunglasses', brand: 'SolarWrap', price: 39.99, listPrice: 69.99, sub: 'fashion', features: ['Polarized'], colors: ['Black', 'Tortoise'], desc: 'Polarized UV400 protection in a lightweight wraparound frame.' },
  ];

  // TOYS - 5
  const t = [
    { title: 'BuildABlock 1500-Piece Architecture Set', brand: 'BuildABlock', price: 79.99, listPrice: 119.99, sub: 'toys-and-games', features: ['1500 pieces', 'Ages 12+'], desc: 'A challenging build for architecture enthusiasts. Display-worthy finished model.' },
    { title: 'NovaBots Smart Building Robot', brand: 'NovaBots', price: 119.0, listPrice: 159.0, sub: 'toys-and-games', features: ['Programmable', 'Ages 8+'], desc: 'A programmable robot that teaches kids STEM through play. Drag-and-drop coding.' },
    { title: 'PixelPals Plush Bundle', brand: 'PixelPals', price: 29.99, listPrice: 49.99, sub: 'toys-and-games', features: ['3-pack', 'Huggable'], desc: 'Three collectible plush friends. Perfect for bedtime adventures.' },
    { title: 'TerraQuest Board Game', brand: 'TerraQuest', price: 49.99, listPrice: 69.99, sub: 'toys-and-games', features: ['3-6 players', '60min playtime'], desc: 'The award-winning strategy game the whole family will love.' },
    { title: 'SkyForge Foam Glider', brand: 'SkyForge', price: 19.99, listPrice: 29.99, sub: 'toys-and-games', features: ['3x foam planes', 'Ages 6+'], desc: 'Three foam gliders designed for long, stable outdoor flights.' },
  ];

  // BEAUTY - 5
  const bea = [
    { title: 'GlowPure Vitamin C Serum', brand: 'GlowPure', price: 24.99, listPrice: 39.99, sub: 'beauty', features: ['20% Vitamin C', 'Vegan'], desc: 'A potent 20% Vitamin C serum that brightens and evens skin tone.' },
    { title: 'SilkSkin Hyaluronic Moisturizer', brand: 'SilkSkin', price: 32.99, listPrice: 49.99, sub: 'beauty', features: ['All skin types'], desc: 'Lightweight gel-cream with hyaluronic acid for plump, dewy skin.' },
    { title: 'VelvetMatte Lip Kit', brand: 'VelvetMatte', price: 22.99, listPrice: 34.99, sub: 'beauty', features: ['12 shades', 'Long-wear'], colors: ['Cherry', 'Wine', 'Nude', 'Berry'], desc: 'A buttery, all-day liquid lip color with a precision applicator.' },
    { title: 'PureMist Botanical Face Mist', brand: 'PureMist', price: 18.99, listPrice: 28.99, sub: 'beauty', features: ['Rose + cucumber'], desc: 'A refreshing botanical mist that hydrates and sets makeup.' },
    { title: 'SilkSkin Retinol Night Cream', brand: 'SilkSkin', price: 38.99, listPrice: 54.99, sub: 'beauty', features: ['0.3% retinol'], desc: 'A gentle, encapsulated retinol cream for smoother, firmer-looking skin.' },
  ];

  // Combine all
  const all = [...e, ...c, ...s, ...b, ...h, ...f, ...t, ...bea];
  for (const x of all) {
    const isDeal = Math.random() < 0.45;
    const isFeatured = Math.random() < 0.4;
    const discount = x.listPrice > x.price ? Math.round(((x.listPrice - x.price) / x.listPrice) * 100) : 0;
    items.push({
      title: x.title,
      slug: x.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      brand: x.brand,
      description: x.desc,
      features: x.features || [],
      price: x.price,
      listPrice: x.listPrice || 0,
      currency: 'USD',
      images: [img(`${x.brand}-${x.title}`, 1200, 1200), img(`${x.brand}-${x.title}-b`, 1200, 1200), img(`${x.brand}-${x.title}-c`, 1200, 1200), img(`${x.brand}-${x.title}-d`, 1200, 1200)],
      categorySlug: x.sub,
      subCategory: x.sub,
      rating: +(3.7 + Math.random() * 1.2).toFixed(1),
      ratingCount: Math.floor(50 + Math.random() * 5000),
      reviews: [
        { userName: 'Sarah J.', rating: 5, title: 'Excellent!', body: 'Exceeded my expectations. Highly recommend.', helpful: 24, verified: true, createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 60) },
        { userName: 'Mike T.', rating: 4, title: 'Solid product', body: 'Great quality for the price. Shipping was fast.', helpful: 12, verified: true, createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 60) },
      ],
      stock: 30 + Math.floor(Math.random() * 100),
      sold: Math.floor(50 + Math.random() * 5000),
      isPrime: true,
      isFeatured,
      isDeal,
      dealEndsAt: isDeal ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 3) : undefined,
      fastShipping: true,
      freeShipping: true,
      seller: 'halozon.com',
      colors: x.colors || [],
      sizes: x.sizes || [],
      tags: [x.sub, x.brand.toLowerCase(), ...(x.features || []).slice(0, 3)],
    });
  }
  return items;
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  console.log('Clearing existing data…');
  await Promise.all([Category.deleteMany({}), Product.deleteMany({}), User.deleteMany({})]);

  console.log('Inserting categories…');
  await Category.insertMany(CATEGORIES);

  console.log('Inserting products…');
  await Product.insertMany(makeProducts());

  console.log('Creating demo user…');
  const bcrypt = require('bcryptjs');
  const hash = await bcrypt.hash('demo123', 10);
  await User.create({
    name: 'Demo Customer',
    email: 'demo@halozon.com',
    password: hash,
    role: 'user',
    isPrime: true,
    addresses: [
      { label: 'Home', fullName: 'Demo Customer', street: '410 Terry Ave N', city: 'Seattle', state: 'WA', zip: '98109', country: 'United States', phone: '5551234567', isDefault: true },
    ],
    paymentMethods: [
      { label: 'Personal Visa', brand: 'Visa', cardNumberLast4: '4242', expiry: '12/29', isDefault: true },
    ],
  });

  console.log('Seeding complete.');
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
