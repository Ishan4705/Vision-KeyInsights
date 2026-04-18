# Frequently Asked Questions

Common questions and answers about Vision KeyInsights.

## 🎨 General

### What is Vision KeyInsights?

Vision KeyInsights is an AI-powered YouTube toolkit that helps content creators with:
- **Thumbnail Generation** — AI-generated professional thumbnails
- **Content Generation** — SEO-optimized titles, descriptions, tags, and thumbnail prompts
- **Trending Keywords** — SEO keyword discovery from Google & YouTube data
- **Thumbnail Search** — YouTube thumbnail discovery with engagement metrics
- **Outlier Detection** — Statistical analysis to find viral video patterns

### Is it free to use?

This is a private development project. You'll need API keys from third-party services, each with their own pricing:

| Service | Free Tier | Paid Cost |
|---------|-----------|-----------|
| Replicate | Need $5+ credit | ~$0.003–0.01/image |
| OpenRouter | Pay per token | Varies by model |
| YouTube API | 10,000 units/day | Additional quota available |
| ImageKit | 20GB bandwidth/month | $49+/month |
| Bright Data | Trial available | Pay per request |
| Inngest | Generous free tier | Pay as you grow |

### What AI models are used?

- **Text Generation:** Google Gemini 2.5 Flash (via OpenRouter)
- **Image Generation:** Google Imagen-4 Fast (via Replicate)

### Can I use this commercially?

This is a private project. Commercial usage is subject to project ownership and API provider terms.

---

## 🖼️ Thumbnail Generation

### How long does it take to generate a thumbnail?

Typically 15–30 seconds, depending on:
- Replicate API queue
- Complexity of prompt
- Whether reference image is used

### What size are the generated thumbnails?

- **Aspect Ratio:** 16:9 (YouTube standard)
- **Format:** PNG
- **Resolution:** High quality (typically 1920×1080)

### Can I customize the aspect ratio?

Currently, only 16:9 is supported. Custom dimensions are planned for future releases.

### Why did my generation fail?

Common causes:
- **Rate limiting:** Free tier limits 6 requests/minute
- **Insufficient credits:** Add funds to Replicate account
- **Invalid prompt:** Try simpler, clearer descriptions
- **File size:** Reference image too large (> 10MB)

---

## 📝 Content Generation

### What does the content generator produce?

The AI content generator creates:
1. **3 Video Titles** with SEO scores (1–100)
2. **Video Description** optimized for the topic
3. **10 Tags** with high search volume
4. **2 Thumbnail Prompts** (different visual styles)
5. **2 AI-Generated Thumbnails** from those prompts

### How long does content generation take?

30–90 seconds. The workflow generates text content, then creates 2 thumbnail images (with 12-second delays between requests to avoid rate limiting).

### Why does it take longer than thumbnail generation?

Content generation includes multiple steps:
- AI text generation (titles, description, tags, prompts)
- 2 image generation requests (with 12s delay between each)
- Image upload to ImageKit
- Database save

---

## 🔍 Trending Keywords

### How does keyword analysis work?

The system combines two data sources:
1. **Google Search** — Video tab results scraped via Bright Data
2. **YouTube Data API** — Video title search results

These titles are then analyzed by Gemini 2.5 Flash to extract SEO-relevant keywords with scores.

### What do the keyword scores mean?

Scores range from 1–100 and represent estimated SEO potential:
- **80–100** (Amber) — High ranking potential, very competitive
- **60–79** (Yellow) — Good potential, moderate competition
- **Below 60** (Orange) — Lower potential, niche keywords

### What are related queries?

Each keyword includes related search phrases that users commonly search for. These are useful for expanding your tag list and content strategy.

### Why did my keyword search fail?

- **Bright Data API error:** Check your API key and zone configuration
- **YouTube API quota:** You may have exceeded the 10,000 units/day limit
- **OpenRouter credits:** Ensure you have sufficient credits for AI processing

---

## 🔎 Thumbnail Search

### How does thumbnail search work?

It searches YouTube using the Data API v3, filtering for medium-length videos (excludes Shorts). For each video, it returns the thumbnail, title, channel, view count, likes, and comments.

### Why are some videos missing?

The API filters `videoDuration=medium` to exclude YouTube Shorts. Only videos with standard duration are included.

### Is thumbnail search public?

Yes, the thumbnail search endpoint (`/api/thumbnail-search`) does not require authentication.

---

## 📊 Outlier Detection

### What is outlier detection?

It identifies videos that are performing abnormally well (or poorly) compared to others in the same search results using the **IQR (Interquartile Range)** statistical method.

### What is the Smart Score?

A composite score calculated as:
```
smartScore = (viewCount/avgViews) × 0.5
           + (viewsPerDay/maxViewsPerDay) × 0.3
           + (engagementRate/maxEngagementRate) × 0.2
```

Higher smart scores indicate videos that are performing exceptionally well across views, velocity, and engagement.

### What is the Outlier Score?

Measures how far a video's view count deviates from the expected range. Higher outlier scores mean more extreme performance.

---

## 🔐 Authentication & Accounts

### Why do I need to sign up?

Authentication ensures:
- Your content is private and saved to your account
- You can access generation history
- Prevents abuse and rate limiting

### What authentication methods are supported?

- Email and password
- Google OAuth
- GitHub OAuth
- More providers can be added via Clerk

### Is my data secure?

Yes. Authentication is handled by Clerk (SOC 2 Type II certified). Images are stored on ImageKit's secure CDN. All API keys are server-side only.

### Can I delete my account?

