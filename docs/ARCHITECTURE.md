# Architecture Overview

This document provides a comprehensive overview of the Vision KeyInsights architecture, technical stack, and design decisions.

## 🏗️ System Architecture

```
┌─────────────┐
│   Client    │ (Next.js Frontend)
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
┌──────▼──────┐   ┌─────▼─────┐
│  Clerk Auth │   │  Next.js  │
└─────────────┘   │  API      │
                  └─────┬─────┘
                        │
       ┌────────┬───────┼────────┬────────────┐
       │        │       │        │            │
┌──────▼──────┐ │ ┌─────▼─────┐ │     ┌──────▼──────┐
│  PostgreSQL │ │ │  Inngest  │ │     │  ImageKit   │
│  Database   │ │ │  Queue    │ │     │  Storage    │
└─────────────┘ │ └─────┬─────┘ │     └─────────────┘
                │       │       │
         ┌──────▼───┐   │  ┌────▼──────┐
         │ YouTube  │   │  │ Bright    │
         │ Data API │   │  │ Data      │
         └──────────┘   │  └───────────┘
               ┌────────┼────────┐
               │                 │
        ┌──────▼──────┐   ┌─────▼─────┐
        │ OpenRouter  │   │ Replicate │
        │ (Gemini AI) │   │ (Imagen)  │
        └─────────────┘   └───────────┘
```

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI primitives
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useEffect)
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Next.js API Routes
- **Database:** PostgreSQL (Neon serverless)
- **ORM:** Drizzle ORM
- **Background Jobs:** Inngest

### Authentication
- **Provider:** Clerk
- **Features:**
  - Email/Password authentication
  - Google & GitHub OAuth providers
  - Session management
  - User profiles
  - Route protection via middleware

### AI & ML Services
- **Text Generation:** Google Gemini 2.5 Flash (via OpenRouter)
- **Image Generation:** Google Imagen-4 Fast (via Replicate)

### External APIs
- **YouTube Data API v3** — Video search, metadata, statistics
- **Bright Data** — Web scraping for Google search results

### Cloud Services
- **Image Storage & CDN:** ImageKit
- **Background Processing:** Inngest
- **Database Hosting:** Neon (serverless PostgreSQL)

### DevOps
- **Version Control:** Git + GitHub
- **Hosting:** Vercel (recommended)
- **CI/CD:** Vercel automatic deployments

## 📦 Key Components

### 1. Authentication System (Clerk)

**Location:** `app/(auth)/`, `middleware.tsx`

Handles user authentication and authorization:
- Sign up/Sign in pages
- Session management
- Protected routes via middleware
- User profile management

```typescript
// middleware.tsx
const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/',
    '/api/inngest',
    '/api/thumbnail-search'
]);

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        await auth.protect()
    }
});
```

### 2. Database Layer (Drizzle ORM)

**Location:** `configs/db.tsx`, `configs/schema.ts`

**Tables:**

| Table | Purpose |
|-------|---------|
| `users` | User accounts (synced from Clerk) |
| `thumbnails` | Generated thumbnail metadata |
| `AiContent` | AI-generated content (titles, descriptions, tags, prompts) |
| `TrendingKeywords` | SEO keyword analysis results |

See [Database Schema](./DATABASE_SCHEMA.md) for full details.

### 3. API Routes

**Location:** `app/api/`

| Route | Method | Description |
|-------|--------|-------------|
| `/api/generate-thumbnail` | POST | Initiates AI thumbnail generation via Inngest |
| `/api/generate-thumbnail` | GET | Fetches user's thumbnail history |
| `/api/content-generator` | POST | Triggers AI content generation workflow |
| `/api/trending-keywords` | GET | Triggers trending keywords analysis |
| `/api/thumbnail-search` | GET | Searches YouTube for video thumbnails |
| `/api/outlier` | GET | Analyzes YouTube videos for outlier detection |
| `/api/inngest` | POST | Inngest webhook endpoint |
| `/api/user` | — | User operations (future) |

### 4. Background Job Processing (Inngest)

**Location:** `inngest/functions.ts`

#### Registered Functions

| Function ID | Event | Description |
|-------------|-------|-------------|
| `ai/generate-thumbnail` | `ai/generate-thumbnail` | 5-step thumbnail generation workflow |
| `ai/generate-content` | `ai/generate-content` | 4-step content generation workflow |
| `ai/get-trending-keywords` | `ai/get-trending-keywords` | 4-step keyword analysis workflow |

#### Thumbnail Generation Workflow
```
1. UploadImage         → Upload refImage to ImageKit (if provided)
2. GenerateThumbnailPrompt → Generate prompt via Gemini 2.5 Flash
3. Generate Image      → Create thumbnail with Imagen-4 Fast
4. Upload Thumbnail    → Save final image to ImageKit CDN
5. SaveToDB            → Store metadata in database
```

#### Content Generation Workflow
```
1. GenerateContent          → Generate titles, description, tags, prompts via AI
2. GenerateThumbnailImages  → Create thumbnails from prompts (with rate limit retry)
3. UploadThumbnails         → Upload images to ImageKit CDN
4. SaveContentToDB          → Store all content in AiContent table
```

#### Trending Keywords Workflow
```
1. getGoogleSearchResult → Fetch Google video search titles via Bright Data
2. Youtube Result        → Fetch YouTube video titles via YouTube Data API
3. generatekeywords      → Extract SEO keywords from combined results via AI
4. SaveToDB              → Store keywords in TrendingKeywords table
```

### 5. UI Pages

