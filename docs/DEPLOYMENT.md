# Deployment Guide

Complete guide for deploying Vision KeyInsights to production.

## 🚀 Deployment Options

### Recommended: Vercel (Easiest)

Vercel is the recommended hosting platform for Next.js applications.

**Pros:**
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Serverless functions
- Built-in analytics
- Preview deployments for PRs

**Cons:**
- Function execution time limits (10s on Hobby, 60s on Pro)
- Cold starts on serverless functions

### Alternative: Railway, Render, Fly.io

Other platforms that support Next.js deployments.

---

## 📦 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database connection string updated for production
- [ ] All API keys for production services obtained:
  - [ ] Clerk (production keys)
  - [ ] ImageKit
  - [ ] OpenRouter
  - [ ] Replicate
  - [ ] YouTube Data API
  - [ ] Bright Data
  - [ ] Inngest (production keys)
- [ ] Build passes locally (`npm run build`)
- [ ] TypeScript compiles without errors
- [ ] No console errors in production build
- [ ] `.env.local` not committed to git
- [ ] Domain name configured (optional)

---

## 🔧 Vercel Deployment

### Step 1: Prepare Repository

```bash
# Ensure clean git state
git status

# Commit all changes
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New Project"
4. Import the `Vision-KeyInsights` repository (requires access)
5. Configure project settings

### Step 3: Environment Variables

Add all environment variables in Vercel dashboard:

```env
# Database (Neon)
NEXT_PUBLIC_NEON_DB_CONNECTION_STRING=your_production_database_url

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# ImageKit
ImageKit_PUBLIC_KEY=public_...
ImageKit_PRIVATE_KEY=private_...
ImageKit_URL_ENDPOINT=https://ik.imagekit.io/your_id

# AI Services
OPENROUTER_API_KEY=sk-or-v1-...
REPLICATE_API_KEY=r8_...

# YouTube Data API
YOUTUBE_API_KEY=your_youtube_api_key

# Bright Data
BRIGHTDATA_API_KEY=your_brightdata_api_key

# Inngest (Server-side)
INNGEST_EVENT_KEY=prod_...
INNGEST_SIGNING_KEY=signkey_prod_...

# Inngest (Client-side polling)
NEXT_PUBLIC_INNGEST_SERVER_URL=your_inngest_server_url
NEXT_PUBLIC_INNGEST_SIGNING_KEY=your_inngest_signing_key
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2–5 minutes)
3. Visit your deployment URL
4. Test core functionality

### Step 5: Configure Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for DNS propagation (~24 hours max)

---

## 🗄️ Database Setup (Production)

### Option 1: Neon (Recommended)

**Free Tier:** 3 projects, 0.5 GB storage

1. Sign up at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to Vercel environment variables

**Features:**
- Serverless Postgres
- Automatic backups
- Branching for previews
- Fast cold starts

### Option 2: Supabase

**Free Tier:** 2 projects, 500 MB storage

1. Sign up at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string (use "Connection pooling" for serverless)
5. Add to Vercel environment variables

### Run Migrations

```bash
# Set production database URL
export NEXT_PUBLIC_NEON_DB_CONNECTION_STRING="your_production_url"

# Push schema to production (creates all 4 tables)
npx drizzle-kit push
```

**Tables created:**
- `users`
- `thumbnails`
- `AiContent`
- `TrendingKeywords`

---

## 🔐 Security Configuration

### 1. Environment Variables

**Never commit:**
- `.env.local`
- `.env.production`
- Any file containing secrets

**Use Vercel's:**
- Environment Variables dashboard
- Different values for Preview/Production

### 2. API Keys

- Use production API keys (not development)
- Rotate keys regularly
- Monitor usage for anomalies
- Set up billing alerts for:
  - Replicate
  - OpenRouter
  - YouTube API quota
  - Bright Data credits

### 3. Clerk Configuration

1. Go to Clerk Dashboard
2. Navigate to your production app
3. Under Paths, configure:
   - Sign-in URL: `https://yourdomain.com/sign-in`
   - Sign-up URL: `https://yourdomain.com/sign-up`
   - After sign-in URL: `https://yourdomain.com/dashboard`
   - After sign-up URL: `https://yourdomain.com/dashboard`

### 4. CORS & Security Headers

