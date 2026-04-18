# Features Documentation

Complete guide to all features available in Vision KeyInsights.

## 🎨 Core Features

### 1. AI-Powered Thumbnail Generation

Generate professional YouTube thumbnails using advanced AI models.

**How it works:**
1. Enter a description of your video or title
2. Optionally upload a reference image for style guidance
3. Click generate and wait for AI processing (~15–30 seconds)
4. Download your thumbnail from the gallery

**Technical Details:**
- Uses Google Gemini 2.5 Flash (via OpenRouter) for prompt optimization
- Generates images with Google Imagen-4 Fast (via Replicate)
- Output: 16:9 aspect ratio, PNG format
- Processing time: ~15–30 seconds
- Background processing via Inngest with automatic retries

**Example Prompts:**
```
"React Tutorial: Build App in 1 Hour 🚀"
"How to Make Money Online - Passive Income Guide"
"Top 10 Travel Destinations 2026 ✈️"
```

### 2. AI Content Generator

Generate complete YouTube SEO content from a single topic — titles, descriptions, tags, and thumbnail prompts.

**How it works:**
1. Enter a video topic or title
2. AI generates 3 SEO-optimized titles with scores
3. AI creates a compelling video description
4. AI suggests 10 relevant tags with high search volume
5. AI produces 2 thumbnail prompts (different styles)
6. Thumbnails are auto-generated and uploaded

**Output includes:**
- **3 Video Titles** with SEO scores (1–100)
- **Video Description** optimized for the topic
- **10 Tags** relevant to the topic with high search volume
- **2 Thumbnail Prompts** with different visual styles (3D, flat/vector)
- **2 AI-Generated Thumbnails** stored on ImageKit CDN

**4-Step Inngest Workflow:**
```
1. GenerateContent          → AI generates all text content
2. GenerateThumbnailImages  → Imagen-4 creates thumbnails (rate-limit aware)
3. UploadThumbnails         → Upload to ImageKit CDN
4. SaveContentToDB          → Store in AiContent table
```

### 3. Trending Keywords Analysis

Discover high-ranking SEO keywords by combining real search data from Google and YouTube with AI analysis.

**How it works:**
1. Enter a keyword or topic
2. System searches Google (via Bright Data web scraping) for video results
3. System searches YouTube Data API for video titles
4. AI analyzes combined titles and extracts SEO-relevant keywords
5. Each keyword gets a score (1–100) and related queries

**Output includes:**
- **Main Keyword** identified from the analysis
- **Keyword List** with SEO scores sorted by relevance
- **Related Queries** for each keyword (search phrases)
- **Score Visualization** with color-coded bars (amber/yellow/orange)
- **Copy-to-clipboard** functionality for each keyword

**4-Step Inngest Workflow:**
```
1. getGoogleSearchResult → Bright Data scrapes Google video search
2. Youtube Result        → YouTube Data API fetches video titles
3. generatekeywords      → Gemini 2.5 Flash extracts & scores keywords
4. SaveToDB              → Store in TrendingKeywords table
```

**Data Sources:**
- Google Search (video tab) via Bright Data proxy
- YouTube Data API v3 search endpoint

### 4. Thumbnail Search & Discovery

Search and discover YouTube video thumbnails with engagement metrics.

**How it works:**
1. Enter a search query
2. System searches YouTube for medium-length videos (filters out Shorts)
3. Returns up to 21 videos with full metadata
4. View thumbnails alongside engagement data

**Data returned per video:**
- Video title and thumbnail (high quality)
- Channel name
- View count, like count, comment count
- Publish date

**Technical Details:**
- Uses YouTube Data API v3 (search + videos endpoints)
- Filters `videoDuration=medium` to exclude Shorts
- Public route (no authentication required)

### 5. Outlier Detection

Identify viral outlier videos using statistical analysis — find what's performing abnormally well in any niche.

**How it works:**
1. Enter a search query (topic or keyword)
2. System fetches YouTube videos with full statistics
3. Algorithm calculates metrics for each video:
   - **Views per Day** = total views ÷ days since published
   - **Engagement Rate** = (likes + comments) ÷ views × 100
4. **IQR (Interquartile Range)** method identifies statistical outliers
5. **Smart Score** provides a weighted composite ranking

**Smart Score Formula:**
```
smartScore = (viewCount / avgViews) × 0.5
           + (viewsPerDay / maxViewsPerDay) × 0.3
           + (engagementRate / maxEngagementRate) × 0.2
```

**IQR Outlier Detection:**
```
Q1 = sorted values at 25th percentile
Q3 = sorted values at 75th percentile
IQR = Q3 - Q1
Lower Bound = Q1 - 1.5 × IQR
Upper Bound = Q3 + 1.5 × IQR
Outlier = viewCount < lowerBound OR viewCount > upperBound
```

### 6. Reference Image Upload

Upload an existing thumbnail to guide the AI's style and composition.

**Supported Formats:**
- JPG/JPEG
- PNG
- WebP
- Max file size: 10MB (recommended: < 5MB)

**Use Cases:**
- Match your channel's aesthetic
- Replicate successful thumbnail styles
- Maintain brand consistency
- Learn from competitors

### 7. Thumbnail Gallery

View, manage, and download all your previously generated thumbnails.

**Features:**
- Grid view with responsive layout (2/3/4 columns)
- Click to open full-size in new tab
- Chronological sorting (newest first)
- Skeleton loading states
- User-specific isolation (only see your thumbnails)

