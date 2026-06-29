# Tasks: Phase 1 — Launch Presence (上线获客)

**Input**: Design documents from `specs/001-phase1-launch/`
**App root**: All file paths below are relative to `shadboard/full-kit/`
**Tests**: Not requested — no test tasks generated
**Timezone**: All times displayed as CST (UTC+8); stored as UTC

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: User story label (US1–US7)

---

## Phase 1: Project Setup

**Purpose**: Install new dependencies, wire Turso adapter, run initial migration

- [ ] T001 Install new packages: `pnpm add @libsql/client @prisma/adapter-libsql resend googleapis @react-email/components bcryptjs` and `pnpm add -D @types/bcryptjs` in `shadboard/full-kit/`
- [ ] T002 [P] Copy `.env.example` to `.env.local` and fill in all values from quickstart.md (DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_REDIRECT_URI, RESEND_API_KEY, CRON_SECRET)
- [ ] T003 Replace `prisma/schema.prisma` with the Turso-compatible schema from `specs/001-phase1-launch/data-model.md` — change provider to `sqlite`, add `previewFeatures = ["driverAdapters"]`, add `Consultant`, `Lead`, `Appointment` models
- [ ] T004 Run `pnpm exec prisma migrate dev --name init` to create `dev.db` and apply schema
- [ ] T005 Create `src/lib/prisma.ts` — Prisma singleton using `@prisma/adapter-libsql` and `@libsql/client`, reading `DATABASE_URL` from env
- [ ] T006 Create `prisma/seed.ts` — seed one test consultant (`consultant@test.com` / `password123`, name `张明`, bio, specialisations, bookingWindowJson Mon–Fri 10–18); run with `pnpm exec prisma db seed`

**Checkpoint**: `pnpm dev` starts without errors; `dev.db` exists with seeded consultant row.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Consultant authentication and shared types — must be complete before any user story work

**⚠️ CRITICAL**: US2–US7 all require this phase to be complete

- [ ] T007 Update `src/app/api/auth/[...nextauth]/route.ts` — add `CredentialsProvider` that looks up `Consultant` by email, verifies bcrypt password, returns `{ id, name, email, role: "consultant" }` as session user
- [ ] T008 Update `src/app/api/auth/sign-in/route.ts` (if separate) or verify sign-in page at `src/app/[lang]/(plain-layout)/(auth)/sign-in/page.tsx` works for consultant credentials login
- [ ] T009 [P] Create `src/types/booking.ts` — export shared types: `ConsultantPublic`, `LeadInput`, `TimeSlot { start: string; end: string }`, `AppointmentResult`

**Checkpoint**: Sign in at `/sign-in` with `consultant@test.com` / `password123` → session established, redirect to dashboard.

---

## Phase 3: US1 — Student Discovers Brand and Initiates Booking (P1) 🎯

**Goal**: Fully branded homepage with consultant profiles, testimonials, WeChat QR, and CTA linking to the booking flow

**Independent Test**: Open `/zh/pages/landing` — all sections visible, CTA navigates to `/zh/pages/book`

- [ ] T010 [P] [US1] Update `src/app/[lang]/(plain-layout)/pages/landing/_components/hero.tsx` — replace placeholder headline/subheadline/CTA with real copy; CTA button links to `/{lang}/pages/book`
- [ ] T011 [P] [US1] Update `src/app/[lang]/(plain-layout)/pages/landing/_components/core-benefits.tsx` — replace with 3–4 study-abroad service advantages (e.g. 专业背景提升、名校申请策略、全程1对1服务)
- [ ] T012 [P] [US1] Update `src/app/[lang]/(plain-layout)/pages/landing/_components/core-features.tsx` — replace with service features (选校定位、文书指导、面试培训、签证辅助)
- [ ] T013 [P] [US1] Update `src/app/[lang]/(plain-layout)/pages/landing/_components/faqs.tsx` — replace FAQ items with 4–5 common study-abroad consulting questions
- [ ] T014 [P] [US1] Update `src/app/[lang]/(plain-layout)/pages/landing/_components/contact-us.tsx` and `contact-us-form.tsx` — replace contact details with real phone, email, WeChat; simplify form to name + message
- [ ] T015 [P] [US1] Create `src/app/[lang]/(plain-layout)/pages/landing/_components/consultants-section.tsx` — grid of consultant cards (photo, name, bio, specialisation tags); data hardcoded from seed values for now
- [ ] T016 [P] [US1] Create `src/app/[lang]/(plain-layout)/pages/landing/_components/testimonials-section.tsx` — carousel of 3–4 student testimonials (name/alias, admitted school, quote); data hardcoded
- [ ] T017 [US1] Update `src/app/[lang]/(plain-layout)/pages/landing/page.tsx` — add `<ConsultantsSection />` and `<TestimonialsSection />` in correct page order (after core-features, before contact)
- [ ] T018 [P] [US1] Add WeChat QR code image to `public/images/wechat-qr.png` (placeholder for now) and display in `contact-us.tsx`

