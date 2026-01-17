# Database Schema

Complete database schema documentation for Vision KeyInsights.

## Overview

**Database:** PostgreSQL  
**ORM:** Drizzle ORM  
**Migrations:** Drizzle Kit

## Schema Diagram

```
┌─────────────┐
│   users     │
├─────────────┤
│ id (PK)     │───┐
│ name        │   │
│ email (UQ)  │   │
└─────────────┘   │
                  │
                  │ Foreign Key
                  │
                  │
┌─────────────────▼──┐
│   thumbnails      │
├───────────────────┤
│ id (PK)           │
│ userInput         │
│ thumbnailUrl      │
│ refImage          │
│ userEmail (FK)    │
│ createdOn         │
└───────────────────┘
```

## Tables

### users

Stores user account information.

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
- Used for associating thumbnails with users

**Example Row:**
```sql
{
  id: 1,
  name: "John Doe",
  email: "john@example.com"
}
```

---

### thumbnails (AiThumbnailTable)

Stores generated thumbnail metadata.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | integer | PRIMARY KEY, AUTO INCREMENT | Unique thumbnail identifier |
| `userInput` | varchar | NULLABLE | Original user prompt/description |
| `thumbnailUrl` | varchar | NULLABLE | URL of generated thumbnail (ImageKit) |
| `refImage` | varchar | NULLABLE | URL of reference image if used (ImageKit) |
| `userEmail` | varchar | FOREIGN KEY → users.email | Owner of the thumbnail |
| `createdOn` | varchar | NULLABLE | Creation date (YYYY-MM-DD format) |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `userEmail` for faster queries

**Foreign Keys:**
- `userEmail` REFERENCES `users(email)`

**Notes:**
- All varchar fields have no explicit length limit (PostgreSQL text type)
- URLs point to ImageKit CDN
- `createdOn` stored as string for simplicity (consider DATE type for production)

**Example Row:**
```sql
{
  id: 42,
  userInput: "React Tutorial: Build App in 1 Hour",
  thumbnailUrl: "https://ik.imagekit.io/abc/thumbnail_1234.png",
  refImage: "https://ik.imagekit.io/abc/reference_5678.jpg",
  userEmail: "john@example.com",
  createdOn: "2026-01-17"
}
```

---

## Relationships

### One-to-Many: users → thumbnails

- One user can have many thumbnails
- Each thumbnail belongs to exactly one user
- Foreign key: `thumbnails.userEmail` → `users.email`

**Query Example:**
```typescript
// Get all thumbnails for a user
const userThumbnails = await db
  .select()
  .from(AiThumbnailTable)
  .where(eq(AiThumbnailTable.userEmail, 'john@example.com'))
  .orderBy(desc(AiThumbnailTable.id));
```

---

## Drizzle Schema Definition

**Location:** `configs/schema.ts`

```typescript
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

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
  createdOn: moment().format('YYYY-MM-DD'),
}).returning(AiThumbnailTable);
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

### Count User's Thumbnails

```typescript
const count = await db
  .select({ count: sql`count(*)` })
  .from(AiThumbnailTable)
  .where(eq(AiThumbnailTable.userEmail, userEmail));
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
| 1 | Jan 2026 | Initial schema - users and thumbnails tables |

---

## Data Integrity

### Constraints

- **Primary Keys:** Auto-incrementing integers ensure unique records
- **Foreign Keys:** Enforce referential integrity between users and thumbnails
- **Unique Constraints:** Prevent duplicate user emails
- **Not Null:** Ensure required fields are always populated

### Cascade Behavior

Currently, no CASCADE delete is implemented. Considerations:

**Future Options:**
```typescript
// Option 1: Cascade delete (delete thumbnails when user deleted)
userEmail: varchar().references(() => usersTable.email, { onDelete: 'cascade' })

// Option 2: Set null (keep thumbnails, remove association)
userEmail: varchar().references(() => usersTable.email, { onDelete: 'set null' })

// Option 3: Restrict (prevent user deletion if thumbnails exist)
userEmail: varchar().references(() => usersTable.email, { onDelete: 'restrict' })
```

---

## Performance Considerations

### Current Indexes

- `users.email` - UNIQUE index (automatic)
- `thumbnails.id` - PRIMARY KEY index (automatic)
- `thumbnails.userEmail` - Consider adding explicit index for faster queries

### Recommended Indexes

```sql
-- Add index on userEmail for faster filtering
CREATE INDEX idx_thumbnails_user_email ON thumbnails(userEmail);

-- Add composite index for user queries with date sorting
CREATE INDEX idx_thumbnails_user_date ON thumbnails(userEmail, createdOn DESC);
```

### Query Optimization

- Use `.limit()` for pagination
- Use `.where()` to filter before `.orderBy()`
- Consider connection pooling for production
- Use prepared statements for repeated queries

---

## Future Schema Changes

See [ROADMAP.md](../ROADMAP.md) for planned features that may require schema updates:

### Planned Additions

```typescript
// Add faceImage column
faceImage: varchar()

// Add status tracking
status: varchar() // 'pending', 'completed', 'failed'

// Add generation metadata
model: varchar() // AI model used
prompt: text() // Generated AI prompt
duration: integer() // Generation time in seconds
cost: decimal(10, 2) // API cost

// Add social features
likes: integer().default(0)
shares: integer().default(0)
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

Most managed PostgreSQL services (Neon, Supabase, AWS RDS) provide:
- Automated daily backups
- Point-in-time recovery
- Multi-region replication

---

**Last Updated:** January 17, 2026  
**Schema Version:** 1.0
