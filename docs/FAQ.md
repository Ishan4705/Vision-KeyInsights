# Frequently Asked Questions

Common questions and answers about Vision KeyInsights.

## 🎨 General

### What is Vision KeyInsights?

Vision KeyInsights is an AI-powered tool that helps content creators generate professional YouTube thumbnails in seconds using advanced AI models.

### Is it free to use?

This is a private development project. You'll need API keys from third-party services (Replicate, OpenRouter) which have their own pricing:
- Replicate: ~$0.003-0.01 per thumbnail
- OpenRouter: Pay-per-token pricing
- ImageKit: Free tier available

### What AI models are used?

- **Text Generation:** Google Gemini 2.5 Flash (via OpenRouter)
- **Image Generation:** Google Imagen-4 (via Replicate)

### Can I use this commercially?

This is a private project. Commercial usage is subject to project ownership and API provider terms.

---

## 🖼️ Thumbnail Generation

### How long does it take to generate a thumbnail?

Typically 15-30 seconds, depending on:
- Replicate API queue
- Complexity of prompt
- Whether reference image is used

### What size are the generated thumbnails?

- **Aspect Ratio:** 16:9 (YouTube standard)
- **Format:** PNG
- **Resolution:** High quality (typically 1920x1080)

### Can I customize the aspect ratio?

Currently, only 16:9 is supported. Custom dimensions are planned for future releases.

### Why did my generation fail?

Common causes:
- **Rate limiting:** Free tier limits 6 requests/minute
- **Insufficient credits:** Add funds to Replicate account
- **Invalid prompt:** Try simpler, clearer descriptions
- **File size:** Reference image too large (> 10MB)

### Can I generate multiple thumbnails at once?

Batch generation is not currently supported but is on the [roadmap](../ROADMAP.md).

---

## 📸 Reference Images

### What image formats are supported?

- JPG/JPEG
- PNG
- WebP

### What's the maximum file size?

10MB maximum, but we recommend < 5MB for faster processing.

### Does the reference image need to be a thumbnail?

No, but using actual thumbnails gives better results. The AI uses it to understand style, layout, and composition.

### Can I use copyrighted images as references?

The reference guides the AI's generation; it doesn't copy the image. However, respect copyright laws and use images you have rights to.

---

## 🔐 Authentication & Accounts

### Why do I need to sign up?

Authentication ensures:
- Your thumbnails are private and saved to your account
- You can access thumbnail history
- Prevents abuse and rate limiting

### What authentication methods are supported?

- Email and password
- Google OAuth
- GitHub OAuth
- More providers can be added via Clerk

### Is my data secure?

Yes. Authentication is handled by Clerk (SOC 2 Type II certified). Images are stored on ImageKit's secure CDN.

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
| Replicate | $5 credit needed | ~$0.003-0.01/image |
| OpenRouter | No free tier | Pay per token |
| ImageKit | Yes (20GB/month) | $49+/month |
| Inngest | Yes (generous) | Pay as you grow |

**Per Thumbnail Cost:** ~$0.01-0.02

### Can I reduce costs?

Yes:
- Use cheaper AI models
- Implement caching for repeated prompts
- Batch operations
- Optimize prompts to reduce token usage

### Is there a usage limit?

Limits depend on your API provider plans:
- Replicate free tier: 6 requests/minute
- Add $5+ credit for higher limits
- Monitor usage via provider dashboards

---

## 🛠️ Technical Issues

### "Failed to generate thumbnail" error

**Solutions:**
1. Check Replicate API key is valid
2. Ensure you have credits ($5+ recommended)
3. Wait a minute if rate limited
4. Check Replicate status page
5. Verify Inngest is configured correctly

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
1. DATABASE_URL is correct
2. Database is accessible (IP allowlist if needed)
3. SSL mode is set correctly
4. Connection pooling enabled

### Environment variables not working

**Solutions:**
1. Restart development server
2. Verify exact variable names (case-sensitive)
3. Check `.env.local` is in root directory
4. Don't wrap values in quotes unless needed
5. Redeploy if on Vercel after adding variables

---

## 🚀 Features

### Can I add my face to thumbnails?

This feature is planned! See the [roadmap](../ROADMAP.md) for details. Currently exploring:
- Face swap technology
- Face-conditioned generation models

### Can I edit thumbnails after generation?

Currently, no built-in editor. You can:
- Download and edit in external tools
- Generate again with modified prompt
- Future: Built-in editor is being considered

### Can I download thumbnails?

Yes:
1. Click thumbnail to open full-size
2. Right-click → "Save Image As"

### Can I share my thumbnails?

Currently, thumbnails are private. Public sharing and gallery features are planned.

### Can I see analytics for my thumbnails?

Not yet. A/B testing and performance analytics are on the [roadmap](../ROADMAP.md).

---

## 🔄 Updates & Maintenance

### How do I update to the latest version?

```bash
git pull origin main
npm install
npm run build
```

### Are updates automatic on Vercel?

Yes, Vercel automatically deploys when you push to main branch.

### How do I check which version I'm running?

Check `package.json` version or git commit hash.

### Will updates break my existing setup?

We aim for backward compatibility. Breaking changes will be:
- Clearly documented
- Include migration guides
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

### How do I submit changes?

1. Read the [Development Guidelines](./CONTRIBUTING.md)
2. Create a feature/fix branch
3. Follow code standards
4. Submit PR for review

---

## 📚 Learning Resources

### I'm new to Next.js. Where should I start?

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)
- [Architecture Guide](./ARCHITECTURE.md)

### How can I learn more about the tech stack?

Check out:
- [Getting Started Guide](./GETTING_STARTED.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [API Reference](./API_REFERENCE.md)

### Where can I see code examples?

Browse the codebase:
- Components: `app/_components/`
- API routes: `app/api/`
- Database: `configs/`
- Background jobs: `inngest/`

---

## 📞 Support

### Where can I get help?

1. Check this FAQ
2. Read the [documentation](./README.md)
3. Contact the development team
4. Review existing documentation

### Is there a team chat?

Coordinate with the team through your preferred internal communication channels.

### How do I report security issues?

Report security concerns immediately to the project lead or development team.

---

## 🔮 Future Plans

### What features are coming next?

See the [ROADMAP.md](../ROADMAP.md) for:
- Face integration
- Thumbnail search
- A/B testing
- Performance analytics
- And more!

### How are features prioritized?

Feature prioritization is determined by the development team based on project goals and requirements.

### How can I stay updated?

- Review the [ROADMAP.md](../ROADMAP.md) regularly
- Attend team sync meetings
- Check commit history and PR updates

---

**Last Updated:** January 17, 2026  
**Can't find your question?** Contact the development team
