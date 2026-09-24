# Deployment

The site runs on Vercel, with one project and two environments.

| Branch    | Vercel environment | URL                                 | Database              | Blob store       |
| --------- | ------------------ | ----------------------------------- | --------------------- | ---------------- |
| `main`    | Production         | https://daniel-lotsu.vercel.app     | Neon `main` branch    | Production store |
| `develop` | Preview            | https://daniel-lotsu-dev.vercel.app | Neon `develop` branch | Preview store    |

Other branches and pull requests get ordinary preview URLs that use the Preview database.

## What a deploy does

Vercel runs `pnpm vercel-build`:

1. `tsx scripts/migrate.ts` applies any new migrations from `drizzle/` to that environment's
   database (skipped if `DATABASE_URL` is missing). Migrations are additive and already-applied
   ones are skipped, so this is safe on every deploy.
2. `tsx scripts/seed.ts` inserts default content **only for sections that don't exist yet**. It
   never overwrites edits, and it lets a brand-new database render the site straight away.
3. `next build`.

Because Production and Preview have separate databases, a preview build can never migrate or
touch production data.

## One-time setup

1. **GitHub**
   - Create the repo and push `main` and `develop`.
   - Protect `main`: require a pull request, require the CI checks to pass, and block force
     pushes and deletion.
2. **Vercel project** `daniel-lotsu`
   - `vercel link`, then connect the GitHub repo (Settings → Git). The production branch is
     `main`.
   - Settings → Domains: add `daniel-lotsu-dev.vercel.app` and assign it to the `develop` branch.
3. **Neon** (Vercel Marketplace → Neon → connect to the project for Production and Preview).
   - In Neon, create a `develop` branch from `main`.
   - Set Preview's `DATABASE_URL` / `DATABASE_URL_UNPOOLED` to the `develop` branch's
     connection strings, so Preview never uses the production branch.
4. **Vercel Blob:** create two stores (`daniel-lotsu-prod`, `daniel-lotsu-preview`) and connect
   each to its environment. This injects `BLOB_READ_WRITE_TOKEN`.
5. **Environment variables** — set these separately for Production and Preview:

   | Variable                 | Production                             | Preview                               |
   | ------------------------ | -------------------------------------- | ------------------------------------- |
   | `AUTH_SECRET`            | `openssl rand -base64 32`              | a different random value              |
   | `ADMIN_EMAIL`            | `danielajayi100@gmail.com`             | same                                  |
   | `ADMIN_INITIAL_PASSWORD` | strong, unique                         | a different one                       |
   | `NEXT_PUBLIC_SITE_URL`   | `https://daniel-lotsu.vercel.app`      | `https://daniel-lotsu-dev.vercel.app` |
   | `CONTACT_NOTIFY_EMAIL`   | `danielajayi100@gmail.com`             | optional                              |
   | `RESEND_API_KEY`         | optional                               | optional                              |
   | `CONTACT_FROM_EMAIL`     | an address on a Resend-verified domain | optional                              |

   Never commit these. `.env.example` lists every name with no values.

## Releasing

1. Merge feature work into `develop`; it deploys to the dev site.
2. Check https://daniel-lotsu-dev.vercel.app and its CMS.
3. Open a pull request `develop → main`, fill in the template, and wait for CI to pass.
4. Merge. Production deploys automatically.
5. Verify: the home page and `/cms` load without console errors, you can sign in, and a test
   edit shows up on the live page after Publish (then revert it).

## Rolling back

- **Code:** in Vercel → Deployments, promote the previous production deployment.
- **Content:** in the CMS, use **Version history → Restore**, then Publish, or import a backup.
- **Database schema:** migrations are forward-only. Fix forward with a new migration rather than
  editing an applied one.

## Recovering access

If the admin password is lost, use the Neon SQL editor for that environment to run
`DELETE FROM admin_users;`. On the next sign-in the account is recreated from `ADMIN_EMAIL` and
`ADMIN_INITIAL_PASSWORD`. Content and inbox are unaffected.

## Email notes

Without a verified sending domain, Resend only delivers to the Resend account owner's own
address. Until a domain is verified, contact messages still arrive in the CMS inbox — nothing
is lost.
