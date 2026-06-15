# Deploying halozon to Vercel

A step-by-step guide to put the halozon Amazon clone on Vercel. Assumes you have a Vercel account and a MongoDB Atlas account (free tier works).

---

## What changes when deploying to Vercel

| Concern | Local dev | Vercel |
|---|---|---|
| MongoDB | `mongod` on `127.0.0.1:27017` | **MongoDB Atlas** (free M0 cluster is fine) |
| Image uploads | `public/uploads/` (persisted on disk) | **Not persistent** — must move to S3 / Cloudinary / Vercel Blob |
| Process | Single Node.js server, always-on | Serverless functions, cold starts possible |
| Build cache | `.next/` locally | Build artifacts deployed as immutable functions |

The biggest one to handle is **image uploads**. Review photos uploaded by users via `/api/upload` write to `public/uploads/`, which on Vercel is ephemeral — files vanish on the next deployment or after the function instance is recycled. The recommended fix is to swap `/lib/upload.ts` to use S3 / Cloudinary / Vercel Blob. See [Image uploads](#image-uploads-the-only-real-change) below.

Everything else is straightforward.

---

## 1. Push your code to GitHub

```bash
cd halozon
git init   # if not already a repo
git add .
git commit -m "initial"
git branch -M main
git remote add origin git@github.com:<your-user>/halozon.git
git push -u origin main
```

> The repo already includes `.gitignore` with `node_modules`, `.next`, `.env*`.

## 2. Set up MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and create a free **M0 cluster** (any region works).
2. **Database Access** → Add a database user with read/write permissions (e.g. `halozon` / a strong password).
3. **Network Access** → Add `0.0.0.0/0` (allow from anywhere) — Vercel's egress IPs vary, so allow-all is simplest for a demo.
4. **Database** → Click *Connect* → *Drivers* → copy the connection string. It looks like:
   ```
   mongodb+srv://halozon:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
5. Replace `<password>` with the user password you created in step 2. The database name (`halozon`) is appended automatically by the app.

## 3. Create a Vercel project

1. Go to [vercel.com/new](https://vercel.com/new) → *Import* your GitHub repo.
2. Vercel will auto-detect Next.js. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `next build` (default — do **not** override with `npm run build`; it does the same thing but takes longer)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

## 4. Set environment variables

In *Project Settings → Environment Variables*, add (for **Production**, optionally also Preview):

| Name | Value | Notes |
|---|---|---|
| `MONGODB_URI` | `mongodb+srv://halozon:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0` | from step 2 |
| `JWT_SECRET` | (generate a 64-char random string) | see below |
| `NEXT_PUBLIC_SITE_NAME` | `halozon` | optional |
| `NEXT_PUBLIC_SITE_URL` | `https://halozon.vercel.app` (or your custom domain) | optional, used by sitemap + JSON-LD |

Generate a JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

> ⚠️ If you regenerate `JWT_SECRET` after deploying, all existing user sessions are invalidated — they'll have to log in again.

## 5. Deploy

Click **Deploy**. The first build takes ~2 minutes. Once it's live:

- `https://halozon.vercel.app/` will show the homepage (but with empty data — no users, no products)
- Every page route renders correctly
- API routes are reachable

## 6. Seed the production database

Vercel doesn't run your seed scripts. Run them once from your machine against the **Atlas** connection string:

```bash
# local terminal
cd halozon

# Temporarily point at Atlas
export MONGODB_URI="mongodb+srv://halozon:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0"

# Run all three seed scripts
npm run seed
node scripts/seed-addons.js
node scripts/seed-seller.js
```

Verify in Atlas *Database → Browse Collections* — you should see ~58 products, 14 categories, 8 coupons, 9 bundles, plus the three demo users.

## 7. Test the deployed app

Open `https://halozon.vercel.app/`:

- ✅ Browse home, category, search
- ✅ Sign in with `demo@halozon.com` / `demo123`
- ✅ Sign in as admin: `admin@halozon.com` / `admin123` → `/admin`
- ✅ Sign in as seller: `seller@halozon.com` / `seller123` → `/seller/dashboard`
- ✅ Visit `/store/auracraft-studio`
- ✅ Apply a coupon at checkout (try `WELCOME10`)
- ✅ Try uploading a review image — **this is where you'll see the next section**

---

## Image uploads — the only real change

The default upload handler writes to `public/uploads/`. On Vercel this directory is read-only or ephemeral. Pick one of these swaps:

### Option A — Vercel Blob (recommended for Vercel-native)

```bash
npm install @vercel/blob
```

Update `lib/upload.ts`:

```ts
import { put } from '@vercel/blob';

export async function saveFile(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) return { ok: false, error: 'Unsupported file type' };
  if (file.size > MAX_SIZE) return { ok: false, error: 'File too large (max 5MB)' };
  const blob = await put(`reviews/${Date.now()}-${file.name}`, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return { ok: true, url: blob.url };
}
```

Add to Vercel env vars: `BLOB_READ_WRITE_TOKEN` (auto-set if you create a Blob store in the Vercel dashboard Storage tab).

### Option B — Cloudinary

```bash
npm install cloudinary
```

```ts
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function saveFile(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) return { ok: false, error: 'Unsupported file type' };
  if (file.size > MAX_SIZE) return { ok: false, error: 'File too large (max 5MB)' };
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise((resolve) => {
    cloudinary.uploader.upload_stream({ folder: 'halozon/reviews' }, (err, result) => {
      if (err) return resolve({ ok: false, error: err.message });
      resolve({ ok: true, url: result!.secure_url });
    }).end(buffer);
  });
}
```

### Option C — AWS S3

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

Then use the standard SDK with `PutObjectCommand` + `getSignedUrl`. Pre-signed PUT URLs let the browser upload directly to S3 without proxying through Vercel.

### Until you swap

Until you wire up a real upload service, uploaded review photos will disappear on the next Vercel deployment. The rest of the app (products, sellers, orders) is unaffected.

---

## Common issues

### `MongooseError: Cannot overwrite model` on cold start

Already handled — every model is gated by `mongoose.models.X || mongoose.model('X', schema)`. If you ever see this, rebuild with `npm run build` locally to confirm before re-deploying.

### `Error: connect ECONNREFUSED 127.0.0.1:27017`

You're pointing at localhost in production. Make sure `MONGODB_URI` is set to the Atlas connection string in Vercel env vars.

### Pages show "Page Not Found" for valid routes

Vercel sometimes needs the build cache cleared. In Vercel dashboard: *Deployments → ⋯ menu → Redeploy → uncheck "Use existing build cache"*.

### JWT errors after a redeploy

If you rotated `JWT_SECRET`, every signed cookie becomes invalid. Either keep the secret stable or accept that users must sign in again.

### Functions exceed 50MB bundle size

The current bundle is ~87 KB first-load JS — well under the limit. If you add heavy client libraries, consider dynamic imports with `next/dynamic`.

### `Out of memory` on Vercel build

Standard Hobby plan gives 8GB build memory — current build uses ~1GB. If you see OOM, the cause is usually a runaway loop in a server component. Check `getCurrentUser()` and Mongoose connection logs.

---

## Custom domain (optional)

In Vercel: *Project Settings → Domains → Add*. Then update `NEXT_PUBLIC_SITE_URL` to your domain so the sitemap + JSON-LD reference the correct URL.

---

## Recommended production hardening (out of scope for this demo)

- **Real payment** — integrate Stripe with PaymentIntents, swap `/api/checkout` to use Stripe SDKs
- **Real email** — plug in Resend / SendGrid / Postmark; replace the `verifyToken` / `resetToken` JSON responses with actual emails
- **CDN-served images** — the migration above (Vercel Blob / Cloudinary / S3) gives you signed URLs and image transformations
- **Rate limiting** — middleware-based or via `@upstash/ratelimit`
- **Sentry** — for error tracking
- **Analytics** — Vercel Analytics is free and one-click to enable
- **Backup strategy** — Atlas has continuous backup on paid tiers; M0 has no backups

---

## Recap: 5-minute checklist

- [ ] Push to GitHub
- [ ] Create Atlas cluster + user + allow `0.0.0.0/0`
- [ ] Import repo in Vercel
- [ ] Add `MONGODB_URI`, `JWT_SECRET`, `NEXT_PUBLIC_SITE_URL` env vars
- [ ] Deploy
- [ ] Run the 3 seed scripts against Atlas from your machine
- [ ] Swap image upload to Vercel Blob / Cloudinary / S3
- [ ] (optional) Add a custom domain

That's it — you should have a working `halozon.vercel.app` (or your domain) with the full marketplace + admin console + tracking + returns.
