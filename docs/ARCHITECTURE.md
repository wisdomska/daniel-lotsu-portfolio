# Architecture

## Overview

```
Browser ──► Vercel (Next.js 16)
             ├─ Public site  (static, cached; revalidated on publish)
             ├─ /cms         (dynamic, admin only)
             ├─ Server actions & /api/cms/upload
             │     ├─► Neon Postgres (Drizzle)
             │     ├─► Vercel Blob   (uploads)
             │     └─► Resend        (optional email)
             └─ proxy.ts     (first-line guard for /cms and /api/cms)
```

## Content model

The whole site is one **content document** made of 14 sections (`site`, `nav`, `hero`,
`projects`, `about`, `marquee`, `stack`, `career`, `credentials`, `blog`, `contact`, `footer`,
`resume`, `settings`). Three files define it, all ported from `design-source/portfolio-cms.js`:

| File                            | Role                                                               |
| ------------------------------- | ------------------------------------------------------------------ |
| `src/content/defaults.ts`       | Seed content (`pnpm db:seed`, "Reset section", "Reset everything") |
| `src/content/schema.ts`         | Field definitions that generate the CMS forms                      |
| `src/lib/validation/content.ts` | Zod schemas; the source of every content type (`z.infer`)          |

`tests/unit/validation.test.ts` fails if `schema.ts` and the Zod schemas ever disagree, so a new
field cannot be editable-but-unvalidated or validated-but-uneditable.

Changes from the prototype's model: posts gained a `slug` (for real URLs), images gained alt-text
fields (`projects.items[].imageAlt`, `about.avatarAlt`), `site.ogImage` was added for social
cards, and Daniel's email is `danielajayi100@gmail.com`.

## Storage

| Table              | Purpose                                                                |
| ------------------ | ---------------------------------------------------------------------- |
| `content_sections` | One row per section: `draft` (CMS working copy) and `published` (live) |
| `section_versions` | Snapshot on every publish; the newest 20 per section are kept          |
| `admin_users`      | Email, argon2id hash, `password_changed_at` (invalidates old sessions) |
| `inbox_messages`   | Contact-form messages; stores a keyed hash of the IP, not the IP       |
| `rate_limits`      | Fixed-window counters                                                  |
| `blob_assets`      | Every upload, so unused ones can be deleted                            |

Reading content always goes through `normalizeContent` (`src/lib/merge.ts`): stored sections are
merged over the defaults (so fields added later appear automatically) and validated; a section
that no longer validates falls back to its default instead of breaking the page.

## Rendering and caching

- Public pages (`/`, `/blog`, `/blog/[slug]`, `/resume`, sitemap) are prerendered at build time.
- `getPublishedContent()` is wrapped in `unstable_cache` with the tag `content:published`.
- **Publish** writes the new live copy, then calls `revalidateTag('content:published')` and
  `revalidatePath('/', 'layout')`. The next request regenerates the pages, so changes are live
  within seconds, with no redeploy.
