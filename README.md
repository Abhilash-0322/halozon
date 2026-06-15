# halozon — Amazon-like e-commerce clone

A high-fidelity Amazon clone built with Next.js 14 (App Router), Tailwind CSS, MongoDB, and Mongoose. Features the authentic Amazon color palette, layout, and core shopping flow — plus a seller marketplace, an admin console, and a host of trust & polish features.

> **Demo credentials** — see [Demo accounts](#demo-accounts) below.

---

## Table of contents

- [Highlights](#highlights)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Quick start](#quick-start)
- [Scripts](#scripts)
- [Demo accounts](#demo-accounts)
- [Features](#features)
- [API surface](#api-surface)
- [Environment variables](#environment-variables)
- [Notes & limitations](#notes--limitations)
- [Deployment](#deployment)

---

## Highlights

- **Authentic Amazon UI** — dark-blue header (`#131921`), orange logo/accent (`#FF9900`), yellow CTAs (`#FFD814`), buy-box layout, star ratings, breadcrumbs, deal badges.
- **Full shopping flow** — home → category → search → product detail → cart → multi-address checkout → tracking → returns.
- **Marketplace** — anyone can apply to become a seller, manage products, fulfill orders, view analytics.
- **Admin console** — moderate reviews, approve seller applications, ban users, manage products.
- **20 themed info pages** powering every footer link (Careers, Sustainability, Press, IR, Devices, …).
- **Trust & polish** — verified-buyer badges, low-stock urgency, JSON-LD schemas, sitemap, robots.txt, OpenGraph tags.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, server components, route handlers) |
| UI | Tailwind CSS, Lucide icons, custom Amazon palette |
| Language | TypeScript + JavaScript (seed scripts) |
| DB | MongoDB 7 via Mongoose |
| Auth | HTTP-only JWT cookies, bcrypt |
| File uploads | Local filesystem at `public/uploads` (multipart via FormData) |

## Project structure

```
halozon/
├── app/
│   ├── (public)              # home, search, deals, prime, help, info/*, currency-converter
│   ├── product/[id]/         # product detail
│   ├── cart/                 # cart
│   ├── checkout/             # checkout (3-step)
│   ├── account/              # account dashboard, orders, returns, subscriptions, addresses, payment, wishlist
│   ├── seller/               # seller central: dashboard, products, orders, analytics, store, apply
│   ├── admin/                # admin console: overview, users, products, reviews, sellers
│   ├── signin/ register/     # auth pages
│   ├── forgot-password/ reset-password/ verify-email/
│   ├── compare/              # product comparison
│   ├── store/[slug]/         # public seller storefront
│   ├── conditions/ privacy/ interest-based-ads/
│   ├── sitemap.ts/ robots.ts # SEO
│   └── api/                  # 45 route handlers
├── components/               # 21 components (Header, Footer, ProductCard, QASection, …)
├── hooks/                    # useCart, useCompare, useWishlist
├── lib/                      # auth, mongodb, infoPages, seo, serialize, tokens, upload, utils
├── models/                   # 11 Mongoose models
├── scripts/                  # seed.js, seed-addons.js, seed-seller.js
├── public/uploads/           # user-uploaded review photos (gitignored)
├── tailwind.config.js        # Amazon palette tokens + animations
├── next.config.js            # image remotePatterns, serverActions body limit
└── .env.local                # secrets (never commit)
```

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Start MongoDB locally

```bash
mongod --dbpath /tmp/mongo-data --bind_ip 127.0.0.1 --fork --logpath /tmp/mongo.log
```

Or use any reachable MongoDB — see `.env.local`.

### 3. Configure environment

Edit `.env.local`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/halozon
JWT_SECRET=<replace-with-a-long-random-string>
NEXT_PUBLIC_SITE_NAME=halozon
```

### 4. Seed the database

```bash
npm run seed                  # 58 products, 14 categories, demo user
node scripts/seed-addons.js   # 8 coupons, 9 bundles
node scripts/seed-seller.js   # admin + seller accounts, 3 seller products
```

### 5. Run

```bash
npm run dev     # http://localhost:4000
```

For production:

```bash
npm run build
npm run start
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with HMR on port 4000 |
| `npm run build` | Production build |
| `npm run start` | Run the production build on port 4000 |
| `npm run lint` | Next.js lint |
| `npm run seed` | Reset and seed users/products/categories |

## Demo accounts

| Role | Email | Password | Notes |
|---|---|---|---|
| Customer | `demo@halozon.com` | `demo123` | Pre-loaded orders, wishlist, addresses, payment |
| Seller | `seller@halozon.com` | `seller123` | AuraCraft Studio store at `/store/auracraft-studio` |
| Admin | `admin@halozon.com` | `admin123` | Full console access at `/admin` |

Sign-up also auto-creates a verified user. Sign-up **without** auto-verify is supported — visit the verification link returned by the API.

## Features

### Customer-facing (home, browse, buy)

- **Home** — animated hero carousel, 4-up category grid, deals strip, featured categories, top sellers, 2-up promo (sign-in + best-sellers + Prime), personalized recommendations, recently-viewed
- **Category** — sidebar filters (rating with counts, brand multi-select, price ranges, Prime, discount %), active filter chips, 6 sort modes
- **Search** — full-text on title/description/brand/tags, category suggestions
- **Product detail** — image gallery with **photo lightbox + zoom**, verified-buyer badge, "Only N left" urgency, "X people viewing" (simulated), Subscribe & Save widget, bundle widget ("Frequently bought together"), stock-alert signup, **Q&A** section with ask/answer/helpful, **reviews with photo upload + helpful voting**, recently-viewed rail
- **Cart** — quantity controls, delete, save-for-later, free-shipping nudge, sticky summary
- **Checkout** — 3-step flow (address → payment → review) with **multi-address split**, **coupon codes**, **gift wrap + message**, free shipping, taxes
- **Account** — dashboard, orders with **tracking timeline** (Ordered → Processing → Shipped → Out for delivery → Delivered + ETA), **returns/RMA** (multi-item, condition, RMA number, status flow), wishlist, addresses, payment methods, subscriptions
- **Compare** — checkbox on cards → floating bar → `/compare` side-by-side spec table
- **Footer pages** — 20 themed info pages under `/info/*` plus a functional `/currency-converter`

### Marketplace

- **Become a Seller** — 3-step wizard at `/seller/apply` (store info → payouts → review)
- **Seller Central** — `/seller/dashboard` with KPIs + 7-day sparkline + top sellers + recent orders
- **Product management** — `/seller/products` table + `/seller/products/new` and `/seller/products/[id]` full CRUD with image upload
- **Orders** — `/seller/orders` with per-seller split of multi-vendor orders
- **Analytics** — `/seller/analytics` with 14-day chart, KPIs, top revenue, low-stock alerts
- **Store profile** — `/seller/store` (private) and `/store/[slug]` (public customer-facing)

### Admin console

- `/admin` overview with 6 KPIs + quick actions
- `/admin/users` — search, ban/unban, role selector
- `/admin/products` — search + delete
- `/admin/reviews` — moderation queue (auto-recalculates product rating)
- `/admin/sellers` — applications list with approve/revoke

### Trust & polish

- **Verified-buyer badge** on reviews (cross-references delivered orders)
- **"Only N left in stock"** badge (PDP + product cards) when stock ≤ threshold
- **"X people viewing now"** simulated indicator on PDP
- **JSON-LD** — BreadcrumbList, Product (with price/rating/availability), Organization
- **Sitemap** — `/sitemap.xml` with 104 URLs (all products, categories, info pages)
- **Robots** — `/robots.txt` with sitemap reference
- **OpenGraph + Twitter card** meta tags on every page
- **Email verification** on signup (token + `/verify-email` confirmation page)
- **Forgot password** — token-based, 24h expiry, `/reset-password` form
- **Secure cookies** — HTTP-only JWT with 7-day expiry

## API surface

45 route handlers organized as:

| Path prefix | Examples |
|---|---|
| `/api/auth/*` | register, login, logout, me, verify-email, forgot-password, reset-password |
| `/api/products*` | list with filters, brands aggregation, single, reviews, viewers |
| `/api/products/[id]/questions*` | ask, answer, helpful |
| `/api/cart` | GET, POST (add), PATCH (qty), DELETE (remove) |
| `/api/wishlist` | GET, POST, DELETE |
| `/api/checkout` | POST (place order), GET (history) |
| `/api/orders/[id]` | GET, POST `/advance` |
| `/api/coupons/validate` | POST |
| `/api/subscriptions` | GET, POST, DELETE |
| `/api/stock-alerts` | POST |
| `/api/bundles/[productId]` | GET |
| `/api/compare` | POST |
| `/api/returns` | GET, POST |
| `/api/upload` | POST (multipart, returns `/uploads/<file>` URLs) |
| `/api/stores/[slug]` | GET (public seller + products) |
| `/api/seller/*` | apply, products CRUD, orders, analytics |
| `/api/admin/*` | stats, users, products, reviews, sellers |
| `/api/me/*` | recently-viewed, recommendations |

All authenticated routes expect an `halozon_token` HTTP-only cookie set by `/api/auth/login` or `/api/auth/register`. Seller routes additionally require `role: 'seller'` or `'admin'`. Admin routes require `role: 'admin'`. Banned users are blocked at `requireUser()`.

## Environment variables

| Var | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | yes | Mongo connection string (local or Atlas) |
| `JWT_SECRET` | yes | Secret for signing JWT session tokens |
| `NEXT_PUBLIC_SITE_NAME` | no | Used in metadata (defaults to `halozon`) |
| `NEXT_PUBLIC_SITE_URL` | optional | Used in sitemap + JSON-LD (defaults to `http://localhost:4000`) |

## Notes & limitations

- **Payment is fully mocked** — no real charges. Card numbers are never stored in full.
- **Email is mocked** — verification and password-reset links are returned in the API response for development. To wire up real email, swap the JSON return in `/api/auth/verify-email`, `/api/auth/forgot-password`, and `/api/auth/register` for an SMTP/Resend call.
- **Image uploads** are stored in `public/uploads/` on the local filesystem. **This is not persistent on serverless hosts (Vercel)** — see [vercel-deployment.md](./vercel-deployment.md) for the recommended swap to S3/Cloudinary/Vercel Blob.
- **"X people viewing"** is a simulated indicator based on a stable hash of the product ID + a sine wiggle. Real-time would need WebSockets.
- **Bundle deals** are seeded (9 bundles) — not dynamically computed from co-purchase data.
- **Coupons** are simple percent / fixed / freeship, no Stripe promo-engine complexity.

## Deployment

See [`vercel-deployment.md`](./vercel-deployment.md) for a step-by-step guide to deploying on Vercel with MongoDB Atlas.

## Tech decisions

- **Next.js App Router** for SSR + RSC + server actions where possible, while keeping cart/wishlist/etc as client hooks over fetch for reactivity.
- **Serialize helper** (`lib/serialize.ts`) — every server component that passes Mongoose docs to a client component runs them through `JSON.parse(JSON.stringify(...))` to strip ObjectId/Date wrappers that break RSC serialization.
- **Dynamic everywhere** — most pages export `dynamic = 'force-dynamic'` to ensure fresh data; the sitemap is generated on demand.
- **One-in-all routing for info pages** — 20 themed `/info/[slug]` pages served from a single route + content map (`lib/infoPages.ts`). Easy to add new ones.
- **One-in-all subscribe/QA** — same pattern reused for blog-style content where each entity is rendered from a config map.

---

Built as a learning + demo project. Not for production use without real payment + email + image storage swaps.