### 8. User Authentication

Secure authentication powered by Clerk.

**Supported Methods:**
- Email and password
- Google OAuth
- GitHub OAuth
- More providers can be added via Clerk

**Features:**
- Automatic session management
- Protected routes via middleware
- User profile management
- Password reset functionality

### 9. Dashboard

Central hub for accessing all features.

**Components:**
- Welcome banner with user name
- Quick access to all features
- Navigation sidebar

## 🔧 Technical Features

### Background Job Processing (Inngest)

All long-running tasks happen asynchronously using Inngest.

**Registered Functions:**

| Function | Event | Description |
|----------|-------|-------------|
| `ai/generate-thumbnail` | Thumbnail generation | 5-step workflow |
| `ai/generate-content` | Content generation | 4-step workflow |
| `ai/get-trending-keywords` | Keyword analysis | 4-step workflow |

**Benefits:**
- Non-blocking API responses
- Reliable job execution with retries
- Status polling from frontend
- Rate limit handling (12s delay between Replicate requests)

### Cloud Storage (ImageKit)

All generated images stored on ImageKit CDN.

**Benefits:**
- Fast global delivery via CDN
- Automatic optimization
- Image transformations
- Reliable permanent storage

### Database Persistence (PostgreSQL + Drizzle)

PostgreSQL database with Drizzle ORM stores all data.

**Tables:**
- `users` — User accounts
- `thumbnails` — Thumbnail metadata
- `AiContent` — AI-generated content (JSON)
- `TrendingKeywords` — Keyword analysis (JSON)

### Responsive Design

Mobile-first design that adapts to all screen sizes.

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px – 1024px
- Desktop: > 1024px

## 📱 User Interface Features

### Navigation

**Sidebar Menu (current pages):**
- Home (Dashboard)
- Thumbnail Generator
- Content Generator
- Thumbnail Search
- Trending Keywords
- Outlier Detection

### Loading States

**Skeleton Loaders:**
- Display during data fetching
- Match final content layout
- Smooth transition to real content

**Workflow Step Display:**
- Real-time step progress indicator
- Progress bar animation
- Current step name displayed during processing

**Button States:**
- Loading spinner during processing
- Disabled state to prevent duplicate submissions

### Copy to Clipboard

Available throughout the app:
- Copy individual keywords
- Copy main keyword
- Copy related queries
- Visual feedback (checkmark) on successful copy

### Error Handling

**User-Friendly Messages:**
- Clear error descriptions
- Actionable suggestions
- Axios error response parsing

## 🎯 Workflow Examples

### Basic Thumbnail Generation

```
1. Navigate to Thumbnail Generator
2. Enter prompt: "JavaScript Tutorial for Beginners"
3. Click "Generate Thumbnail"
4. Wait 15–30 seconds (progress shown)
5. View thumbnail in gallery
6. Click to open full-size
7. Right-click → Save Image
```

### Content Generation

```
1. Navigate to Content Generator
2. Enter topic: "React vs Next.js in 2026"
3. Click "Generate Content"
4. Wait 30–90 seconds (step progress shown)
5. View SEO titles with scores
6. Copy description and tags
7. View auto-generated thumbnails
```

### Keyword Research

```
1. Navigate to Trending Keywords
2. Enter keyword: "Next.js AI Projects"
3. Click "Search"
4. Wait 10–20 seconds (step progress shown)
5. View main keyword and scored list
6. Copy high-scoring keywords
7. Explore related queries
```

### Outlier Analysis

```
1. Navigate to Outlier Detection
2. Enter topic: "python programming"
3. View video list with metrics
4. Identify outlier videos (flagged)
5. Analyze smart scores and engagement rates
6. Use insights for content strategy
```

## 🚫 Current Limitations

### Rate Limits
- Replicate: 6 requests/minute with < $5 credit
- YouTube Data API: 10,000 units/day
- OpenRouter: Depends on your subscription
- Bright Data: Zone-specific limits

### Processing Time
- Thumbnail generation: 15–30 seconds
- Content generation: 30–90 seconds (2 thumbnails generated)
- Keyword analysis: 10–20 seconds
- Outlier detection: 2–5 seconds (real-time)

### Output Format
- Thumbnails: 16:9 PNG only
- No custom dimensions (yet)
- No built-in image editor (yet)

## 🔮 Upcoming Features

See [ROADMAP.md](../ROADMAP.md) for planned features:

- Face integration for personalized thumbnails
- Style presets and templates
- Batch generation
- A/B testing tools
- Performance analytics
- Custom dimensions
- Video thumbnail extraction

## 💡 Tips & Best Practices

### Writing Effective Prompts

**Good:**
```
"Photography Tutorial: Master Portrait Lighting 📸"
"Fitness: 30-Day Home Workout Challenge 💪"
```

**Better:**
```
"Professional YouTube thumbnail: 'Photography Tutorial - Master Portrait Lighting'
with a camera icon, dramatic lighting effects, and bold white text on dark background"
```

### Using Reference Images

- Choose high-quality references (1920x1080 or higher)
- Match your video topic to reference style
- Use thumbnails from successful videos in your niche

### Optimizing Keywords

- Focus on keywords with scores ≥ 80
- Use related queries to expand your tag list
- Compare your keywords across multiple searches
- Combine trending keywords with your content for maximum reach

---

**Last Updated:** April 18, 2026  
**Version:** 2.0.0