| Page | Location | Description |
|------|----------|-------------|
| Dashboard | `app/(routes)/dashboard/` | Welcome banner, feature overview, quick actions |
| Thumbnail Generator | `app/(routes)/thumbnail-generator/` | Input form, reference upload, gallery |
| Content Generator | `app/(routes)/content-generator/` | AI content generation with polling |
| Trending Keywords | `app/(routes)/trending-keywords/` | Keyword analysis with score visualization |
| Thumbnail Search | `app/(routes)/thumbnail-search/` | YouTube thumbnail discovery |
| Outlier Detection | `app/(routes)/outlier/` | Viral video analysis with smart scoring |

### 6. Services

**Location:** `services/GlobalApi.tsx`

```typescript
// RunStatus — polls Inngest for workflow status
export const RunStatus = async (eventId: string) => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_INNGEST_SERVER_URL}/${eventId}/runs`,
        { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_INNGEST_SIGNING_KEY}` } }
    );
    const json = await response.json();
    return json.data;
}
```

## 🔄 Data Flow

### Thumbnail Generation Flow

```
User Input
    ↓
Form Submission → /api/generate-thumbnail (POST)
    ↓
Inngest Event Triggered
    ↓
Background Job Starts
    ↓
1. Upload refImage to ImageKit
    ↓
2. Generate Prompt (OpenRouter → Gemini 2.5 Flash)
    ↓
3. Generate Image (Replicate → Imagen-4 Fast)
    ↓
4. Upload Thumbnail (ImageKit CDN)
    ↓
5. Save to Database
    ↓
Job Complete → User sees thumbnail in gallery
```

### Content Generator Flow

```
User Input (topic)
    ↓
POST /api/content-generator
    ↓
Inngest Event: ai/generate-content
    ↓
1. Generate content via AI (titles, description, tags, prompts)
    ↓
2. Generate thumbnail images from prompts (with rate limit handling)
    ↓
3. Upload thumbnails to ImageKit
    ↓
4. Save everything to AiContent table
    ↓
Frontend polls RunStatus → Displays results
```

### Trending Keywords Flow

```
User Input (keyword/topic)
    ↓
GET /api/trending-keywords?query=...
    ↓
Inngest Event: ai/get-trending-keywords
    ↓
1. Google Search via Bright Data → extract video titles
    ↓
2. YouTube Data API → extract video titles
    ↓
3. Combine titles → AI extracts SEO keywords with scores
    ↓
4. Save to TrendingKeywords table
    ↓
Frontend polls RunStatus → Displays sorted keywords
```

### Outlier Detection Flow

```
User Search Query
    ↓
GET /api/outlier?query=...
    ↓
YouTube Data API → Search videos
    ↓
YouTube Data API → Get video statistics
    ↓
Calculate metrics:
  - Views per day
  - Engagement rate
  - IQR-based outlier detection
  - Smart score (weighted composite)
    ↓
Return annotated results → Frontend renders analysis
```

### Authentication Flow

```
User visits protected route
    ↓
Middleware checks session (Clerk)
    ↓
No session? → Redirect to /sign-in
    ↓
Sign in with Clerk (Email/Google/GitHub)
    ↓
Session created
    ↓
Access granted to protected routes
```

## 🔐 Security Considerations

### API Keys
- Stored in environment variables (`.env.local`)
- Never exposed to client (server-side only)
- Separate keys for development and production

### Authentication
- Clerk handles session security
- Protected routes via middleware
- User-specific data isolation (queries filtered by `userEmail`)

### Public Routes
Only these routes are accessible without authentication:
- `/` (homepage)
- `/sign-in`, `/sign-up`
- `/api/inngest` (Inngest webhook, verified by signing key)
- `/api/thumbnail-search` (public search)

### Database
- User data linked to Clerk email
- Foreign key constraints for data integrity
- No direct user authentication in DB

## 🚀 Performance Optimizations

### Image Optimization
- Next.js Image component for automatic optimization
- ImageKit CDN for fast global delivery
- Lazy loading for thumbnail galleries

### Background Processing
- Inngest handles long-running AI tasks (15–60 seconds)
- Non-blocking API responses with polling
- Rate limit retry logic with exponential backoff (Replicate API)
- 12-second delay between batch image generation requests

### Caching
- Next.js automatic caching for static assets
- YouTube API responses can be cached (future improvement)

## 📈 Scalability

### Current Limitations
- Replicate API rate limits (6 req/min on free tier)
- YouTube Data API quota (10,000 units/day)
- ImageKit storage limits (plan-dependent)
- Database connection pooling (Neon serverless handles this)

### Future Improvements
- Redis caching layer for API responses
- Queue management for high traffic
- CDN optimization for generated images
- Database read replicas
- User-level rate limiting

## 🧪 Testing Strategy

### Current State
- Manual testing
- TypeScript type checking
- ESLint for code quality

### Future Additions
- Unit tests (Jest + React Testing Library)
- Integration tests
- E2E tests (Playwright)
- API testing

## 📊 Monitoring & Logging

### Current
- Console logging for all Inngest workflow steps
- Inngest dashboard for job monitoring
- Vercel analytics (when deployed)

### Future
- Error tracking (Sentry)
- Performance monitoring (Vercel Speed Insights)
- Custom analytics dashboard

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2026 | Initial release: Thumbnail generation, auth, gallery |
| 2.0.0 | Apr 2026 | Content generator, trending keywords, thumbnail search, outlier detection |

---

**Last Updated:** April 18, 2026  
**Maintained By:** [Ishan4705](https://github.com/Ishan4705)
