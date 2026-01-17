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
# Database
DATABASE_URL="your_postgresql_connection_string"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# ImageKit (Cloud Storage)
ImageKit_PUBLIC_KEY="your_imagekit_public_key"
ImageKit_PRIVATE_KEY="your_imagekit_private_key"
ImageKit_URL_ENDPOINT="your_imagekit_url_endpoint"

# OpenRouter (AI Model)
OPENROUTER_API_KEY="your_openrouter_api_key"

# Replicate (Image Generation)
REPLICATE_API_KEY="your_replicate_api_key"

# Inngest (Background Jobs)
INNGEST_EVENT_KEY="your_inngest_event_key"
INNGEST_SIGNING_KEY="your_inngest_signing_key"
```

### 4. Database Setup

Run database migrations:

```bash
npm run db:push
# or if using drizzle-kit directly
npx drizzle-kit push
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔑 Getting API Keys

### Clerk (Authentication)
1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the publishable key and secret key from the dashboard

### ImageKit (Image Storage)
1. Sign up at [imagekit.io](https://imagekit.io)
2. Navigate to Developer Options
3. Copy your Public Key, Private Key, and URL Endpoint

### OpenRouter (AI Models)
1. Visit [openrouter.ai](https://openrouter.ai)
2. Create an account and generate an API key
3. Add credits to your account ($5 minimum recommended)

### Replicate (Image Generation)
1. Sign up at [replicate.com](https://replicate.com)
2. Go to Account Settings → API Tokens
3. Create a new token
4. Add billing information and credits ($5 minimum recommended)

### Inngest (Background Jobs)
1. Visit [inngest.com](https://inngest.com)
2. Create a free account
3. Create a new app
4. Copy the Event Key and Signing Key

## 📁 Project Structure

```
Vision-KeyInsights/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (routes)/                 # Protected routes
│   │   ├── dashboard/
│   │   └── thumbnail-generator/
│   ├── api/                      # API routes
│   │   ├── generate-thumbnail/
│   │   ├── inngest/
│   │   └── user/
│   ├── _components/              # Global components
│   └── globals.css
├── components/                   # Reusable components
│   └── ui/                       # shadcn/ui components
├── configs/                      # Configuration files
│   ├── db.tsx                    # Database connection
│   └── schema.ts                 # Database schema
├── inngest/                      # Background jobs
│   ├── client.ts
│   └── functions.ts
├── lib/                          # Utility functions
├── public/                       # Static assets
├── services/                     # API services
├── docs/                         # Documentation
└── [config files]                # Various config files
```

## 🧪 Testing

```bash
# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check TypeScript types
npm run type-check

# Lint code
npm run lint
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check firewall settings if using cloud database

### API Rate Limiting
- Replicate free tier limits: 6 requests/minute with <$5 credit
- Add more credits to increase limits
- Implement request queuing for high traffic

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

## 🔄 Updating

To update to the latest version:

```bash
git pull origin main
npm install
npm run db:push
npm run dev
```

## 📚 Next Steps

- Read the [Architecture Guide](./ARCHITECTURE.md)
- Explore [Features Documentation](./FEATURES.md)
- Check the [API Reference](./API_REFERENCE.md)
- Review the [Deployment Guide](./DEPLOYMENT.md)

## 🆘 Getting Help

- Check the [FAQ](./FAQ.md)
- Contact the development team
- Review the documentation