- Without `DATABASE_URL` (e.g. CI's lint job) the defaults are served so builds still work.

### Routes

| Route                                                   | Notes                                                                                                                                                   |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                                     | The single-page portfolio (`components/site/HomeView.tsx`)                                                                                              |
| `/blog`, `/blog/[slug]`                                 | Index and posts with their own metadata, OG tags and JSON-LD                                                                                            |
| `/resume`                                               | Resume page                                                                                                                                             |
| `@modal/(.)blog/[slug]`, `(.)resume`                    | Intercepting routes: from the site, posts and the resume open as dialogs over the page with a real URL. A hard load of the same URL shows the full page |
| `/cms`, `/cms/[section]`, `/cms/inbox`, `/cms/settings` | The CMS (signed out, `/cms` is the sign-in screen)                                                                                                      |
| `/cms/preview`                                          | The draft home page, rendered inside the CMS preview iframe                                                                                             |
| `/api/cms/upload`                                       | Issues Blob upload tokens to the signed-in admin                                                                                                        |
| `/api/og`                                               | Generated social card                                                                                                                                   |

The prototype's `/#resume` links still work (`LegacyHashRedirect`).

## The CMS

- `app/cms/(dash)/layout.tsx` loads the draft, the live copy and the unread count once, and
  wraps every screen in `CmsProvider`, which survives navigation between sections.
- Edits update local state immediately, and are autosaved per section after 450 ms through
  `saveDraftAction`, which validates with Zod on the server. Validation messages come back by
  path and are shown next to the field.
- **Undo** is client-side (last 50 changes this session; rapid typing is one step; Ctrl/Cmd+Z
  outside a text field).
- **Publish** saves any pending edits, then publishes every section whose draft differs from
  what is live. Each publish is snapshotted into **version history**; "Restore" puts a snapshot
  back into the draft for review.
- **Preview** is an iframe of `/cms/preview`. The CMS `postMessage`s every change to it (same
  origin only), so it shows unsaved edits too. Links and forms in the preview are inert.
- **Reset section / Reset everything / Import backup** replace draft sections as one undoable
  change. Imports are validated on the server before anything is applied.

## Uploads

1. The browser checks type and size, then asks `/api/cms/upload` for a token. It is only issued
   to a signed-in admin, for PNG/JPG/WebP/SVG/AVIF/PDF, up to 5 MB, under `uploads/`.
2. The file goes straight to Vercel Blob, which avoids the 4.5 MB serverless body limit.
3. `registerUploadAction` re-checks the stored file's size and **real type from its first
   bytes**, deletes it if it is not acceptable, and records it in `blob_assets`.
4. Replaced files are not deleted straight away, because the live site and saved versions may
   still use them. After each publish, `cleanupUnusedUploads` deletes uploads that no draft,
   live copy or saved version refers to (older than an hour, so fresh uploads are safe).

## Security

- **Auth:** single admin; argon2id; 12-hour HS256 session cookie (`httpOnly`, `secure`,
  `sameSite=lax`). Changing the password invalidates every older session.
- **Defence in depth:** `src/proxy.ts` rejects unsigned requests to `/cms/*` and `/api/cms/*`,
  but every page, server action and route handler checks the session itself
  (`requireAdmin`/`requireAdminPage`).
- **Rate limits** (Postgres, `src/lib/rate-limit.ts`): sign-in 10 per IP and 5 per account per
  15 minutes; password change 5 per 15 minutes; contact form 5 per IP per hour.
- **Contact form:** honeypot field, Zod validation, rate limit; the email step can fail without
  losing the message.
- **Rich text:** only `**bold**` is supported. It is parsed into React text nodes (never HTML), and
  anything tag-like is stripped on save.
- **Links:** only `http(s):`, `mailto:`, `/` and `#` URLs validate, so `javascript:` URLs are
  impossible.
- **Headers** (`next.config.ts`): CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `frame-ancestors 'self'` / `X-Frame-Options: SAMEORIGIN`. Pages are
  static, so there are no per-request nonces and scripts need `'unsafe-inline'`; everything else
  is restricted to known hosts.
- `/cms` sends `X-Robots-Tag: noindex, nofollow` and a `noindex` meta tag, and robots.txt
  disallows it. Preview deployments disallow indexing entirely.

## Accessibility and performance

- One `h1` per page, landmark regions, a skip link, visible focus rings, and native `<dialog>`
  for modals (focus trap, Escape, inert background).
- The career timeline and CMS lists are buttons with `aria-expanded`; toggles are
  `role="switch"`.
- All five preset accents pass WCAG AA on the dark background (a unit test checks), and the
  theme picker warns when a custom colour does not.
- `prefers-reduced-motion` stops the marquee, icon animations and the starfield, which paints
  one still frame instead.
- Server components by default. Client JS is limited to the nav menu, timeline, starfield,
  footer spotlight, contact form, dialogs and the CMS. The starfield starts when the browser is
  idle.
- `next/image` for covers and portraits, `next/font` for the three typefaces, and layout that
  reserves space (aspect ratios), so there is no layout shift.
- The prototype sized layouts with JavaScript (`innerWidth`); here they are CSS media queries at
  the same breakpoints (640, 700, 760, 900, 960px).