Currently manual. Contact via GitHub issues to request account deletion. Self-service deletion is planned.

---

## 💳 Pricing & Costs

### How much does it cost to run?

**Required Services:**

| Service | Free Tier | Cost After |
|---------|-----------|------------|
| Vercel | Yes | $20/month (Pro) |
| Database (Neon) | Yes (0.5GB) | Pay as you grow |
| Replicate | $5 credit needed | ~$0.003–0.01/image |
| OpenRouter | No free tier | Pay per token |
| YouTube API | 10K units/day | Additional quota |
| Bright Data | Trial credits | Pay per request |
| ImageKit | Yes (20GB/month) | $49+/month |
| Inngest | Yes (generous) | Pay as you grow |

**Estimated per-feature cost:**
- Thumbnail generation: ~$0.01–0.02
- Content generation: ~$0.03–0.05 (includes 2 thumbnails)
- Keyword analysis: ~$0.005 (AI text only)
- Thumbnail search: Free (YouTube API units)
- Outlier detection: Free (YouTube API units)

---

## 🛠️ Technical Issues

### "Failed to generate thumbnail" error

**Solutions:**
1. Check Replicate API key is valid
2. Ensure you have credits ($5+ recommended)
3. Wait a minute if rate limited
4. Check Replicate status page
5. Verify Inngest is configured correctly

### "Workflow failed" during content generation

**Solutions:**
1. Check Replicate and OpenRouter API keys
2. Ensure sufficient credits on both services
3. Check Inngest dashboard for detailed error logs
4. Rate limiting: the system waits 12s between image requests automatically

### Keywords not loading

**Solutions:**
1. Check Bright Data API key and zone (`visionkeyinsights`)
2. Verify YouTube API key and quota
3. Check OpenRouter credits
4. Review Inngest dashboard for step failures

### Images not loading in gallery

**Solutions:**
1. Check browser console for errors
2. Verify ImageKit credentials
3. Check if images exist in ImageKit dashboard
4. Clear browser cache
5. Check CORS settings

### Build errors during deployment

**Common fixes:**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database connection issues

**Check:**
1. `NEXT_PUBLIC_NEON_DB_CONNECTION_STRING` is correct
2. Database is accessible (check Neon dashboard)
3. SSL mode is set correctly
4. All 4 tables exist (run `npx drizzle-kit push`)

### Environment variables not working

**Solutions:**
1. Restart development server
2. Verify exact variable names (case-sensitive)
3. Check `.env.local` is in root directory
4. Client-side variables must use `NEXT_PUBLIC_` prefix
5. Don't wrap values in quotes unless needed
6. Redeploy if on Vercel after adding variables

---

## 🚀 Features

### Can I add my face to thumbnails?

This feature is planned! See the [roadmap](../ROADMAP.md) for details.

### Can I edit thumbnails after generation?

Currently, no built-in editor. You can:
- Download and edit in external tools
- Generate again with modified prompt

### Can I download thumbnails?

Yes:
1. Click thumbnail to open full-size
2. Right-click → "Save Image As"

### Can I generate multiple thumbnails at once?

The Content Generator creates 2 thumbnails per request. Standalone batch generation is planned.

### Can I see analytics for my thumbnails?

Not yet. A/B testing and performance analytics are on the [roadmap](../ROADMAP.md).

---

## 🔄 Updates & Maintenance

### How do I update to the latest version?

```bash
git pull origin main
npm install
npx drizzle-kit push
npm run dev
```

### Are updates automatic on Vercel?

Yes, Vercel automatically deploys when you push to main branch.

### Will updates break my existing setup?

We aim for backward compatibility. Breaking changes will be:
- Clearly documented
- Include migration guides (especially for database schema changes)
- Announced in release notes

---

## 🤝 Development Team

### How can I contribute as a team member?

See the [Development Guidelines](./CONTRIBUTING.md) for standards and best practices.

### I found a bug. What should I do?

1. Document the issue with reproduction steps
2. Discuss with the team
3. Create a branch to fix if assigned
4. Add screenshots if applicable

### I have a feature idea. How do I suggest it?

1. Check the [roadmap](../ROADMAP.md)
2. Discuss with the team
3. Document use case and benefits
4. Get approval before implementation

---

## 📚 Learning Resources

### I'm new to Next.js. Where should I start?

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)
- [Architecture Guide](./ARCHITECTURE.md)

### How can I learn more about the tech stack?

- [Getting Started Guide](./GETTING_STARTED.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [API Reference](./API_REFERENCE.md)
- [Inngest Documentation](https://www.inngest.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

### Where can I see code examples?

Browse the codebase:
- Components: `app/_components/`
- API routes: `app/api/`
- Database: `configs/schema.ts`
- Background jobs: `inngest/functions.ts`
- Services: `services/GlobalApi.tsx`

---

## 📞 Support

### Where can I get help?

1. Check this FAQ
2. Read the [documentation](./README.md)
3. Contact the development team
4. Review the Inngest dashboard for job errors

### How do I report security issues?

Report security concerns immediately to the project lead or development team.

---

## 🔮 Future Plans

### What features are coming next?

See the [ROADMAP.md](../ROADMAP.md) for:
- Face integration
- A/B testing
- Performance analytics
- Style presets
- Batch generation
- And more!

### How are features prioritized?

Feature prioritization is determined by the development team based on project goals, user demand, and technical feasibility.

### How can I stay updated?

- Review the [ROADMAP.md](../ROADMAP.md) regularly
- Attend team sync meetings
- Check commit history and PR updates

---

**Last Updated:** April 18, 2026  
**Can't find your question?** Contact the development team
