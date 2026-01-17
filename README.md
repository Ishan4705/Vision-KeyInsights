# Vision KeyInsights

**Private Development Project**

AI-powered YouTube thumbnail generator that helps content creators design professional, eye-catching thumbnails in seconds.

## 🚀 Features

- **AI Thumbnail Generation** - Create stunning YouTube thumbnails using advanced AI models
- **Reference-Based Design** - Upload a reference image to guide the style of your thumbnail
- **Smart Prompting** - AI-powered prompt generation for optimal results
- **Thumbnail Gallery** - View and manage your previously generated thumbnails
- **User Authentication** - Secure authentication with Clerk
- **Cloud Storage** - Seamless image storage with ImageKit

## 🛣️ Roadmap

Want to see what's coming next? Check out our [ROADMAP.md](./ROADMAP.md) for planned features including:
- 🎭 **Face Integration** - Add your face to thumbnails for personalized branding
- 🔍 **Thumbnail Search** - Find inspiration from successful thumbnails
- 📊 **Performance Analytics** - Track thumbnail effectiveness
- 🎨 **Style Presets** - Quick-start templates for common video types

## 📚 Documentation

Complete documentation is available in the `/docs` directory:

- **[Getting Started](./docs/GETTING_STARTED.md)** - Installation and setup guide
- **[Architecture](./docs/ARCHITECTURE.md)** - System design and technical overview
- **[Features](./docs/FEATURES.md)** - Detailed feature documentation
- **[API Reference](./docs/API_REFERENCE.md)** - API endpoints and usage
- **[Database Schema](./docs/DATABASE_SCHEMA.md)** - Database structure
- **[Deployment](./docs/DEPLOYMENT.md)** - Production deployment guide
- **[Contributing](./docs/CONTRIBUTING.md)** - Guidelines for contributors
- **[FAQ](./docs/FAQ.md)** - Frequently asked questions

## 🏁 Quick Start

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
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

- [Architecture Overview](./docs/ARCHITECTURE.md) - Understand the system design
- [Features Guide](./docs/FEATURES.md) - Explore all features in detail
- [API Reference](./docs/API_REFERENCE.md) - API documentation
- [FAQ](./docs/FAQ.md) - Common questions answered

## 🚀 Deployment

Deploy to production in minutes:

```bash
# Push to GitHub
git push origin main

# Deploy to Vercel (recommended)
vercel deploy --prod
```

📖 **Complete deployment guide:** [Deployment Documentation](./docs/DEPLOYMENT.md)

---

## 👥 Development Team

This is a private development project. For internal team members:

- Review the [Contributing Guide](./docs/CONTRIBUTING.md) for development standards
- Follow code style guidelines
- Keep documentation updated as features are added

---

## 📝 License

This project is private and proprietary. All rights reserved.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) team for the amazing framework
- [Vercel](https://vercel.com) for hosting and deployment
- [Clerk](https://clerk.com) for authentication
- [Replicate](https://replicate.com) and [OpenRouter](https://openrouter.ai) for AI capabilities

---

## 📞 Internal Support

- 📖 [Documentation](./docs/README.md)
- 💬 Contact development team for questions
- 📋 Track issues internally

---

**Developed by [Ishan4705](https://github.com/Ishan4705)**
- **AI Models:** [OpenRouter](https://openrouter.ai) & [Replicate](https://replicate.com)
- **Image Storage:** [ImageKit](https://imagekit.io)
- **Background Jobs:** [Inngest](https://www.inngest.com/)

---

## 📖 Learn More

To learn more about this project:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
