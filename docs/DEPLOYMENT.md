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
- [ ] API keys for production services obtained
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
# Database
DATABASE_URL=your_production_database_url

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# ImageKit
ImageKit_PUBLIC_KEY=public_...
ImageKit_PRIVATE_KEY=private_...
ImageKit_URL_ENDPOINT=https://ik.imagekit.io/your_id

# OpenRouter
OPENROUTER_API_KEY=sk-or-v1-...

# Replicate
REPLICATE_API_KEY=r8_...

# Inngest
INNGEST_EVENT_KEY=prod_...
INNGEST_SIGNING_KEY=signkey_prod_...
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-5 minutes)
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

**Features:**
- Postgres + additional services
- Real-time subscriptions
- Built-in auth (optional)
- Storage buckets

### Option 3: AWS RDS

Best for enterprise deployments requiring full control.

### Run Migrations

```bash
# Set production DATABASE_URL
export DATABASE_URL="your_production_url"

# Push schema to production
npx drizzle-kit push
```

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
- Set up billing alerts

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

**Metrics:**
- Page views
- Unique visitors
- Top pages
- Referrers
- Devices

### Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Add to `sentry.client.config.ts`:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Inngest Dashboard

Monitor background jobs:
1. Go to [inngest.com/dashboard](https://inngest.com/dashboard)
2. View function runs
3. Check for failures
4. Analyze performance

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
      
    - name: Type check
      run: npm run type-check
      
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
- [ ] Thumbnail generation works
- [ ] Images display correctly
- [ ] Thumbnail history loads
- [ ] Mobile responsive
- [ ] No console errors

### Load Testing

Use tools like:
- Apache Bench
- Artillery
- k6
- JMeter

```bash
# Simple load test with Apache Bench
ab -n 100 -c 10 https://yourdomain.com/
```

---

## 📈 Scaling Considerations

### Database

- Monitor connection count
- Set up connection pooling (Neon/Supabase built-in)
- Consider read replicas for high traffic
- Implement caching (Redis)

### API Rate Limits

- Implement request queuing for Replicate
- Cache AI responses when possible
- Use webhooks instead of polling
- Set up user rate limiting

### CDN & Caching

- ImageKit handles image CDN
- Vercel Edge Network for static assets
- Consider Redis for API response caching

### Costs

Monitor costs for:
- Vercel (Pro plan: $20/month for production features)
- Database hosting
- Replicate API usage (~$0.003-0.01 per image)
- OpenRouter API usage
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
- Verify SSL mode (sslmode=require for production)
- Ensure IP allowlisting if required
- Test connection locally first

### API Timeouts

- Vercel Hobby: 10s function timeout
- Upgrade to Pro for 60s timeout
- Use Inngest for long-running tasks (already implemented)

### Environment Variable Issues

- Ensure all variables set in Vercel dashboard
- Check variable names match exactly
- Redeploy after adding new variables

---

## 🔄 Rolling Back

### Vercel

1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." menu → "Promote to Production"

### Database

1. Restore from backup
2. Or revert migrations:
```bash
npx drizzle-kit drop
npx drizzle-kit push
```

---

## 📋 Production Environment Variables Template

```env
# Database
DATABASE_URL=

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

# Background Jobs
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Optional: Monitoring
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

---

**Last Updated:** January 17, 2026  
**Deployment Version:** 1.0
