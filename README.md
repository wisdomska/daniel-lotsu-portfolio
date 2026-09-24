# Daniel Ajayi Lotsu — portfolio & CMS

Personal portfolio for Daniel Ajayi Lotsu (Backend & Cloud Engineer, AmaliTech, Kumasi) with a
built-in content management system. Every word, image, colour and layout choice on the site can
be edited at `/cms`, previewed as a draft, and published live in seconds without a redeploy.

- **Live:** https://daniel-lotsu.vercel.app (branch `main`)
- **Development:** https://daniel-lotsu-dev.vercel.app (branch `develop`)
- **CMS:** `/cms` on either site

The visual design comes from a Claude Design prototype kept in [`design-source/`](design-source/)
for reference.

## Stack

| Concern       | Choice                                                                         |
| ------------- | ------------------------------------------------------------------------------ |
| Framework     | Next.js 16 (App Router), React 19, TypeScript (strict)                         |
| Styling       | CSS Modules + design tokens in `src/styles/tokens.css`; fonts via `next/font`  |
| Database      | Postgres on Neon, Drizzle ORM, committed migrations in `drizzle/`              |
| Files         | Vercel Blob (direct browser uploads, verified server-side)                     |
| Validation    | Zod schemas mirroring the CMS field schema, shared by forms and server actions |
| Auth          | Single admin, argon2id password hash, signed `httpOnly` JWT cookie (`jose`)    |
| Rate limiting | Postgres-backed fixed window (login, password change, contact form)            |
| Email         | Resend (optional) for new contact messages                                     |
| Tests         | Vitest (unit), Playwright (end-to-end smoke tests)                             |
| Tooling       | pnpm, ESLint, Prettier, Husky + lint-staged, commitlint (Conventional Commits) |

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how the pieces fit together.

## Local setup

Requirements: Node 24 (`.nvmrc`) and pnpm 10 (`corepack enable` or `npm i -g pnpm`).

```bash
pnpm install
cp .env.example .env.local        # then fill in AUTH_SECRET and ADMIN_INITIAL_PASSWORD
pnpm db:local                     # terminal 1: local Postgres (PGlite) on port 54329
pnpm db:migrate && pnpm db:seed   # terminal 2: create tables and load the default content
pnpm dev                          # http://localhost:3000, CMS at /cms
```

`pnpm db:local` runs [PGlite](https://pglite.dev) — real Postgres compiled to WebAssembly — so no
Docker or Postgres install is needed. Its data lives in `.pglite/` (git-ignored). To use a Neon
branch instead, point `DATABASE_URL` at it.

Sign in to the CMS with `ADMIN_EMAIL` and `ADMIN_INITIAL_PASSWORD`. The admin account is created
on the first sign-in; after that the password is changed in **CMS → Settings** and the variable
is ignored.

Without `DATABASE_URL` the public site still renders the default content (useful for quick UI
work), but the CMS needs a database.

## Scripts

| Script                         | What it does                                                          |
| ------------------------------ | --------------------------------------------------------------------- |
| `pnpm dev`                     | Next.js dev server                                                    |
| `pnpm build` / `pnpm start`    | Production build / serve it                                           |
| `pnpm lint` / `pnpm typecheck` | ESLint / `tsc --noEmit`                                               |
| `pnpm format` / `format:check` | Prettier write / check                                                |
| `pnpm test`                    | Unit tests (Vitest)                                                   |
| `pnpm test:e2e`                | Smoke tests (Playwright). Needs a build and a seeded database         |
| `pnpm db:local`                | Local Postgres via PGlite                                             |
| `pnpm db:generate`             | Generate a migration after changing `src/lib/db/schema.ts`            |
| `pnpm db:migrate`              | Apply migrations                                                      |
| `pnpm db:seed`                 | Insert default content for any missing section (`--force` resets all) |
| `pnpm db:studio`               | Drizzle Studio                                                        |
| `pnpm vercel-build`            | What Vercel runs: migrate → seed → build                              |

To run the smoke tests against a running dev server instead of a build:
`E2E_BASE_URL=http://localhost:3000 pnpm test:e2e`.

## Environment variables

Every variable is listed, with comments, in [`.env.example`](.env.example).

| Variable                 | Needed for                       | Notes                                                |
| ------------------------ | -------------------------------- | ---------------------------------------------------- |
| `DATABASE_URL`           | Everything dynamic               | Neon pooled URL (injected by the Neon integration)   |
| `DATABASE_URL_UNPOOLED`  | Migrations                       | Direct URL; falls back to `DATABASE_URL`             |
| `AUTH_SECRET`            | CMS sessions                     | `openssl rand -base64 32`; different per environment |
| `ADMIN_EMAIL`            | CMS login                        | `danielajayi100@gmail.com`                           |
| `ADMIN_INITIAL_PASSWORD` | First CMS login                  | Only read until the admin account exists             |
| `BLOB_READ_WRITE_TOKEN`  | Uploads                          | Injected by the Vercel Blob store                    |
| `NEXT_PUBLIC_SITE_URL`   | Canonical URLs, sitemap, OG tags | Production: `https://daniel-lotsu.vercel.app`        |
| `RESEND_API_KEY`         | Contact notifications (optional) | Without it, messages still reach the inbox           |
| `CONTACT_NOTIFY_EMAIL`   | Contact notifications            | Where notifications go                               |
| `CONTACT_FROM_EMAIL`     | Contact notifications            | Must be on a Resend-verified domain                  |

## Deployment

`main` deploys to production and `develop` to the preview/dev site, automatically on every push.
Setup, environment separation and the release process are in
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Editing content

Daniel's guide to the CMS, written for non-developers: [docs/CMS-GUIDE.md](docs/CMS-GUIDE.md).

## Contributing

Work on `develop` or a short-lived `feature/*` branch and open a pull request. Commits follow
[Conventional Commits](https://www.conventionalcommits.org) (enforced by commitlint), and the
pre-commit hook lints and formats staged files. CI must pass before merging to `main`.
