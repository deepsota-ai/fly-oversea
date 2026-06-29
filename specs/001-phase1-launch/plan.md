# Implementation Plan: Phase 1 — Launch Presence (上线获客)

**Branch**: `001-phase1-launch` | **Date**: 2026-06-28 | **Spec**: [spec.md](spec.md)

## Summary

Build the Phase 1 MVP on top of Shadboard full-kit (Next.js 15 App Router). Customise the existing landing page for the company homepage. Add a 3-step guest booking flow: background form → consultant selection → Google Calendar time slot. Consultants link their Google Calendar (read-only Free/Busy API) and personal Zoom account (OAuth) via a settings page. On booking confirmation, a Zoom meeting is auto-created and confirmation emails are sent via Resend. Database is Turso (libSQL) via Prisma's libSQL adapter. Students do not need accounts — Phase 1 is guest-only booking.

---

## Technical Context

**Language/Version**: TypeScript 5, Node.js ≥22

**Framework**: Next.js 15.2 (App Router, Turbopack in dev)

**Primary Dependencies** (already in shadboard full-kit):
- Prisma 5.20 + `@prisma/adapter-libsql` + `@libsql/client`
- NextAuth v4 (consultant credentials login)
- react-hook-form + zod
- FullCalendar 6
- shadcn/ui + Tailwind CSS v4

**New dependencies to install**:
- `@libsql/client` — Turso database client
- `@prisma/adapter-libsql` — Prisma libSQL bridge
- `resend` — transactional email
- `googleapis` — Google Calendar API
- `@react-email/components` — email templates
- `bcryptjs` + `@types/bcryptjs` — consultant password hashing

**Storage**: Turso (libSQL). Local dev uses `file:./dev.db` (local SQLite). Production uses `libsql://xxx.turso.io`.

**Testing**: Manual end-to-end via browser. OAuth flows tested with ngrok in local dev.

**Target Platform**: Web (desktop + mobile + WeChat WebView). Dev on `localhost:3000`.

**Project Type**: Full-stack Next.js monolith (no separate backend service).

**Performance Goals**: Homepage < 3 s; full booking flow < 5 min end-to-end.

**Constraints**:
- All OAuth redirect URIs configured for `localhost:3000` in dev
- Google OAuth consent screen in "Testing" mode — add consultant emails as test users
- Zoom OAuth app in development mode (no Marketplace publication required)

**Scale/Scope**: 1–3 consultants, ~10–50 leads/month for Phase 1.

**App root**: `shadboard/full-kit/` within the `fly-oversea` repo. All source paths below are relative to `shadboard/full-kit/`.

---

## Constitution Check

Project constitution not yet authored. No gates defined. Proceeding without gate evaluation.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-phase1-launch/
├── plan.md          ← this file
├── research.md      ← Phase 0 output
├── data-model.md    ← Phase 1 output
├── quickstart.md    ← Phase 1 output
├── contracts/
│   └── api.md       ← Phase 1 output
└── tasks.md         ← /speckit-tasks output (not yet)
```

### Source Code (relative to `shadboard/full-kit/`)

**Files to modify**:
```text
prisma/schema.prisma
.env.example
src/app/[lang]/(plain-layout)/pages/landing/page.tsx
src/app/[lang]/(plain-layout)/pages/landing/_components/hero.tsx
src/app/[lang]/(plain-layout)/pages/landing/_components/core-benefits.tsx
src/app/[lang]/(plain-layout)/pages/landing/_components/core-features.tsx
src/app/[lang]/(plain-layout)/pages/landing/_components/faqs.tsx
src/app/[lang]/(plain-layout)/pages/landing/_components/contact-us.tsx
src/app/[lang]/(plain-layout)/pages/landing/_components/contact-us-form.tsx
```

**Files to add**:
```text
src/
├── app/
│   ├── api/
│   │   ├── leads/route.ts
│   │   ├── consultants/route.ts
│   │   ├── consultants/[id]/availability/route.ts
│   │   ├── appointments/route.ts
│   │   ├── appointments/[id]/route.ts              ← cancellation PATCH
│   │   ├── consultants/me/booking-window/route.ts  ← booking window update
│   │   ├── auth/google/connect/route.ts
│   │   ├── auth/google/callback/route.ts
│   │   ├── auth/zoom/connect/route.ts
│   │   ├── auth/zoom/callback/route.ts
│   │   └── cron/reminders/route.ts
│   ├── [lang]/(plain-layout)/pages/
│   │   └── book/page.tsx                       ← 3-step wizard
│   └── [lang]/(dashboard-layout)/pages/
│       └── appointments/page.tsx               ← consultant appointment list + cancel
├── lib/
│   ├── prisma.ts                               ← singleton with libSQL adapter
│   ├── google-calendar.ts                      ← OAuth + Free/Busy helpers
│   ├── zoom.ts                                 ← OAuth + Create Meeting helpers
│   └── email/
│       ├── index.ts
│       ├── templates/confirmation.tsx
│       ├── templates/reminder.tsx
│       └── templates/cancellation.tsx
├── components/
│   └── booking/
│       ├── step-background-form.tsx
│       ├── step-consultant-select.tsx
│       └── step-time-picker.tsx
└── types/
    └── booking.ts
```

**New landing page sections** (added to existing landing page):
```text
src/app/[lang]/(plain-layout)/pages/landing/_components/
├── consultants-section.tsx    ← consultant profile cards
└── testimonials-section.tsx   ← student success cases
```

**Structure Decision**: Single Next.js monolith inside `shadboard/full-kit/`. All backend logic in `src/app/api/` Route Handlers. No separate Express/FastAPI server.

---

## Key Technical Decisions

### D1 — Local dev database
Use libSQL in local file mode (`file:./dev.db`). Zero setup — no Docker, no cloud account. Switch URL to `libsql://xxx.turso.io` for production.

### D2 — Consultant authentication
NextAuth `CredentialsProvider` with bcrypt. Consultants are seeded via `prisma/seed.ts`. Google and Zoom OAuth are **integration flows** (settings page), not login mechanisms. This separates authentication from third-party authorization.

### D3 — Availability algorithm
```
available = slots_in_window(bookingWindow, +14 days)
           - busy_from_google(freeBusy API)
           - booked_in_db(existing Appointments)
```
Slot granularity: 20 minutes. Window is intersection of consultant's configured hours and Google Calendar free periods.

### D4 — Zoom failure handling
Zoom meeting is created synchronously in the booking POST. On failure: appointment is saved with `zoomMeetingUrl = null`; emails sent with "顾问将另行发送会议链接" notice; consultant notified to share link manually.

### D5 — Reminder cron
`/api/cron/reminders` queries appointments with `startAt` between `now + 23h` and `now + 25h` where `reminderSent = false`. In local dev, trigger manually with curl. In production (Vercel), configure as a Vercel Cron job.
