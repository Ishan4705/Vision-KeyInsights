# Vision KeyInsights

AI-powered YouTube toolkit that helps content creators generate professional thumbnails, SEO-optimized content, trending keywords, and data-driven insights — all in one platform.

## 🚀 Features

- **AI Thumbnail Generation** — Create stunning YouTube thumbnails using Google Imagen-4 with optional reference image guidance
- **AI Content Generator** — Generate SEO-optimized titles, descriptions, tags, and thumbnail prompts from a single topic
- **Trending Keywords** — Discover high-ranking SEO keywords by combining Google & YouTube search data with AI analysis
- **Thumbnail Search** — Search and discover YouTube video thumbnails with engagement metrics (views, likes, comments)
- **Outlier Detection** — Identify viral outlier videos using IQR statistical analysis and smart scoring algorithms
- **Reference-Based Design** — Upload a reference image to guide the style of your AI-generated thumbnail
- **Thumbnail Gallery** — View and manage your previously generated thumbnails
- **User Authentication** — Secure authentication with Clerk (Email, Google, GitHub OAuth)
- **Cloud Storage** — Seamless image storage and CDN delivery with ImageKit
- **Background Processing** — Reliable async job execution with Inngest

## 🛣️ Roadmap

Want to see what's coming next? Check out our [ROADMAP.md](./ROADMAP.md) for planned features including:
- 🎭 **Face Integration** — Add your face to thumbnails for personalized branding
- 📊 **Performance Analytics** — Track thumbnail effectiveness with A/B testing
- 🎨 **Style Presets** — Quick-start templates for common video types
- 🔄 **Batch Generation** — Generate multiple thumbnails in one request

## 📚 Documentation

Complete documentation is available in the `/docs` directory:

- **[Getting Started](./docs/GETTING_STARTED.md)** — Installation and setup guide
- **[Architecture](./docs/ARCHITECTURE.md)** — System design and technical overview
- **[Features](./docs/FEATURES.md)** — Detailed feature documentation
- **[API Reference](./docs/API_REFERENCE.md)** — API endpoints and usage
- **[Database Schema](./docs/DATABASE_SCHEMA.md)** — Database structure and relationships
- **[Deployment](./docs/DEPLOYMENT.md)** — Production deployment guide
- **[Contributing](./docs/CONTRIBUTING.md)** — Guidelines for contributors
- **[FAQ](./docs/FAQ.md)** — Frequently asked questions

## 🏁 Quick Start

### Prerequisites

- **Node.js** v18.x or higher
- **npm** (or yarn/pnpm/bun)
- **PostgreSQL** database (or cloud provider like Neon/Supabase)

### Installation

```bash
# Clone the repository
git clone https://github.com/Ishan4705/Vision-KeyInsights.git
cd Vision-KeyInsights

# Install dependencies
npm install

# Set up environment variables (see docs/GETTING_STARTED.md)
cp .env.example .env.local

# Run database migrations
npx drizzle-kit push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Environment Variables

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# ImageKit (Cloud Storage)
ImageKit_PUBLIC_KEY=
ImageKit_PRIVATE_KEY=
ImageKit_URL_ENDPOINT=

# AI Services
OPENROUTER_API_KEY=
REPLICATE_API_KEY=

# YouTube Data API
YOUTUBE_API_KEY=

# Bright Data (Web Scraping for Trending Keywords)
BRIGHTDATA_API_KEY=

# Inngest (Background Jobs)
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Database** | PostgreSQL (Neon) + Drizzle ORM |
| **Auth** | Clerk |
| **AI Text** | Google Gemini 2.5 Flash (via OpenRouter) |
| **AI Image** | Google Imagen-4 Fast (via Replicate) |
| **Storage** | ImageKit CDN |
| **Background Jobs** | Inngest |
| **Web Scraping** | Bright Data |
| **YouTube Data** | YouTube Data API v3 |

## 🚀 Deployment

Deploy to production in minutes:

```bash
# Push to GitHub
git push origin main

# Deploy to Vercel (recommended)
vercel deploy --prod
```

📖 **Complete deployment guide:** [Deployment Documentation](./docs/DEPLOYMENT.md)

## 📖 Learn More

- [Architecture Overview](./docs/ARCHITECTURE.md) — Understand the system design
- [Features Guide](./docs/FEATURES.md) — Explore all features in detail
- [API Reference](./docs/API_REFERENCE.md) — API documentation
- [FAQ](./docs/FAQ.md) — Common questions answered

---

**Developed by [Ishan4705](https://github.com/Ishan4705)**

---

**Last Updated:** April 18, 2026  
**Version:** 2.0.0