**Checkpoint**: Homepage at `/zh/pages/landing` shows all sections; CTA button navigates correctly.

---

## Phase 4: US6 — Consultant Links Google Calendar (P1)

**Goal**: Consultant can authorise Google Calendar read access via OAuth; connection status visible in settings

**Independent Test**: Sign in as consultant → Settings → Integrations → click 连接 Google 日历 → complete OAuth → status shows 已连接; call `/api/consultants` and confirm consultant appears

- [ ] T019 [US6] Create `src/lib/google-calendar.ts` — implement: `getGoogleAuthUrl(consultantId)`, `exchangeGoogleCode(code, consultantId)` (saves tokens to DB), `refreshGoogleToken(consultant)`, `getFreeBusy(consultant, timeMin, timeMax)` returning busy blocks, `deriveAvailableSlots(busyBlocks, bookingWindow, existingAppointments, date)` returning 20-min `TimeSlot[]` in UTC
- [ ] T020 [US6] Create `src/app/api/auth/google/connect/route.ts` — GET handler: verify consultant session, redirect to `getGoogleAuthUrl()` with `access_type=offline&prompt=consent`
- [ ] T021 [US6] Create `src/app/api/auth/google/callback/route.ts` — GET handler: exchange `code` for tokens via `exchangeGoogleCode()`, set `googleConnected=true` on Consultant, redirect to `/[lang]/(dashboard-layout)/pages/account/settings?tab=integrations&googleConnected=true`
- [ ] T022 [US6] Add DELETE handler to `src/app/api/auth/google/connect/route.ts` — clear Google tokens and set `googleConnected=false` on Consultant
- [ ] T023 [US6] Create `src/app/[lang]/(dashboard-layout)/pages/account/settings/_components/integrations-tab.tsx` — show Google Calendar card: 连接/断开 button, connection status badge ("已连接" / "未连接"); no availability preview yet (route exists in Phase 8)
- [ ] T024 [US6] Add `integrations` tab to existing `src/app/[lang]/(dashboard-layout)/pages/account/settings/page.tsx` — render `<IntegrationsTab />`
- [ ] T024a [P] [US6] Create `src/app/api/consultants/me/booking-window/route.ts` — PATCH handler: verify consultant session; parse and validate body `{ days: number[], startHour: number, endHour: number }` (startHour < endHour, days non-empty subset of 0–6); update `Consultant.bookingWindowJson`; return 200 with updated value
- [ ] T024b [US6] Extend `src/app/[lang]/(dashboard-layout)/pages/account/settings/_components/integrations-tab.tsx` — add booking-window editor below Google Calendar card: days-of-week checkboxes (Mon–Sun) + start/end hour selects (06–22); pre-populated from current `bookingWindowJson`; on save calls `PATCH /api/consultants/me/booking-window`; shows success toast on update

**Checkpoint**: Full Google OAuth round-trip works on localhost; `Consultant.googleConnected = true` in DB after linking; consultant can update and save booking window from settings UI.

---

## Phase 5: US7 — Consultant Links Zoom Account (P1)

