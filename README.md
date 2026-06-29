# 飞越留学

留学咨询预约平台 — Overseas Study Consulting Booking Platform

## Dev setup

**Prerequisites**: Node.js 20+, pnpm 9+

```bash
# Install dependencies
pnpm install

# Copy env and fill in values
cp .env.example .env

# Push schema and seed a test consultant
pnpm prisma migrate deploy
pnpm prisma db seed

# Start dev server (http://localhost:3000 → redirects to /zh/)
pnpm dev
```

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite path, e.g. `file:./dev.db` |
| `NEXTAUTH_SECRET` | Random string — `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App base URL, `http://localhost:3000` for local |
| `GOOGLE_CLIENT_ID` | Google Cloud Console OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console OAuth 2.0 client secret |
| `ZOOM_CLIENT_ID` | Zoom Marketplace app client ID |
| `ZOOM_CLIENT_SECRET` | Zoom Marketplace app client secret |
| `ZOOM_REDIRECT_URI` | Must match Zoom app's Redirect URL setting |
| `RESEND_API_KEY` | From resend.com → API Keys |
| `RESEND_FROM_EMAIL` | Verified sender address (use `onboarding@resend.dev` for dev) |
| `CRON_SECRET` | Any string; sent as `Authorization: Bearer <secret>` to cron routes |

OAuth redirect URIs to register:

- Google: `http://localhost:3000/api/auth/google/callback`
- Zoom: `http://localhost:3000/api/auth/zoom/callback`

## Test login

After seeding, sign in at `/zh/sign-in`:

```
Email:    consultant@test.com
Password: password123
```

## Key routes

| Path | Description |
|---|---|
| `/zh/` | 首页 — student-facing landing page (public) |
| `/zh/consultants` | 导师团队 — consultant profiles (public) |
| `/zh/cases` | 学生案例 — student testimonials (public) |
| `/zh/faq` | 常见问题 — FAQ (public) |
| `/zh/pages/book` | Booking flow — 3-step wizard: form → consultant → time slot (public) |
| `/zh/sign-in` | Consultant login |
| `/zh/pages/appointments` | Consultant dashboard — manage appointments (auth required) |
| `/zh/pages/account/settings/integrations` | Connect Google Calendar & Zoom (auth required) |

## Stage 1 feature coverage

| Feature | Status |
|---|---|
| Branded homepage (hero, benefits, features, consultants, testimonials, FAQ, contact) | ✅ |
| Student intake form (name, WeChat, email, GPA, target countries, etc.) | ✅ |
| Duplicate email detect & merge | ✅ |
| Consultant selection (shows only Google-linked consultants) | ✅ |
| Google Calendar OAuth + booking window config | ✅ |
| Available slot display (14-day window, CST) | ✅ |
| Atomic double-booking prevention | ✅ |
| Zoom OAuth + auto meeting creation on booking | ✅ |
| Confirmation email to student & consultant (with Zoom link, CST times) | ✅ |
| 24h reminder email cron job | ✅ |
| Consultant appointment cancellation + student notification | ✅ |
| Seed script for local dev | ✅ |

## Cron — appointment reminders

`GET /api/cron/reminders` sends 24h reminder emails. Call it with:

```
Authorization: Bearer <CRON_SECRET>
```

Set up a daily cron job (e.g. Vercel Cron, GitHub Actions, cron-job.org) to hit this endpoint.

## Tech stack

- **Next.js 15** (App Router, Turbopack)
- **Prisma 5 + SQLite** (swap `DATABASE_URL` for Postgres/MySQL in production)
- **NextAuth.js** — JWT sessions, credentials provider
- **Resend** — transactional email with React Email templates
- **Tailwind CSS + shadcn/ui**
- **Google Calendar API** — consultant availability (read-only)
- **Zoom API** — auto-created meeting links on booking
