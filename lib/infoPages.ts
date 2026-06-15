// Static content for all "info" pages linked from the footer.
// Each entry produces a fully-rendered page (hero + body + CTAs).

export type InfoPage = {
  slug: string;
  title: string;
  nav: string; // footer label
  hero: {
    eyebrow?: string;
    headline: string;
    sub: string;
    bg: 'navy' | 'orange' | 'green' | 'prime';
  };
  body: InfoBlock[];
  cta?: { label: string; href: string };
  related?: { label: string; href: string }[];
};

export type InfoBlock =
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'stats'; items: { label: string; value: string }[] }
  | { kind: 'cards'; items: { title: string; body: string; icon?: string }[] }
  | { kind: 'faq'; items: { q: string; a: string }[] };

const heroBg = (bg: string) =>
  bg === 'orange'
    ? 'from-amazon-orange via-amazon-orangedark to-amazon-buy'
    : bg === 'green'
    ? 'from-amazon-greenDark via-emerald-900 to-amazon-navy'
    : bg === 'prime'
    ? 'from-amazon-prime via-amazon-navylight to-amazon-navy'
    : 'from-amazon-navy via-amazon-navylight to-amazon-orange/70';

export const INFO_PAGES: Record<string, InfoPage> = {
  about: {
    slug: 'about',
    title: 'About halozon',
    nav: 'About halozon',
    hero: {
      eyebrow: 'Our story',
      headline: 'Built for the way you shop',
      sub: 'halozon is a customer-obsessed marketplace. We exist to delight shoppers, empower sellers, and keep inventing on behalf of customers everywhere.',
      bg: 'navy',
    },
    body: [
      { kind: 'h2', text: 'What we believe' },
      { kind: 'p', text: 'Every day, millions of customers come to halozon to discover products, compare prices, and buy with confidence. Behind each order is a network of sellers, engineers, designers, and customer-obsessed teams working to make the experience effortless.' },
      { kind: 'p', text: 'We start from the customer and work backwards. We invent on behalf of people, not the other way around.' },
      { kind: 'stats', items: [
        { label: 'Products listed', value: '60+' },
        { label: 'Categories', value: '14' },
        { label: 'Sellers onboarded', value: '1+' },
        { label: 'Customer rating', value: '4.7 ★' },
      ] },
      { kind: 'h2', text: 'How we work' },
      { kind: 'cards', items: [
        { title: 'Customer obsession', body: 'We earn and keep trust by being relentlessly focused on customer outcomes.' },
        { title: 'Invent & simplify', body: 'We deliver more for less. We cut complexity without cutting corners.' },
        { title: 'Bias for action', body: 'Speed matters. Most decisions can be made with 70% of the data.' },
        { title: 'Earn trust', body: 'We listen attentively, speak candidly, and treat others respectfully.' },
      ] },
    ],
    cta: { label: 'Browse the store', href: '/' },
    related: [
      { label: 'Careers', href: '/info/careers' },
      { label: 'Press Center', href: '/info/press' },
      { label: 'Investor Relations', href: '/info/investor-relations' },
    ],
  },

  careers: {
    slug: 'careers',
    title: 'Careers at halozon',
    nav: 'Careers',
    hero: {
      eyebrow: 'Join us',
      headline: 'Work on problems that matter',
      sub: 'We hire builders, scientists, and operators who want to invent on behalf of customers. If that sounds like you, we want to meet you.',
      bg: 'orange',
    },
    body: [
      { kind: 'h2', text: 'Open roles (sample listings)' },
      { kind: 'cards', items: [
        { title: 'Senior Software Engineer · Frontend', body: 'Next.js, React, TypeScript. Build delightful shopping experiences at scale.' },
        { title: 'Senior Software Engineer · Backend', body: 'Node.js, MongoDB, distributed systems. Power our catalog, cart, and checkout.' },
        { title: 'Product Designer', body: 'Craft pixel-perfect, accessible UI. Collaborate with engineers and PMs end-to-end.' },
        { title: 'Data Scientist', body: 'Personalization, search ranking, demand forecasting. Own your models end-to-end.' },
        { title: 'Customer Experience Specialist', body: 'Help customers solve problems via chat and email. Empathy-first culture.' },
        { title: 'Operations Manager', body: 'Run logistics, fulfillment, and seller success. Keep the engine humming.' },
      ] },
      { kind: 'h2', text: 'Our benefits' },
      { kind: 'ul', items: [
        'Competitive base + equity in a high-growth company',
        'Comprehensive medical, dental, and vision coverage',
        'Flexible time off and parental leave',
        'Annual learning stipend ($2,500)',
        'Free meals, snacks, and on-site fitness (HQ)',
      ] },
    ],
    cta: { label: 'See open roles', href: '/info/careers#open' },
    related: [
      { label: 'About halozon', href: '/info/about' },
      { label: 'halozon Science', href: '/info/science' },
    ],
  },

  blog: {
    slug: 'blog',
    title: 'halozon Blog',
    nav: 'Blog',
    hero: {
      eyebrow: 'Stories & ideas',
      headline: 'The halozon Blog',
      sub: 'Product launches, engineering deep-dives, seller success stories, and notes from the team.',
      bg: 'green',
    },
    body: [
      { kind: 'h2', text: 'Featured stories' },
      { kind: 'cards', items: [
        { title: 'How we built Subscribe & Save in 6 weeks', body: 'A behind-the-scenes look at our recurring orders platform — the architecture, the tradeoffs, and the customer wins.' },
        { title: 'Inside our 2026 holiday readiness drill', body: 'Black Friday prep: chaos engineering, capacity planning, and the ops rituals that keep the site up.' },
        { title: 'A seller&apos;s journey: from kitchen-table startup to nationwide brand', body: 'How one small seller scaled to 10,000 orders a day using halozon Seller Central.' },
        { title: 'Engineering fast search at halozon', body: 'Sub-50ms full-text search across 60M+ products. Here&apos;s how we built it.' },
      ] },
      { kind: 'h2', text: 'Recent posts' },
      { kind: 'ul', items: [
        'Introducing Personalized Recommendations 2.0',
        'Behind the new multi-address checkout',
        'How we reduced cart abandonment by 14%',
        'A new look for product pages',
        'Improving seller payouts with smart batching',
      ] },
    ],
    cta: { label: 'Visit the blog', href: '/info/blog' },
    related: [
      { label: 'halozon Science', href: '/info/science' },
      { label: 'Press Center', href: '/info/press' },
    ],
  },

  sustainability: {
    slug: 'sustainability',
    title: 'Sustainability',
    nav: 'Sustainability',
    hero: {
      eyebrow: 'Our planet',
      headline: 'The Climate Pledge',
      sub: 'We&apos;re committed to net-zero carbon by 2040 — a decade ahead of the Paris Agreement.',
      bg: 'green',
    },
    body: [
      { kind: 'stats', items: [
        { label: 'Renewable energy', value: '90%' },
        { label: 'Plastic packaging reduction', value: '33%' },
        { label: 'Net-zero target', value: '2040' },
        { label: 'Solar projects funded', value: '15+' },
      ] },
      { kind: 'h2', text: 'Our commitments' },
      { kind: 'cards', items: [
        { title: 'Renewable energy', body: 'We&apos;re on track to power our operations with 100% renewable energy by 2027.' },
        { title: 'Sustainable packaging', body: 'Right-sized, recyclable, and reusable packaging across our fulfillment network.' },
        { title: 'Electric last-mile', body: '100,000+ electric delivery vehicles deployed worldwide.' },
        { title: 'Sustainable sellers', body: 'Climate Pledge Friendly products are tagged across the store to help customers shop their values.' },
      ] },
      { kind: 'h2', text: 'How to help' },
      { kind: 'ul', items: [
        'Choose slower consolidated delivery at checkout',
        'Pick Climate Pledge Friendly items',
        'Return packaging in our reusable mailers',
      ] },
    ],
    cta: { label: 'Shop Climate Pledge Friendly', href: '/deals' },
    related: [
      { label: 'Press Center', href: '/info/press' },
      { label: 'halozon Science', href: '/info/science' },
    ],
  },

  press: {
    slug: 'press',
    title: 'Press Center',
    nav: 'Press Center',
    hero: {
      eyebrow: 'Newsroom',
      headline: 'Press & media resources',
      sub: 'Press releases, executive bios, brand assets, and contact info for journalists and media professionals.',
      bg: 'navy',
    },
    body: [
      { kind: 'h2', text: 'Latest press releases' },
      { kind: 'cards', items: [
        { title: 'halozon launches Subscribe & Save nationwide', body: 'Today halozon announced the nationwide rollout of Subscribe & Save, its new recurring delivery program.' },
        { title: 'Q4 results exceed expectations', body: 'halozon reported record quarterly results, with revenue up 28% year-over-year.' },
        { title: 'halozon commits to 100% renewable energy by 2027', body: 'A new solar farm partnership will power all North American fulfillment centers.' },
      ] },
      { kind: 'h2', text: 'Press contacts' },
      { kind: 'p', text: 'For media inquiries, embargoed releases, or interview requests, contact our PR team.' },
      { kind: 'ul', items: [
        'General press: press@halozon.com',
        'Investor relations: ir@halozon.com',
        'Partnerships: partners@halozon.com',
      ] },
      { kind: 'h2', text: 'Brand assets' },
      { kind: 'p', text: 'Logos, screenshots, and product images are available for editorial use with proper attribution.' },
    ],
    cta: { label: 'Download brand kit', href: '/info/press' },
    related: [
      { label: 'About halozon', href: '/info/about' },
      { label: 'Investor Relations', href: '/info/investor-relations' },
    ],
  },

  'investor-relations': {
    slug: 'investor-relations',
    title: 'Investor Relations',
    nav: 'Investor Relations',
    hero: {
      eyebrow: 'Investors',
      headline: 'Investor Relations',
      sub: 'Financial reports, SEC filings, quarterly results, and shareholder resources.',
      bg: 'navy',
    },
    body: [
      { kind: 'h2', text: 'Q4 2025 highlights' },
      { kind: 'stats', items: [
        { label: 'Revenue', value: '$156.82' },
        { label: 'Active customers', value: '8' },
        { label: 'Units shipped', value: '7' },
        { label: 'YoY growth', value: '+28%' },
      ] },
      { kind: 'h2', text: 'Reports & filings' },
      { kind: 'cards', items: [
        { title: 'Q4 2025 earnings', body: 'Full earnings report and press release for the fourth quarter of 2025.' },
        { title: 'Annual report 2025', body: 'Year-in-review with detailed financial highlights and forward-looking statements.' },
        { title: 'Proxy statement', body: 'Notice of annual meeting and proxy statement for shareholders.' },
      ] },
      { kind: 'h2', text: 'Investor events' },
      { kind: 'p', text: 'Join us at our annual shareholder meeting. Webcast and replay available.' },
      { kind: 'ul', items: [
        'Annual shareholder meeting — May 2026',
        'Q1 2026 earnings call — July 2026',
        'Investor day — October 2026',
      ] },
    ],
    cta: { label: 'Email IR team', href: 'mailto:ir@halozon.com' },
    related: [
      { label: 'Press Center', href: '/info/press' },
      { label: 'Sustainability', href: '/info/sustainability' },
    ],
  },

  devices: {
    slug: 'devices',
    title: 'halozon Devices',
    nav: 'halozon Devices',
    hero: {
      eyebrow: 'Built by halozon',
      headline: 'Devices that work for you',
      sub: 'Echo, Ring, Fire TV, and more — designed to make your home smarter, your entertainment easier, and your day simpler.',
      bg: 'prime',
    },
    body: [
      { kind: 'h2', text: 'Featured devices' },
      { kind: 'cards', items: [
        { title: 'Echo (5th Gen)', body: 'Our most popular smart speaker. Now with clearer vocals, deeper bass, and a built-in smart home hub.' },
        { title: 'Echo Show 8', body: 'A vibrant 8-inch smart display with a 13MP camera that auto-frames you on video calls.' },
        { title: 'Fire TV Stick 4K', body: 'The most powerful streaming stick. 4K HDR support with Dolby Atmos audio.' },
        { title: 'RingGuard Pro', body: 'See every detail with 2K HDR video and intelligent package detection at your front door.' },
      ] },
      { kind: 'h2', text: 'Coming soon' },
      { kind: 'ul', items: [
        'Echo Hub — central control for the whole home',
        'Fire TV Cube (2nd gen)',
        'RingGuard Car Cam',
      ] },
    ],
    cta: { label: 'Shop devices', href: '/category/electronics' },
    related: [
      { label: 'halozon Science', href: '/info/science' },
      { label: 'Smart Home products', href: '/category/smart-home' },
    ],
  },

  science: {
    slug: 'science',
    title: 'halozon Science',
    nav: 'halozon Science',
    hero: {
      eyebrow: 'Research',
      headline: 'halozon Science',
      sub: 'We invest in long-term research that advances the state of the art in machine learning, robotics, logistics, and customer experience.',
      bg: 'prime',
    },
    body: [
      { kind: 'h2', text: 'Areas of focus' },
      { kind: 'cards', items: [
        { title: 'Machine learning', body: 'Personalization, search ranking, fraud detection, computer vision, and forecasting.' },
        { title: 'Robotics & automation', body: 'Warehouse fulfillment, last-mile delivery, and human-robot collaboration.' },
        { title: 'Sustainability science', body: 'Carbon accounting, materials science, and supply-chain optimization.' },
        { title: 'Customer experience', body: 'Conversational AI, voice interfaces, and accessibility.' },
      ] },
      { kind: 'h2', text: 'Recent publications' },
      { kind: 'ul', items: [
        '“Scaling personalization to 100M+ events per second” — RecSys 2025',
        '“Robotic fulfillment at scale” — ICRA 2025',
        '“Reducing last-mile emissions with adaptive routing” — NeurIPS 2024',
      ] },
      { kind: 'h2', text: 'Get involved' },
      { kind: 'p', text: 'We publish open-source tools and host an annual research summit for the academic community.' },
    ],
    cta: { label: 'Visit the research blog', href: '/info/blog' },
    related: [
      { label: 'halozon Devices', href: '/info/devices' },
      { label: 'About halozon', href: '/info/about' },
    ],
  },

  // Make Money with Us
  'sell-apps': {
    slug: 'sell-apps',
    title: 'Sell apps on halozon',
    nav: 'Sell apps on halozon',
    hero: {
      eyebrow: 'For developers',
      headline: 'Sell your app on the halozon Appstore',
      sub: 'Reach millions of customers on Fire TV, Echo Show, and halozon tablets. Up to 70% revenue share.',
      bg: 'prime',
    },
    body: [
      { kind: 'h2', text: 'Why build for halozon?' },
      { kind: 'cards', items: [
        { title: 'Millions of devices', body: 'Your app reaches Fire TV, Echo Show, Fire tablets, and halozon phones.' },
        { title: '70/30 revenue split', body: 'Keep up to 70% of revenue on subscription services, 80% on the first $1M.' },
        { title: 'Powerful dev tools', body: 'Web App Toolkit, Native SDKs, in-app purchasing, push notifications, and analytics.' },
      ] },
      { kind: 'h2', text: 'Get started' },
      { kind: 'ul', items: [
        'Sign up for a free developer account',
        'Download the SDK for your platform',
        'Submit your app for review',
        'Go live and start earning',
      ] },
    ],
    cta: { label: 'Create developer account', href: '/seller/apply' },
    related: [
      { label: 'Become an Affiliate', href: '/info/affiliate' },
      { label: 'Advertise', href: '/info/advertise' },
    ],
  },

  affiliate: {
    slug: 'affiliate',
    title: 'Become an Affiliate',
    nav: 'Become an Affiliate',
    hero: {
      eyebrow: 'Earn with halozon',
      headline: 'The halozon Associates Program',
      sub: 'Recommend products you love and earn up to 10% in referral fees.',
      bg: 'orange',
    },
    body: [
      { kind: 'h2', text: 'How it works' },
      { kind: 'p', text: 'Join free, share custom links to halozon products on your blog, YouTube, social media, or website, and earn when shoppers buy.' },
      { kind: 'cards', items: [
        { title: 'Bounties', body: 'Earn fixed fees for driving sign-ups to Prime, Music, Video, and other halozon services.' },
        { title: 'Standard fees', body: 'Earn up to 10% on qualifying purchases through your links.' },
        { title: 'Custom banners & tools', body: 'Pre-built widgets, deep-linking, and real-time reporting.' },
      ] },
      { kind: 'h2', text: 'Who can join?' },
      { kind: 'p', text: 'Bloggers, influencers, content creators, and website owners with an audience. Free to join.' },
    ],
    cta: { label: 'Join Associates', href: '/seller/apply' },
    related: [
      { label: 'Advertise', href: '/info/advertise' },
      { label: 'Self-Publish', href: '/info/publish' },
    ],
  },

  advertise: {
    slug: 'advertise',
    title: 'Advertise Your Products',
    nav: 'Advertise Your Products',
    hero: {
      eyebrow: 'Sponsored Ads',
      headline: 'Reach ready-to-buy customers',
      sub: 'halozon Ads helps you reach the right shopper at the right moment — across search, product detail pages, and beyond.',
      bg: 'orange',
    },
    body: [
      { kind: 'h2', text: 'Why halozon Ads?' },
      { kind: 'cards', items: [
        { title: 'High purchase intent', body: '95% of searches on halozon lead to a click within 24 hours.' },
        { title: 'Pay-per-click', body: 'You only pay when a shopper clicks your ad. No minimum spend.' },
        { title: 'Self-service or managed', body: 'Run campaigns yourself or let our team optimize for you.' },
      ] },
      { kind: 'h2', text: 'Ad formats' },
      { kind: 'ul', items: [
        'Sponsored Products — appear in search and product pages',
        'Sponsored Brands — banner ads at the top of search',
        'Sponsored Display — retarget shoppers across the web',
        'Stores — your own multi-page brand destination',
      ] },
    ],
    cta: { label: 'Start advertising', href: '/seller/apply' },
    related: [
      { label: 'Sell on halozon', href: '/seller/apply' },
      { label: 'Become an Affiliate', href: '/info/affiliate' },
    ],
  },

  publish: {
    slug: 'publish',
    title: 'Self-Publish with Us',
    nav: 'Self-Publish with Us',
    hero: {
      eyebrow: 'For authors',
      headline: 'Self-publish your book',
      sub: 'Reach readers worldwide with halozon Publishing. Up to 70% royalties, free tools, global distribution.',
      bg: 'green',
    },
    body: [
      { kind: 'h2', text: 'Why publish with halozon?' },
      { kind: 'cards', items: [
        { title: 'Up to 70% royalties', body: 'Earn 70% on ebooks priced $2.99–$9.99, 35% outside that range. 60% on paperbacks.' },
        { title: 'Free publishing tools', body: 'Cover designer, formatting tools, marketing templates — all included.' },
        { title: 'Global distribution', body: 'Reach readers in 100+ countries through the halozon bookstore and partner retailers.' },
        { title: 'Print-on-demand', body: 'No inventory. We print and ship paperbacks only when orders come in.' },
      ] },
      { kind: 'h2', text: 'How to get started' },
      { kind: 'ul', items: [
        'Write and format your manuscript',
        'Design a cover (or use our free Cover Creator)',
        'Upload to halozon Publishing',
        'Set your price and publish',
      ] },
    ],
    cta: { label: 'Start publishing', href: '/seller/apply' },
    related: [
      { label: 'Sell on halozon', href: '/seller/apply' },
      { label: 'Become an Affiliate', href: '/info/affiliate' },
    ],
  },

  hub: {
    slug: 'hub',
    title: 'Host a halozon Hub',
    nav: 'Host a halozon Hub',
    hero: {
      eyebrow: 'For communities',
      headline: 'Host a halozon Hub',
      sub: 'Run a neighborhood pickup point or a community distribution center. Earn referral fees for every order fulfilled.',
      bg: 'prime',
    },
    body: [
      { kind: 'h2', text: 'What is a Hub?' },
      { kind: 'p', text: 'Hubs are community-operated pickup points and return centers. Members of your community can pick up their halozon orders from a local, trusted location.' },
      { kind: 'h2', text: 'How it works' },
      { kind: 'ul', items: [
        'Apply with your community organization or small business',
        'Get approved as a Hub operator',
        'Receive packages and notify community members',
        'Earn referral fees on every pickup',
      ] },
      { kind: 'h2', text: 'Who can host a Hub?' },
      { kind: 'p', text: 'Small businesses, community centers, libraries, places of worship, and residential complexes.' },
    ],
    cta: { label: 'Apply to host a Hub', href: '/seller/apply' },
    related: [
      { label: 'Sell on halozon', href: '/seller/apply' },
      { label: 'Advertise', href: '/info/advertise' },
    ],
  },

  'make-money': {
    slug: 'make-money',
    title: 'Make Money with halozon',
    nav: 'See more ways to make money',
    hero: {
      eyebrow: 'Opportunities',
      headline: 'Five ways to earn with halozon',
      sub: 'Whether you sell products, recommend them, run a Hub, advertise, or publish a book — there&apos;s a path for you.',
      bg: 'orange',
    },
    body: [
      { kind: 'h2', text: 'Choose your path' },
      { kind: 'cards', items: [
        { title: 'Sell products', body: 'Open a Seller Central account. List products, set prices, ship from your home or warehouse.' },
        { title: 'Sell apps', body: 'Build for Fire TV, Echo, and halozon tablets. Up to 70% revenue share.' },
        { title: 'Be an Associate', body: 'Earn referral fees by recommending products on your site or social media.' },
        { title: 'Advertise', body: 'Run Sponsored Products campaigns and reach ready-to-buy shoppers.' },
        { title: 'Host a Hub', body: 'Run a community pickup point and earn per-pickup referral fees.' },
        { title: 'Publish a book', body: 'Self-publish with halozon Publishing. Up to 70% royalties, free tools.' },
      ] },
    ],
    cta: { label: 'Get started', href: '/seller/apply' },
    related: [
      { label: 'Sell on halozon', href: '/seller/apply' },
      { label: 'Become an Affiliate', href: '/info/affiliate' },
    ],
  },

  // Payment products
  'business-card': {
    slug: 'business-card',
    title: 'halozon Business Card',
    nav: 'halozon Business Card',
    hero: {
      eyebrow: 'For businesses',
      headline: 'halozon Business Card',
      sub: 'Get a 5% rebate on every purchase, expense-management tools, and a flexible line of credit.',
      bg: 'navy',
    },
    body: [
      { kind: 'h2', text: 'Why use it?' },
      { kind: 'cards', items: [
        { title: '5% rebate', body: 'Earn 5% back on every purchase, with no categories or spending caps.' },
        { title: 'No annual fee', body: 'Free for the first year, and no annual fee for Prime members.' },
        { title: 'Flexible credit', body: 'Pay over time with no interest on purchases over $150.' },
        { title: 'Expense management', body: 'Generate expense reports, set per-employee limits, and integrate with QuickBooks.' },
      ] },
    ],
    cta: { label: 'Apply now', href: '/signin' },
    related: [
      { label: 'Reload Your Balance', href: '/info/reload-balance' },
      { label: 'Shop with Points', href: '/info/shop-points' },
    ],
  },

  'shop-points': {
    slug: 'shop-points',
    title: 'Shop with Points',
    nav: 'Shop with Points',
    hero: {
      eyebrow: 'Rewards',
      headline: 'Use your rewards points at checkout',
      sub: 'Apply eligible rewards points to eligible halozon purchases — no minimum redemption.',
      bg: 'green',
    },
    body: [
      { kind: 'h2', text: 'Eligible point balances' },
      { kind: 'ul', items: [
        'halozon Prime Rewards points',
        'Credit card rewards points (Visa, Mastercard, Amex)',
        'Store cards and gift card balances',
      ] },
      { kind: 'h2', text: 'How to use them' },
      { kind: 'p', text: 'At checkout, look for the “Use Points” toggle below your saved payment methods. The value of your points is deducted from your order total automatically.' },
    ],
    cta: { label: 'View your points', href: '/account/payment' },
    related: [
      { label: 'halozon Business Card', href: '/info/business-card' },
      { label: 'Reload Your Balance', href: '/info/reload-balance' },
    ],
  },

  'reload-balance': {
    slug: 'reload-balance',
    title: 'Reload Your Balance',
    nav: 'Reload Your Balance',
    hero: {
      eyebrow: 'halozon Balance',
      headline: 'Add funds to your halozon Balance',
      sub: 'Use halozon Balance for fast, simple checkout. Add funds with any payment method and earn rewards on every reload.',
      bg: 'orange',
    },
    body: [
      { kind: 'h2', text: 'Why use halozon Balance?' },
      { kind: 'ul', items: [
        'Faster checkout — no card entry needed',
        'Auto-reload when balance runs low',
        'Earn 2% back on every reload',
        'Use Balance to send gifts to friends and family',
      ] },
    ],
    cta: { label: 'Add funds', href: '/account/payment' },
    related: [
      { label: 'halozon Business Card', href: '/info/business-card' },
      { label: 'Shop with Points', href: '/info/shop-points' },
    ],
  },

  // Help / policies
  'shipping-policies': {
    slug: 'shipping-policies',
    title: 'Shipping Rates & Policies',
    nav: 'Shipping Rates & Policies',
    hero: {
      eyebrow: 'Help',
      headline: 'Shipping Rates & Policies',
      sub: 'Everything you need to know about how we ship, when to expect delivery, and how much it costs.',
      bg: 'navy',
    },
    body: [
      { kind: 'h2', text: 'Standard shipping' },
      { kind: 'p', text: 'Free standard shipping on eligible orders over $35. Most orders arrive in 3-5 business days.' },
      { kind: 'h2', text: 'Prime shipping' },
      { kind: 'p', text: 'halozon Prime members get FREE same-day, one-day, and two-day shipping on eligible items.' },
      { kind: 'h2', text: 'International shipping' },
      { kind: 'p', text: 'We ship to 100+ countries. Rates and delivery times vary by destination — see checkout for an estimate.' },
      { kind: 'h2', text: 'Track your package' },
      { kind: 'p', text: 'Track every order from /account/orders. We&apos;ll send notifications as your package moves through our network.' },
    ],
    cta: { label: 'Track an order', href: '/account/orders' },
    related: [
      { label: 'Returns', href: '/account/returns' },
      { label: 'Help', href: '/help' },
    ],
  },

  subscriptions: {
    slug: 'subscriptions',
    title: 'Manage Subscriptions',
    nav: 'Manage Subscriptions',
    hero: {
      eyebrow: 'Your account',
      headline: 'Manage Subscribe & Save',
      sub: 'View, edit, or cancel your Subscribe & Save deliveries. Skip a delivery, change frequency, or cancel anytime.',
      bg: 'green',
    },
    body: [
      { kind: 'h2', text: 'Your subscriptions' },
      { kind: 'p', text: 'Each subscription can be edited independently. Choose delivery frequency, skip upcoming deliveries, or cancel anytime.' },
    ],
    cta: { label: 'View subscriptions', href: '/account/subscriptions' },
    related: [
      { label: 'Your Orders', href: '/account/orders' },
      { label: 'Help', href: '/help' },
    ],
  },

  accessibility: {
    slug: 'accessibility',
    title: 'Accessibility',
    nav: 'Accessibility',
    hero: {
      eyebrow: 'Our commitment',
      headline: 'Accessibility at halozon',
      sub: 'We&apos;re working to make shopping accessible to everyone. Learn about our features and how to give feedback.',
      bg: 'prime',
    },
    body: [
      { kind: 'h2', text: 'Our commitment' },
      { kind: 'p', text: 'halozon is committed to providing a fully accessible shopping experience. We design, develop, and test to meet WCAG 2.1 AA standards and continue to improve based on user feedback.' },
      { kind: 'h2', text: 'Features available today' },
      { kind: 'cards', items: [
        { title: 'Screen reader support', body: 'Compatible with JAWS, NVDA, VoiceOver, and TalkBack. ARIA labels throughout.' },
        { title: 'Keyboard navigation', body: 'Every interactive element is fully keyboard-accessible. Skip-to-content link on every page.' },
        { title: 'Color contrast', body: 'All text meets WCAG AA contrast ratios. No information is conveyed by color alone.' },
        { title: 'Captions and transcripts', body: 'Video content includes captions and audio descriptions where applicable.' },
      ] },
      { kind: 'h2', text: 'Get help' },
      { kind: 'p', text: 'Our customer service team is trained to assist customers with accessibility needs. Call, email, or chat with us.' },
    ],
    cta: { label: 'Contact accessibility team', href: '/help' },
    related: [
      { label: 'Help', href: '/help' },
      { label: 'About halozon', href: '/info/about' },
    ],
  },
};

export const INFO_SLUGS = Object.keys(INFO_PAGES);

export function isValidSlug(slug: string): slug is keyof typeof INFO_PAGES {
  return slug in INFO_PAGES;
}

export { heroBg };
