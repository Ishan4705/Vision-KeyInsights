# Database Schema

Complete database schema documentation for Vision KeyInsights.

## Overview

**Database:** PostgreSQL (Neon serverless)  
**ORM:** Drizzle ORM  
**Migrations:** Drizzle Kit  
**Schema Location:** `configs/schema.ts`

## Schema Diagram

```
┌─────────────────┐
│     users        │
├─────────────────┤
│ id (PK)          │───┐
│ name             │   │
│ email (UQ)       │   │
└─────────────────┘   │
                      │ Foreign Key (email)
      ┌───────────────┼──────────────────┐
      │               │                  │
┌─────▼────────┐  ┌───▼──────────┐  ┌───▼────────────────┐
│  thumbnails   │  │  AiContent   │  │  TrendingKeywords   │
├──────────────┤  ├──────────────┤  ├─────────────────────┤
│ id (PK)       │  │ id (PK)      │  │ id (PK)             │
│ userInput     │  │ userInput    │  │ userInput           │
│ thumbnailUrl  │  │ content (J)  │  │ keywords (JSON)     │
│ refImage      │  │ thumbnailUrl │  │ userEmail (FK)      │
│ userEmail(FK) │  │ userEmail(FK)│  │ createdOn           │
│ createdOn     │  │ createdOn    │  └─────────────────────┘
└──────────────┘  └──────────────┘
```

## Tables

### users

Stores user account information synced from Clerk authentication.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PRIMARY KEY, AUTO INCREMENT | Unique user identifier |
| `name` | varchar(255) | NOT NULL | User's full name |
| `email` | varchar(255) | NOT NULL, UNIQUE | User's email address |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`

**Notes:**
- User authentication handled by Clerk
- Email synced from Clerk on first sign-in
- Used as foreign key in all content tables

**Example Row:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

### thumbnails (AiThumbnailTable)

Stores generated AI thumbnail metadata.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PRIMARY KEY, AUTO INCREMENT | Unique thumbnail identifier |
| `userInput` | varchar | NULLABLE | Original user prompt/description |
| `thumbnailUrl` | varchar | NULLABLE | URL of generated thumbnail (ImageKit CDN) |
| `refImage` | varchar | NULLABLE | URL of reference image if used (ImageKit CDN) |
| `userEmail` | varchar | FOREIGN KEY → users.email | Owner of the thumbnail |
| `createdOn` | varchar | NULLABLE | Creation date (YYYY-MM-DD format) |

**Foreign Keys:**
- `userEmail` REFERENCES `users(email)`

---

### AiContent (AiContentTable)

Stores AI-generated content including titles, descriptions, tags, and thumbnail prompts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PRIMARY KEY, AUTO INCREMENT | Unique content identifier |
| `userInput` | varchar | NULLABLE | Original user topic/input |
| `content` | json | NULLABLE | Full AI-generated content (titles, description, tags, thumbnailPrompts) |
| `thumbnailUrl` | varchar | NULLABLE | URL of first generated thumbnail (ImageKit CDN) |
| `userEmail` | varchar | FOREIGN KEY → users.email | Owner of the content |
| `createdOn` | varchar | NULLABLE | Creation date (YYYY-MM-DD format) |

**Foreign Keys:**
- `userEmail` REFERENCES `users(email)`

**JSON Structure (content field):**
```json
{
  "titles": [
    { "title": "Generated Title 1", "seoScore": 85 },
    { "title": "Generated Title 2", "seoScore": 78 },
    { "title": "Generated Title 3", "seoScore": 92 }
  ],
  "description": "Generated compelling video description...",
  "tags": ["tag1", "tag2", "tag3", "..."],
  "thumbnailPrompts": [
    { "heading": "Prompt 1", "prompt": "A professional YouTube thumbnail..." },
    { "heading": "Prompt 2", "prompt": "A flat vector-style thumbnail..." }
  ]
}
```

