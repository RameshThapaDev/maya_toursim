# Vercel Deployment Guide

## 1. Prerequisites
- A hosted PostgreSQL database (Neon, Supabase, RDS, etc.).
- GitHub repo connected to Vercel.
- Node.js 18+ locally (for validation before push).

## 2. Configure Environment Variables (Vercel)
Set these in `Project Settings -> Environment Variables` for Production (and Preview if needed):

- `DATABASE_URL` (must be hosted DB URL, not localhost)
- `AUTH_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your deployed URL)
- `NEXT_PUBLIC_SITE_URL` (same as above)

Optional (only if using these features):
- `OPENAI_API_KEY`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_PRIVATE_KEY`, `APPLE_KEY_ID`

Use `.env.example` as the source of truth for all keys.

## 3. Database Setup
Run your schema/seed against the hosted database:

```bash
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/seed.sql
```

## 4. Build Settings
Default Vercel Next.js settings are fine:
- Build command: `npm run build`
- Install command: `npm install`
- Output directory: `.next` (auto-detected)

## 5. Deploy
1. Commit and push your changes.
2. Trigger deployment in Vercel.
3. Verify app pages and API routes load.

## 6. Troubleshooting
- `ECONNREFUSED 127.0.0.1:5432`: `DATABASE_URL` is missing/invalid or points to localhost.
- Auth issues: verify both `AUTH_SECRET` and `NEXTAUTH_SECRET`.
- Chat API 500: ensure `OPENAI_API_KEY` is set.
- Email send failures: validate SMTP vars and sender domain.
