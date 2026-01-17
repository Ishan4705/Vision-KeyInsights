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
       ┌────────────────┼────────────────┐
       │                │                │
┌──────▼──────┐  ┌─────▼─────┐   ┌─────▼─────┐
│  PostgreSQL │  │  Inngest  │   │  ImageKit │
│  Database   │  │  Queue    │   │  Storage  │
└─────────────┘  └─────┬─────┘   └───────────┘
                       │
              ┌────────┼────────┐
              │                 │
       ┌──────▼──────┐   ┌─────▼─────┐
       │ OpenRouter  │   │ Replicate │
       │    (AI)     │   │  (Images) │
       └─────────────┘   └───────────┘
```

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **State Management:** React Hooks

### Backend
- **Runtime:** Node.js
- **Framework:** Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Background Jobs:** Inngest

### Authentication
- **Provider:** Clerk
- **Features:** 
  - Email/Password authentication
  - OAuth providers
  - Session management
  - User profiles

### Cloud Services
- **Image Storage:** ImageKit
- **AI Text Generation:** OpenRouter (Gemini 2.5 Flash)
- **AI Image Generation:** Replicate (Google Imagen-4)
- **Background Processing:** Inngest

### DevOps
- **Version Control:** Git
- **Hosting:** Vercel (recommended)
- **Database Hosting:** Neon/Supabase (recommended)

## 📦 Key Components

### 1. Authentication System (Clerk)

**Location:** `app/(auth)/`

Handles user authentication and authorization:
- Sign up/Sign in pages
- Session management
- Protected routes via middleware
- User profile management

```typescript
// middleware.tsx
import { clerkMiddleware } from '@clerk/nextjs/server';
export default clerkMiddleware();
```

### 2. Database Layer (Drizzle ORM)

**Location:** `configs/db.tsx`, `configs/schema.ts`

**Schema:**
```typescript
// Users Table
- id: integer (PK, auto-increment)
- name: varchar
- email: varchar (unique)

// Thumbnails Table
- id: integer (PK, auto-increment)
- userInput: varchar
- thumbnailUrl: varchar
- refImage: varchar
- userEmail: varchar (FK → users.email)
- createdOn: varchar
```

### 3. API Routes

**Location:** `app/api/`

#### `/api/generate-thumbnail`
- **POST:** Initiates thumbnail generation
  - Accepts: `userInput`, `refImage` (optional), `faceImage` (optional)
  - Returns: Inngest run ID
- **GET:** Fetches user's thumbnail history
  - Returns: List of generated thumbnails

#### `/api/inngest`
- Inngest webhook endpoint for background job execution

#### `/api/user`
- User-related operations (future use)

### 4. Background Job Processing (Inngest)

**Location:** `inngest/functions.ts`

#### Thumbnail Generation Workflow

```typescript
generateAiThumbnail(event) {
  1. Upload Images
     ├─ Upload refImage to ImageKit (if provided)
     └─ Upload faceImage to ImageKit (if provided)
  
  2. Generate Thumbnail Prompt
     ├─ Send to OpenRouter (Gemini 2.5 Flash)
     ├─ Include refImage context (if available)
     └─ Return optimized prompt
  
  3. Generate Image
     ├─ Send prompt to Replicate (Imagen-4)
     ├─ Parameters: 16:9 aspect ratio, PNG format
     └─ Return generated image URL
  
  4. Upload Thumbnail
     ├─ Download generated image
     └─ Upload to ImageKit for permanent storage
  
  5. Save to Database
     ├─ Store thumbnail metadata
     └─ Link to user account
  
  6. Return Result
}
```

### 5. UI Components

#### Sidebar Navigation
**Location:** `app/_components/AppSidebar.tsx`

Features:
- Route navigation
- Active route highlighting
- Responsive design

#### Dashboard
**Location:** `app/(routes)/dashboard/`

Components:
- Welcome banner
- Feature list
- Quick actions

#### Thumbnail Generator
**Location:** `app/(routes)/thumbnail-generator/`

Components:
- Input form for user prompt
- Reference image upload
- Face image upload (future)
- Thumbnail generation trigger
- Loading states

#### Thumbnail List
**Location:** `app/(routes)/thumbnail-generator/_components/ThumbnailList.tsx`

Features:
- Grid display of thumbnails
- Image preview in new tab
- Skeleton loading states
- Responsive grid layout

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
2. Generate Prompt (OpenRouter)
    ↓
3. Generate Image (Replicate)
    ↓
4. Upload Thumbnail (ImageKit)
    ↓
5. Save to Database
    ↓
Job Complete
    ↓
User sees thumbnail in gallery
```

### Authentication Flow

```
User visits protected route
    ↓
Middleware checks session
    ↓
No session? → Redirect to /sign-in
    ↓
Sign in with Clerk
    ↓
Session created
    ↓
Access granted to protected routes
```

## 🔐 Security Considerations

### API Keys
- Stored in environment variables
- Never exposed to client
- Separate keys for development and production

### Authentication
- Clerk handles session security
- Protected routes via middleware
- User-specific data isolation

### Database
- User data linked to Clerk email
- No direct user authentication in DB
- Foreign key constraints for data integrity

## 🚀 Performance Optimizations

### Image Optimization
- Next.js Image component for automatic optimization
- ImageKit CDN for fast delivery
- Lazy loading for thumbnail gallery

### Background Processing
- Inngest handles long-running tasks
- Non-blocking API responses
- Async/await for parallel operations

### Caching
- Next.js automatic caching
- Static generation where possible
- Dynamic routes with ISR (future)

## 📈 Scalability

### Current Limitations
- Replicate API rate limits
- ImageKit storage limits
- Database connection pooling

### Future Improvements
- Redis caching layer
- Queue management for high traffic
- CDN optimization
- Database read replicas
- Microservices architecture

## 🧪 Testing Strategy

### Current State
- Manual testing
- TypeScript type checking
- ESLint for code quality

### Future Additions
- Unit tests (Jest + React Testing Library)
- Integration tests
- E2E tests (Playwright)
- API testing (Postman/Newman)

## 📊 Monitoring & Logging

### Current
- Console logging
- Inngest dashboard for job monitoring
- Vercel analytics (when deployed)

### Future
- Error tracking (Sentry)
- Performance monitoring (Vercel Speed Insights)
- Custom analytics dashboard

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2026 | Initial release with core features |

---

**Last Updated:** January 17, 2026  
**Maintained By:** [Ishan4705](https://github.com/Ishan4705)