**Example Row:**
```json
{
  "id": 10,
  "userInput": "React Tutorial for Beginners",
  "content": { "titles": [...], "description": "...", "tags": [...], "thumbnailPrompts": [...] },
  "thumbnailUrl": "https://ik.imagekit.io/abc/thumbnail_react_1234.png",
  "userEmail": "john@example.com",
  "createdOn": "2026-04-18"
}
```

---

### TrendingKeywords (TrendingKeywordsTable)

Stores AI-analyzed SEO keyword results from Google and YouTube searches.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PRIMARY KEY, AUTO INCREMENT | Unique record identifier |
| `userInput` | varchar | NULLABLE | Original search query |
| `keywords` | json | NULLABLE | Full keyword analysis results |
| `userEmail` | varchar | FOREIGN KEY → users.email | Owner of the keyword results |
| `createdOn` | varchar | NULLABLE | Creation date (YYYY-MM-DD format) |

**Foreign Keys:**
- `userEmail` REFERENCES `users(email)`

**JSON Structure (keywords field):**
```json
{
  "main_keyword": "Next.js AI Projects",
  "keywords": [
    {
      "keyword": "nextjs ai tutorial",
      "score": 88,
      "related_queries": ["nextjs openai integration", "build ai app nextjs"]
    },
    {
      "keyword": "ai projects for beginners",
      "score": 75,
      "related_queries": ["easy ai projects", "ai project ideas 2026"]
    }
  ]
}
```

**Example Row:**
```json
{
  "id": 5,
  "userInput": "Next.js AI Projects",
  "keywords": { "main_keyword": "...", "keywords": [...] },
  "userEmail": "john@example.com",
  "createdOn": "2026-04-18"
}
```

---

## Relationships

### One-to-Many: users → thumbnails
- One user can have many thumbnails
- Foreign key: `thumbnails.userEmail` → `users.email`

### One-to-Many: users → AiContent
- One user can have many content generations
- Foreign key: `AiContent.userEmail` → `users.email`

### One-to-Many: users → TrendingKeywords
- One user can have many keyword analysis results
- Foreign key: `TrendingKeywords.userEmail` → `users.email`

---

## Drizzle Schema Definition

**Location:** `configs/schema.ts`

```typescript
import { integer, pgTable, varchar, json } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});

export const AiThumbnailTable = pgTable('thumbnails', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userInput: varchar(),
    thumbnailUrl: varchar(),
    refImage: varchar(),
    userEmail: varchar().references(() => usersTable.email),
    createdOn: varchar(),
});

export const AiContentTable = pgTable('AiContent', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userInput: varchar(),
    content: json(),
    thumbnailUrl: varchar(),
    userEmail: varchar().references(() => usersTable.email),
    createdOn: varchar()
});

export const TrendingKeywordsTable = pgTable('TrendingKeywords', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userInput: varchar(),
    keywords: json(),
    userEmail: varchar().references(() => usersTable.email),
    createdOn: varchar()
});
```

---

## Common Queries

### Insert New Thumbnail

```typescript
const result = await db.insert(AiThumbnailTable).values({
  userInput: "React Tutorial: Build App in 1 Hour",
  thumbnailUrl: "https://ik.imagekit.io/abc/thumbnail.png",
  refImage: null,
  userEmail: "john@example.com",
  createdOn: moment().format('yyyy-MM-DD'),
}).returning();
```

### Insert AI Content

```typescript
const result = await db.insert(AiContentTable).values({
  content: generatedContent,
  createdOn: moment().format('yyyy-MM-DD'),
  thumbnailUrl: uploadedThumbnailUrl,
  userEmail: "john@example.com",
  userInput: "React Tutorial"
}).returning();
```

### Insert Trending Keywords

```typescript
const result = await db.insert(TrendingKeywordsTable).values({
  userEmail: "john@example.com",
  userInput: "Next.js AI",
  keywords: parsedKeywords,
  createdOn: moment().format('yyyy-MM-DD'),
}).returning();
```

### Get User's Thumbnails (Latest First)

