# API Contracts: Phase 1

All endpoints are Next.js Route Handlers under `src/app/api/`. Base URL: `http://localhost:3000`.

JSON bodies on all POST requests. All responses JSON. HTTP errors return `{ error: string }`.

---

## Public Endpoints (no auth required)

### POST /api/leads
Submit student intake form (Step 1 of booking flow).

**Request body**:
```json
{
  "name": "王小明",
  "wechatId": "wxid_abc123",
  "email": "student@example.com",
  "institution": "北京大学",
  "major": "计算机科学",
  "gpa": 3.8,
  "gpaScale": 4.0,
  "graduationYear": 2025,
  "targetCountries": ["美国", "英国"],
  "targetDegree": "硕士",
  "testScores": { "TOEFL": 105 },
  "notes": "希望申请CS方向"
}
```

**Response 201**:
```json
{ "leadId": "clxxx..." }
```

**Errors**: 400 if required fields missing or invalid.

---

### GET /api/consultants
List all consultants with an active Google Calendar connection.

**Response 200**:
```json
[
  {
    "id": "clxxx...",
    "name": "张明",
    "bio": "美国TOP30硕士，5年经验...",
    "specialisations": ["美国", "英国", "硕士"],
    "photoUrl": "/photos/zhang-ming.jpg"
  }
]
```

---

### GET /api/consultants/[id]/availability
Get available 20-minute slots for a consultant over the next 14 days.

**Query params**:
- `from` (optional, ISO8601) — start of window, defaults to now
- `tz` (optional) — IANA timezone for slot display, defaults to `Asia/Shanghai`

**Response 200**:
```json
{
  "consultantId": "clxxx...",
  "slots": [
    { "start": "2026-07-01T10:00:00+08:00", "end": "2026-07-01T10:20:00+08:00" },
    { "start": "2026-07-01T10:20:00+08:00", "end": "2026-07-01T10:40:00+08:00" }
  ]
}
```

**Errors**: 404 if consultant not found or Google Calendar not connected.

---

### POST /api/appointments
Confirm a booking. Atomically reserves the slot, creates a Zoom meeting, and triggers confirmation emails.

**Request body**:
```json
{
  "leadId": "clxxx...",
  "consultantId": "clxxx...",
  "startAt": "2026-07-01T10:00:00Z"
}
```

**Response 201**:
```json
{
  "appointmentId": "clxxx...",
  "startAt": "2026-07-01T10:00:00Z",
  "consultantName": "张明",
  "zoomMeetingUrl": "https://zoom.us/j/84754521346",
  "emailSent": true
}
```

**Errors**:
- 409 if slot already booked
- 404 if lead or consultant not found
- 400 if `startAt` is not within an available slot

---

## Consultant OAuth Endpoints (session auth required)

Consultant must be signed in via NextAuth session. These endpoints are accessed from the consultant settings page.

### GET /api/auth/google/connect
Initiate Google Calendar OAuth. Redirects to Google's authorization URL.

**Response**: 302 redirect to `https://accounts.google.com/o/oauth2/v2/auth?...`

---

### GET /api/auth/google/callback
OAuth callback. Exchanges code for tokens, saves to database, redirects to settings page.

**Query params**: `code`, `state` (consultant ID)

**Response**: 302 redirect to `/[lang]/(dashboard-layout)/settings?googleConnected=true`

---

### DELETE /api/auth/google/connect
Revoke Google Calendar connection. Clears tokens from database.

**Response 200**: `{ "disconnected": true }`

---

### GET /api/auth/zoom/connect
Initiate Zoom OAuth. Redirects to Zoom's authorization URL.

**Response**: 302 redirect to `https://zoom.us/oauth/authorize?...`

---

### GET /api/auth/zoom/callback
OAuth callback. Exchanges code for tokens, saves to database.

**Query params**: `code`

**Response**: 302 redirect to `/[lang]/(dashboard-layout)/settings?zoomConnected=true`

---

### DELETE /api/auth/zoom/connect
Revoke Zoom connection. Clears tokens from database.

**Response 200**: `{ "disconnected": true }`

---

## Internal / Cron Endpoints

### GET /api/cron/reminders
Send 24-hour reminder emails. Called by Vercel Cron or manually via curl in local dev.

**Auth**: Vercel Cron secret header (`Authorization: Bearer <CRON_SECRET>`). In local dev, set `CRON_SECRET=dev` and pass it manually.

**Response 200**:
```json
{ "sent": 3, "skipped": 0 }
```