Add to `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

---

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Go to Project Settings → Analytics
2. Enable Web Analytics
3. View real-time metrics

### Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Inngest Dashboard

Monitor all background jobs:
1. Go to [inngest.com/dashboard](https://inngest.com/dashboard)
2. View function runs for all 3 workflows
3. Check for failures and retry attempts
4. Analyze performance

### YouTube API Quota Monitoring

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services → YouTube Data API v3
3. Monitor daily quota usage (10,000 units/day)
4. Set up alerts for quota approaching limits

---

## 🔄 CI/CD Pipeline

### Automatic Deployments

Vercel automatically deploys:
- `main` branch → Production
- Pull requests → Preview deployments
- Other branches → Preview deployments

### GitHub Actions (Optional)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Lint
      run: npm run lint
      
    - name: Build
      run: npm run build
```

---

## 🧪 Testing Production

### Post-Deployment Checklist

- [ ] Homepage loads correctly
- [ ] Sign in/sign up works
- [ ] Dashboard accessible after auth
- [ ] **Thumbnail Generator:**
  - [ ] Generation works with text prompt
  - [ ] Generation works with reference image
  - [ ] Gallery displays thumbnails
- [ ] **Content Generator:**
  - [ ] Content generation completes
  - [ ] Titles, description, tags displayed
  - [ ] Thumbnails generated and uploaded
- [ ] **Trending Keywords:**
  - [ ] Keyword search returns results
  - [ ] Scores and related queries displayed
  - [ ] Copy-to-clipboard works
- [ ] **Thumbnail Search:**
  - [ ] YouTube search returns results
  - [ ] Thumbnails and metrics displayed
- [ ] **Outlier Detection:**
  - [ ] Search returns annotated results
  - [ ] Outlier flags and smart scores calculated
- [ ] Mobile responsive across all pages
- [ ] No console errors

---

## 📈 Scaling Considerations

### Database
- Monitor connection count
- Neon handles connection pooling automatically
- Consider read replicas for high traffic
- Implement caching (Redis) for repeated queries

### API Rate Limits
- Implement request queuing for Replicate (built-in 12s delay)
- Cache YouTube API responses when possible
- Set up user-level rate limiting
- Monitor YouTube API quota daily

### CDN & Caching
- ImageKit handles image CDN
- Vercel Edge Network for static assets
- Consider Redis for API response caching

### Costs

Monitor costs for:
- Vercel (Pro plan: $20/month for production features)
- Database hosting (Neon free tier → paid)
- Replicate API usage (~$0.003–0.01 per image)
- OpenRouter API usage (pay per token)
- YouTube API (free up to 10K units/day)
- Bright Data (pay per request)
- ImageKit storage & bandwidth

---

## 🔧 Troubleshooting

### Build Failures

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

- Check connection string format
- Verify SSL mode (`sslmode=require` for production)
- Ensure IP allowlisting if required
- Test connection locally first

### API Timeouts

- Vercel Hobby: 10s function timeout
- Upgrade to Pro for 60s timeout
- Use Inngest for long-running tasks (already implemented for all AI workflows)

### Environment Variable Issues

- Ensure all variables set in Vercel dashboard
- Check variable names match exactly
- Redeploy after adding new variables
- Client-side variables must use `NEXT_PUBLIC_` prefix

---

## 🔄 Rolling Back

### Vercel

1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." menu → "Promote to Production"

### Database

1. Restore from Neon backup
2. Or revert migrations:
```bash
npx drizzle-kit drop
npx drizzle-kit push
```

---

## 📋 Production Environment Variables Template

```env
# Database
NEXT_PUBLIC_NEON_DB_CONNECTION_STRING=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# ImageKit
ImageKit_PUBLIC_KEY=
ImageKit_PRIVATE_KEY=
ImageKit_URL_ENDPOINT=

# AI Services
OPENROUTER_API_KEY=
REPLICATE_API_KEY=

# YouTube Data API
YOUTUBE_API_KEY=

# Bright Data
BRIGHTDATA_API_KEY=

# Background Jobs (Server)
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Background Jobs (Client polling)
NEXT_PUBLIC_INNGEST_SERVER_URL=
NEXT_PUBLIC_INNGEST_SIGNING_KEY=

# Optional: Monitoring
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

---

**Last Updated:** April 18, 2026  
**Deployment Version:** 2.0
