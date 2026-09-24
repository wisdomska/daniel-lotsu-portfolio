import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

/**
 * One row per CMS section (hero, projects, blog, settings…). Editors write to
 * `draft`; Publish copies it to `published`, which is all the public site reads.
 */
export const contentSections = pgTable('content_sections', {
  id: text('id').primaryKey(),
  draft: jsonb('draft').notNull(),
  published: jsonb('published').notNull(),
  draftUpdatedAt: timestamp('draft_updated_at', { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp('published_at', { withTimezone: true }).notNull().defaultNow(),
});

/** Snapshots of each publish, pruned to the latest 20 per section. */
export const sectionVersions = pgTable(
  'section_versions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sectionId: text('section_id').notNull(),
    data: jsonb('data').notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('section_versions_section_published_idx').on(t.sectionId, t.publishedAt.desc())],
);

/** The single CMS admin. Seeded from ADMIN_EMAIL / ADMIN_INITIAL_PASSWORD. */
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  /** Sessions issued before this are rejected, so a password change logs everyone out. */
  passwordChangedAt: timestamp('password_changed_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: createdAt(),
});

/** Messages from the contact form, shown in the CMS inbox. */
export const inboxMessages = pgTable(
  'inbox_messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    message: text('message').notNull(),
    read: boolean('read').notNull().default(false),
    /** Salted hash of the sender's IP, for abuse tracing without storing the address. */
    ipHash: text('ip_hash'),
    createdAt: createdAt(),
  },
  (t) => [index('inbox_messages_created_idx').on(t.createdAt.desc())],
);

/** Fixed-window counters for login and contact-form rate limiting. */
export const rateLimits = pgTable('rate_limits', {
  key: text('key').primaryKey(),
  count: integer('count').notNull().default(0),
  windowStart: timestamp('window_start', { withTimezone: true }).notNull().defaultNow(),
});

/** Every file uploaded to Vercel Blob, so unreferenced ones can be cleaned up. */
export const blobAssets = pgTable('blob_assets', {
  url: text('url').primaryKey(),
  pathname: text('pathname').notNull(),
  contentType: text('content_type').notNull(),
  size: integer('size').notNull(),
  createdAt: createdAt(),
});
