# Quickstart: Phase 1 Local Dev

Get the app running locally end-to-end in ~20 minutes. All commands run from `shadboard/full-kit/`.

---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | ≥ 22 | `node -v` |
| pnpm | ≥ 10 | `pnpm -v` |
| Google Cloud project | — | OAuth credentials ready |
| Zoom Marketplace App | — | OAuth credentials ready |
| Resend account | — | API key ready |

---

## 1. Install Dependencies

```bash
cd shadboard/full-kit
pnpm install

# New packages for Phase 1
pnpm add @libsql/client @prisma/adapter-libsql resend googleapis bcryptjs @react-email/components
pnpm add -D @types/bcryptjs
```

---

## 2. Configure Environment

Copy and fill `.env.local` (never commit this file):

```bash
cp .env.example .env.local
```

Required values in `.env.local`:

```env
# Database — local SQLite file for dev
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"

# Google OAuth (from Google Cloud Console → Credentials → OAuth 2.0 Client ID)
# Authorised redirect URI to add: http://localhost:3000/api/auth/google/callback
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"

# Zoom OAuth (from Zoom Marketplace → Your App → App Credentials)
# Redirect URL to add: http://localhost:3000/api/auth/zoom/callback
ZOOM_CLIENT_ID="xxx"
ZOOM_CLIENT_SECRET="xxx"
ZOOM_REDIRECT_URI="http://localhost:3000/api/auth/zoom/callback"

# Resend (from resend.com → API Keys)
RESEND_API_KEY="re_xxx"
RESEND_FROM_EMAIL="onboarding@resend.dev"  # use this for dev (no domain verification needed)

# Cron secret (anything for local dev)
CRON_SECRET="dev"
```

---

## 3. Update Prisma Schema

Replace `prisma/schema.prisma` with the schema in [data-model.md](data-model.md#prisma-schema-target).

Then run:

```bash
pnpm exec prisma migrate dev --name init
```

This creates `dev.db` in `shadboard/full-kit/` with all three tables.

---

## 4. Seed a Test Consultant

```bash
pnpm exec prisma db seed
```

This creates consultant `consultant@test.com` / `password123`.

---

## 5. Start Dev Server

```bash
pnpm dev
```

Open `http://localhost:3000`. You should see the Shadboard dashboard.

---

## 6. Validation Scenarios

### ✅ Scenario A — Homepage renders
1. Open `http://localhost:3000/zh/pages/landing`
2. Expected: hero section, service benefits, consultant cards, testimonials, WeChat QR, contact form visible

### ✅ Scenario B — Booking flow (no OAuth yet)
1. Click the CTA on the homepage
2. Fill the intake form with valid data → click 提交
3. Expected: advance to consultant selection; see "张明" consultant card
4. Click "查看可用时间" — expected: 404 or empty calendar (Google not yet connected)

### ✅ Scenario C — Consultant Google Calendar setup
1. Open `http://localhost:3000/zh/pages/sign-in`
2. Sign in as `consultant@test.com` / `password123`
3. Go to Settings → Integrations
4. Click "连接 Google 日历" → Google OAuth consent → return to platform
5. Expected: Google status shows "已连接"

> **Note**: For local OAuth you need a tool like **ngrok** if Google requires a public redirect URI. Alternatively, Google allows `localhost` redirect URIs for OAuth apps in testing mode — add `http://localhost:3000/api/auth/google/callback` directly in Google Cloud Console.

### ✅ Scenario D — Consultant Zoom setup
1. In Settings → Integrations, click "连接 Zoom"
2. Complete Zoom OAuth → return to platform
3. Expected: Zoom status shows "已连接"

### ✅ Scenario E — Full booking flow end-to-end
1. Open homepage in a private/incognito window (not logged in as consultant)
2. Complete all 3 steps: background form → select 张明 → pick a time slot
3. Confirm booking
4. Expected:
   - Success page with appointment details
   - Student email receives confirmation with Zoom link within 2 minutes
   - Consultant email receives notification
   - The booked slot disappears from the calendar for a second visitor

### ✅ Scenario F — Double-booking prevention
1. Open the booking flow in two browser windows simultaneously
2. Both select the same slot and click confirm at ~the same time
3. Expected: one succeeds (201), the other gets a 409 error and is shown an alternative slot prompt

### ✅ Scenario G — 24h reminder (manual trigger)
1. Create a booking with `startAt` set to approximately now + 24h (adjust via seed or direct DB edit)
2. Run: `curl -H "Authorization: Bearer dev" http://localhost:3000/api/cron/reminders`
3. Expected: reminder email arrives at student's email; response shows `{ "sent": 1 }`

---

## OAuth Local Dev Notes

**Google**: Add `http://localhost:3000/api/auth/google/callback` to "Authorised redirect URIs" in Google Cloud Console. Add consultant test email to "Test users" in OAuth consent screen.

**Zoom**: In Zoom Marketplace app settings, add `http://localhost:3000/api/auth/zoom/callback` as an allowed redirect URL. Add the consultant's Zoom account as an authorised test user in the app's development mode settings.

**Resend**: `onboarding@resend.dev` works as the sender without domain verification — emails will arrive but may land in spam. For proper delivery, verify your own domain in Resend.