**Goal**: Consultant can authorise their personal Zoom account; Zoom connection status visible alongside Google Calendar status

**Independent Test**: Sign in → Settings → Integrations → click 连接 Zoom → complete OAuth → status shows 已连接; `Consultant.zoomConnected = true` in DB

- [ ] T025 [US7] Create `src/lib/zoom.ts` — implement: `getZoomAuthUrl()`, `exchangeZoomCode(code, consultantId)` (saves tokens to DB), `refreshZoomToken(consultant)`, `createZoomMeeting(consultant, startAt, durationMin)` returning `{ id, joinUrl }`, handles token expiry proactively
- [ ] T026 [US7] Create `src/app/api/auth/zoom/connect/route.ts` — GET handler: verify consultant session, redirect to `getZoomAuthUrl()`
- [ ] T027 [US7] Create `src/app/api/auth/zoom/callback/route.ts` — GET handler: exchange `code` via `exchangeZoomCode()`, set `zoomConnected=true`, redirect to settings integrations tab
- [ ] T028 [US7] Add DELETE handler to `src/app/api/auth/zoom/connect/route.ts` — clear Zoom tokens, set `zoomConnected=false`
- [ ] T029 [P] [US7] Update `src/app/[lang]/(dashboard-layout)/pages/account/settings/_components/integrations-tab.tsx` — add Zoom card below Google Calendar card with same connect/disconnect pattern

**Checkpoint**: Full Zoom OAuth round-trip works on localhost; creating a test meeting returns a `join_url`.

---

## Phase 6: US2 — Student Completes Background Form (P1)

**Goal**: Student fills the intake form; data saved as Lead; duplicate emails trigger warn-and-merge flow

**Independent Test**: Submit form with valid data → `Lead` row in DB → consultant receives notification email → student advances to Step 2

- [ ] T030 [US2] Create `src/app/api/leads/route.ts` — POST handler: validate body with zod schema (all required fields + optional fields from spec FR-004); check for existing Lead by email: if found with confirmed Appointment return `{ exists: true, appointmentId }`; if found without Appointment return `{ exists: true, leadId }` for merge; else create new Lead; send notification email to consultant
- [ ] T031 [P] [US2] Create `src/components/booking/step-background-form.tsx` — react-hook-form + zod form with all fields from FR-004; handles duplicate email response: show 已有记录 modal with 更新并继续 / 取消 choice; on success calls `onNext(leadId)`
- [ ] T032 [US2] Create `src/app/[lang]/(plain-layout)/pages/book/page.tsx` — client component managing 3-step wizard state (`step`, `leadId`, `consultantId`) in React `useState`; renders `<StepBackgroundForm>` for step 1; add `<Suspense>` wrapper and loading fallback

**Checkpoint**: Submit form → 201 response with leadId → row visible in DB.

---

## Phase 7: US3 — Student Selects a Consultant (P1)

**Goal**: After form submission, student sees consultant cards; selecting one advances to time-slot step

**Independent Test**: `/api/consultants` returns 张明 (because `googleConnected=true` after Phase 4); clicking 查看可用时间 advances wizard to Step 3 with correct consultantId

- [ ] T033 [US3] Create `src/app/api/consultants/route.ts` — GET handler: query Consultants where `googleConnected = true`; return `ConsultantPublic[]` (id, name, bio, specialisations, photoUrl only — no tokens)
- [ ] T034 [P] [US3] Create `src/components/booking/step-consultant-select.tsx` — fetches `/api/consultants`, renders card grid with photo, name, bio, specialisation tags, 查看可用时间 button; on select calls `onNext(consultantId)`
- [ ] T035 [US3] Update `src/app/[lang]/(plain-layout)/pages/book/page.tsx` — render `<StepConsultantSelect>` for step 2; pass `leadId` through

**Checkpoint**: Step 2 shows 张明 card; selecting it sets consultantId in wizard state.

---

## Phase 8: US4 — Student Books a Time Slot (P1)

**Goal**: Calendar shows Google Calendar–derived available slots in CST; student books a slot; double-booking prevented atomically