```typescript
const thumbnails = await db
  .select()
  .from(AiThumbnailTable)
  .where(eq(AiThumbnailTable.userEmail, userEmail))
  .orderBy(desc(AiThumbnailTable.id));
```

### Get Single Thumbnail

```typescript
const thumbnail = await db
  .select()
  .from(AiThumbnailTable)
  .where(eq(AiThumbnailTable.id, thumbnailId))
  .limit(1);
```

### Delete Thumbnail

```typescript
await db
  .delete(AiThumbnailTable)
  .where(eq(AiThumbnailTable.id, thumbnailId));
```

---

## Migrations

### Running Migrations

```bash
# Generate migration
npx drizzle-kit generate

# Push schema to database
npx drizzle-kit push

# Open Drizzle Studio (GUI)
npx drizzle-kit studio
```

### Migration History

| Version | Date | Changes |
|---------|------|---------|
| 1 | Jan 2026 | Initial schema — users and thumbnails tables |
| 2 | Apr 2026 | Added AiContent table (JSON content storage) |
| 3 | Apr 2026 | Added TrendingKeywords table (keyword analysis) |

---

## Data Integrity

### Constraints

- **Primary Keys:** Auto-incrementing integers ensure unique records
- **Foreign Keys:** Enforce referential integrity between users and all content tables
- **Unique Constraints:** Prevent duplicate user emails
- **Not Null:** Ensure required fields (name, email) are always populated

### Cascade Behavior

Currently, no CASCADE delete is implemented. Considerations for future:

```typescript
// Option 1: Cascade delete
userEmail: varchar().references(() => usersTable.email, { onDelete: 'cascade' })

// Option 2: Set null
userEmail: varchar().references(() => usersTable.email, { onDelete: 'set null' })

// Option 3: Restrict
userEmail: varchar().references(() => usersTable.email, { onDelete: 'restrict' })
```

---

## Performance Considerations

### Current Indexes

- `users.email` — UNIQUE index (automatic)
- `thumbnails.id` — PRIMARY KEY index (automatic)
- `AiContent.id` — PRIMARY KEY index (automatic)
- `TrendingKeywords.id` — PRIMARY KEY index (automatic)

### Recommended Indexes

```sql
-- Add index on userEmail for faster filtering across all tables
CREATE INDEX idx_thumbnails_user_email ON thumbnails(userEmail);
CREATE INDEX idx_aicontent_user_email ON "AiContent"(userEmail);
CREATE INDEX idx_trendingkeywords_user_email ON "TrendingKeywords"(userEmail);

-- Add composite index for user queries with date sorting
CREATE INDEX idx_thumbnails_user_date ON thumbnails(userEmail, createdOn DESC);
```

### Query Optimization

- Use `.limit()` for pagination
- Use `.where()` to filter before `.orderBy()`
- Neon handles connection pooling for serverless
- Use prepared statements for repeated queries

---

## Future Schema Changes

See [ROADMAP.md](../ROADMAP.md) for planned features that may require schema updates:

### Planned Additions

```typescript
// Add faceImage column to thumbnails
faceImage: varchar()

// Add status tracking to thumbnails
status: varchar() // 'pending', 'completed', 'failed'

// Add generation metadata
model: varchar() // AI model used
prompt: text() // Generated AI prompt
duration: integer() // Generation time in seconds

// Add social features
likes: integer().default(0)
visibility: varchar() // 'private', 'public'

// Add A/B testing
variantOf: integer().references(() => AiThumbnailTable.id)
clicks: integer().default(0)
impressions: integer().default(0)
ctr: decimal(5, 2) // Click-through rate
```

---

## Backup & Recovery

### Recommended Backup Strategy

```bash
# Full database backup
pg_dump -h hostname -U username -d database_name -F c -b -v -f backup.dump

# Restore from backup
pg_restore -h hostname -U username -d database_name -v backup.dump
```

### Cloud Provider Backups

Neon (recommended) provides:
- Automated daily backups
- Point-in-time recovery
- Branching for preview environments

---

**Last Updated:** April 18, 2026  
**Schema Version:** 2.0
