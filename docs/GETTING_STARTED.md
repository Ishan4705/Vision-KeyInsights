# Getting Started

This guide will help you set up Vision KeyInsights on your local development environment.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **npm** or **yarn** or **pnpm** or **bun**
- **Git**
- **PostgreSQL** database (or use a cloud provider like Neon, Supabase)

## 🔧 Installation

### 1. Clone the Repository

**Note:** This is a private repository. Ensure you have access rights.

```bash
git clone https://github.com/Ishan4705/Vision-KeyInsights.git
cd Vision-KeyInsights
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```env
# Database (Neon serverless PostgreSQL)
NEXT_PUBLIC_NEON_DB_CONNECTION_STRING="your_postgresql_connection_string"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# ImageKit (Cloud Storage & CDN)
ImageKit_PUBLIC_KEY="your_imagekit_public_key"
ImageKit_PRIVATE_KEY="your_imagekit_private_key"
ImageKit_URL_ENDPOINT="your_imagekit_url_endpoint"

# OpenRouter (AI Text Generation - Gemini 2.5 Flash)
OPENROUTER_API_KEY="your_openrouter_api_key"

# Replicate (AI Image Generation - Imagen-4 Fast)
REPLICATE_API_KEY="your_replicate_api_key"

# YouTube Data API v3 (Thumbnail Search, Outlier Detection, Keywords)
YOUTUBE_API_KEY="your_youtube_api_key"

# Bright Data (Web Scraping for Trending Keywords)
BRIGHTDATA_API_KEY="your_brightdata_api_key"

# Inngest (Background Jobs)
INNGEST_EVENT_KEY="your_inngest_event_key"
INNGEST_SIGNING_KEY="your_inngest_signing_key"

# Inngest (Client-side polling)
NEXT_PUBLIC_INNGEST_SERVER_URL="your_inngest_server_url"
NEXT_PUBLIC_INNGEST_SIGNING_KEY="your_inngest_signing_key"
```

### 4. Database Setup

Run database migrations to create or update the schema:

```bash
# Push schema to database (recommended for development)
npx drizzle-kit push

# Or generate and apply migrations
npx drizzle-kit generate
```

**Current tables created:**
- `users` — User accounts
- `thumbnails` — AI-generated thumbnails
- `AiContent` — AI-generated content (titles, descriptions, tags)
- `TrendingKeywords` — SEO keyword analysis results

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 6. Start Inngest Dev Server (Optional)

For local testing of background jobs:

```bash
npx inngest-cli@latest dev
```

This starts the Inngest dev server at `http://localhost:8288` for monitoring local function runs.

## 🔑 Getting API Keys

### Clerk (Authentication)
1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the publishable key and secret key from the dashboard
4. Enable Google and GitHub OAuth (optional)

### ImageKit (Image Storage & CDN)
1. Sign up at [imagekit.io](https://imagekit.io)
2. Navigate to Developer Options
3. Copy your Public Key, Private Key, and URL Endpoint

### OpenRouter (AI Text Generation)
1. Visit [openrouter.ai](https://openrouter.ai)
2. Create an account and generate an API key
3. Add credits to your account ($5 minimum recommended)
4. Model used: `google/gemini-2.5-flash`

### Replicate (AI Image Generation)
1. Sign up at [replicate.com](https://replicate.com)
2. Go to Account Settings → API Tokens
3. Create a new token
4. Add billing information and credits ($5 minimum recommended)
5. Model used: `google/imagen-4-fast`

### YouTube Data API v3
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable "YouTube Data API v3"
4. Create an API key under Credentials
5. Quota: 10,000 units/day (free tier)

### Bright Data (Web Scraping)
1. Visit [brightdata.com](https://brightdata.com)
2. Create an account
3. Set up a Web Unlocker zone named `visionkeyinsights`
4. Copy your API key from Settings

### Inngest (Background Jobs)
1. Visit [inngest.com](https://inngest.com)
2. Create a free account
3. Create a new app
4. Copy the Event Key and Signing Key
5. Note the server URL for client-side polling

## 📁 Project Structure

```
Vision-KeyInsights/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (routes)/                 # Protected routes
│   │   ├── dashboard/            # Main dashboard
│   │   ├── thumbnail-generator/  # AI thumbnail generation
│   │   ├── content-generator/    # AI content generation
│   │   ├── trending-keywords/    # SEO keyword analysis
│   │   ├── thumbnail-search/     # YouTube thumbnail discovery
│   │   └── outlier/              # Viral video detection
│   ├── api/                      # API routes
│   │   ├── generate-thumbnail/   # POST: thumbnail gen, GET: history
│   │   ├── content-generator/    # POST: content generation
│   │   ├── trending-keywords/    # GET: keyword analysis
│   │   ├── thumbnail-search/     # GET: YouTube search
│   │   ├── outlier/              # GET: outlier detection
│   │   ├── inngest/              # Inngest webhook
│   │   └── user/                 # User operations (future)
│   ├── _components/              # Global components
│   └── globals.css
├── components/                   # Reusable components
│   └── ui/                       # shadcn/ui components
├── configs/                      # Configuration files
│   ├── db.tsx                    # Database connection (Neon)
│   └── schema.ts                 # Drizzle ORM schema (4 tables)
├── inngest/                      # Background job functions
│   ├── client.ts                 # Inngest client setup
│   └── functions.ts              # 3 workflow functions
├── services/                     # API service utilities
│   └── GlobalApi.tsx             # RunStatus polling helper
├── lib/                          # Utility functions
├── hooks/                        # Custom React hooks
├── public/                       # Static assets
├── docs/                         # Documentation (you are here)
├── middleware.tsx                 # Clerk auth middleware
├── drizzle.config.ts             # Drizzle Kit configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript configuration
```

## 🧪 Testing

```bash
# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify your `NEXT_PUBLIC_NEON_DB_CONNECTION_STRING` is correct
- Ensure PostgreSQL is accessible (Neon dashboard shows connection status)
- Check if SSL mode is required (`?sslmode=require`)

### API Rate Limiting
- **Replicate:** Free tier limits 6 requests/minute with < $5 credit. Add more credits.
- **YouTube API:** 10,000 units/day. Each search costs 100 units. Monitor in Google Cloud Console.
- **OpenRouter:** Pay-per-token. Check balance at openrouter.ai

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Environment Variables Not Loading
- Restart the development server after changing `.env.local`
- Ensure variable names match exactly (case-sensitive)
- Don't commit `.env.local` to git
- Client-side variables must start with `NEXT_PUBLIC_`

### Inngest Functions Not Running
- Ensure the Inngest dev server is running (`npx inngest-cli@latest dev`)
- Check the Inngest dashboard for error logs
- Verify `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` are set

### Bright Data / Google Search Errors
- Verify your Bright Data API key
- Check that the zone name is `visionkeyinsights`
- Ensure your Bright Data account has available credits

## 🔄 Updating

To update to the latest version:

```bash
git pull origin main
npm install
npx drizzle-kit push
npm run dev
```

## 📚 Next Steps

- Read the [Architecture Guide](./ARCHITECTURE.md)
- Explore [Features Documentation](./FEATURES.md)
- Check the [API Reference](./API_REFERENCE.md)
- Review the [Database Schema](./DATABASE_SCHEMA.md)
- Review the [Deployment Guide](./DEPLOYMENT.md)

## 🆘 Getting Help

- Check the [FAQ](./FAQ.md)
- Contact the development team
- Review the documentation