**Independent Test**: Calendar loads available slots for 张明; select a slot and confirm → 201; same slot returns 409 for second attempt; slot absent from calendar on refresh

- [ ] T036 [US4] Create `src/app/api/consultants/[id]/availability/route.ts` — GET handler: load Consultant with Google tokens; call `refreshGoogleToken()` if needed; call `getFreeBusy()` for next 14 days; call `deriveAvailableSlots()` subtracting existing Appointments; return slots as `TimeSlot[]` with `start`/`end` in CST (UTC+8 ISO strings)
- [ ] T037 [P] [US4] Create `src/components/booking/step-time-picker.tsx` — fetches `/api/consultants/[id]/availability`; renders FullCalendar in `timeGrid` view showing available slots; on slot click shows confirmation modal; on confirm calls `POST /api/appointments`; displays 409 error with 请选择其他时间 message
- [ ] T038 [US4] Create `src/app/api/appointments/route.ts` — POST handler: validate `{ leadId, consultantId, startAt }`; verify slot is within available set (re-derive, don't trust client); use `prisma.$transaction` to create Appointment with `@@unique([consultantId, startAt])` — catch P2002 unique violation and return 409; after successful insert trigger email + Zoom (Phase 9)
- [ ] T039 [US4] Update `src/app/[lang]/(plain-layout)/pages/book/page.tsx` — render `<StepTimePicker>` for step 3; on booking success show confirmation screen with appointment details in CST

**Checkpoint**: End-to-end booking flow works; DB has Appointment row; 409 on double-book.

---

## Phase 9: US5 — Confirmation Email + Zoom Meeting Link (P1)

**Goal**: Booking confirmation triggers Zoom meeting creation and sends emails to both parties in CST

**Independent Test**: Complete a booking → both student email and consultant email arrive within 2 minutes with Zoom join URL; `Appointment.zoomMeetingUrl` populated in DB

- [ ] T040 [P] [US5] Create `src/lib/email/templates/confirmation.tsx` — React Email component: appointment date/time in CST, consultant name, student name, Zoom join link (or placeholder if null), platform branding
- [ ] T041 [P] [US5] Create `src/lib/email/templates/reminder.tsx` — React Email component: appointment in 24h reminder, CST time, Zoom link
- [ ] T042 [P] [US5] Create `src/lib/email/templates/cancellation.tsx` — React Email component: appointment cancelled notice, CST time, 如有疑问请联系微信 contact
- [ ] T043 [US5] Create `src/lib/email/index.ts` — Resend wrapper: `sendConfirmation(appointment, student, consultant)`, `sendReminder(appointment, student)`, `sendCancellation(appointment, student)` — all format times as CST before passing to templates
- [ ] T044 [US5] Update `src/app/api/appointments/route.ts` POST handler (after DB insert): call `createZoomMeeting()` → update `Appointment.zoomMeetingUrl`; call `sendConfirmation()`; if Zoom fails, still send confirmation email with null link and log warning
- [ ] T045 [US5] Create `src/app/api/cron/reminders/route.ts` — GET handler: check `Authorization: Bearer <CRON_SECRET>` header; query Appointments where `startAt BETWEEN now+23h AND now+25h AND reminderSent=false AND status='confirmed'`; call `sendReminder()` for each; set `reminderSent=true`; return `{ sent: N }`

**Checkpoint**: Scenario E from quickstart.md passes — confirmation email with Zoom link arrives within 2 minutes.

---

## Phase 10: Consultant Appointment Cancellation (P1 — from clarification)

**Goal**: Consultant can view upcoming appointments and cancel one; student receives cancellation email; slot becomes bookable again

**Independent Test**: Consultant signs in → sees appointment → cancels → Appointment.status = 'cancelled'; student email arrives; slot reappears in booking calendar

- [ ] T046 [US4] Create `src/app/api/appointments/[id]/route.ts` — PATCH handler: verify requester is the owning consultant (session check); update `status = 'cancelled'`; call `sendCancellation()`; return 200
- [ ] T047 [P] [US4] Create `src/app/[lang]/(dashboard-layout)/pages/appointments/page.tsx` — consultant view: list of confirmed appointments (startAt in CST, student name, Zoom link); each row has a 取消预约 button that calls PATCH `/api/appointments/[id]` with confirm dialog
- [ ] T048 [US4] Add Appointments page link to the dashboard sidebar navigation config (in whichever nav config file shadboard uses, typically `src/configs/` or similar)

**Checkpoint**: Scenario: cancel an appointment → status `cancelled` in DB → student email received → slot reappears on booking calendar.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: UX robustness, security hardening, and final validation

- [ ] T049 Add loading skeletons and error boundary fallbacks to `step-background-form.tsx`, `step-consultant-select.tsx`, and `step-time-picker.tsx` — use shadcn/ui `Skeleton` components
- [ ] T050 [P] Add empty-state UI to `step-consultant-select.tsx` when no consultants are connected, and to `step-time-picker.tsx` when no slots available — both show 暂无可用时间，请通过微信联系我们 with WeChat contact
- [ ] T051 [P] Protect `/api/cron/reminders` with `CRON_SECRET` header check — return 401 if missing or incorrect (already in T045 spec, verify it's implemented)
- [ ] T052 Run all quickstart.md validation scenarios (A through G) end-to-end; fix any failures
- [ ] T053 Verify pages render correctly in WeChat WebView: test `landing`, `book` pages on a mobile device or WeChat DevTools

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Requires Phase 1 complete
- **Phase 3 (US1 Homepage)**: Requires Phase 1 only — can start in parallel with Phase 2
- **Phase 4 (US6 Google Calendar)**: Requires Phase 2 complete
- **Phase 5 (US7 Zoom)**: Requires Phase 2 complete — can run in parallel with Phase 4
- **Phase 6 (US2 Intake Form)**: Requires Phase 2 complete — can run in parallel with Phase 4+5
- **Phase 7 (US3 Consultant Select)**: Requires Phase 4 complete (consultant must have Google connected)
- **Phase 8 (US4 Calendar Booking)**: Requires Phase 4 + Phase 6 + Phase 7 complete
- **Phase 9 (US5 Email + Zoom)**: Requires Phase 5 + Phase 8 complete
- **Phase 10 (Cancellation)**: Requires Phase 8 + Phase 9 complete (`sendCancellation` defined in T043)
- **Phase 11 (Polish)**: Requires all prior phases complete

### Parallel Opportunities After Phase 2

```
Phase 2 complete
├── Phase 3 (US1)         ← independent, start early
├── Phase 4 (US6)         ← can run parallel
├── Phase 5 (US7)         ← can run parallel with Phase 4
└── Phase 6 (US2)         ← can run parallel with Phase 4+5
```

Within each phase, tasks marked `[P]` can run simultaneously.

---

## Implementation Strategy

### MVP First (Phases 1–8 only)

1. Phase 1: Setup → project boots
2. Phase 2: Foundational → consultant can log in
3. Phase 3: Homepage → brand visible
4. Phase 4: Google Calendar OAuth → consultant linked
5. Phase 5: Zoom OAuth → consultant linked
6. Phase 6: Intake form → leads captured
7. Phase 7: Consultant select → step 2 works
8. Phase 8: Calendar booking → full flow works, no email yet
9. **STOP AND VALIDATE** — quickstart scenarios A–D pass

### Full Phase 1 Completion (Phases 1–11)

Add Phases 9–11 to complete emails, Zoom links, cancellation, and polish — then run scenarios E–G from quickstart.md.

---

## Notes

- All file paths are relative to `shadboard/full-kit/`
- `[P]` tasks = different files, no cross-dependencies, safe to implement in parallel
- Times: always store UTC, display/email as CST (UTC+8)
- Zoom failure in T044 is non-blocking — appointment still saved, email still sent with placeholder
- The `@@unique([consultantId, startAt])` constraint in the schema is the sole source of truth for double-booking prevention (T038)
- Commit after each checkpoint to preserve working state
