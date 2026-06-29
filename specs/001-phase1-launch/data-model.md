# Data Model: Phase 1 — Launch Presence

**Database**: Turso (libSQL / SQLite-compatible)
**ORM**: Prisma 5.20 with `@prisma/adapter-libsql`

---

## Entities

### Consultant (顾问)

Represents a registered study-abroad consultant. Created by admin seed; not self-registered in Phase 1.

| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | PK |
| `name` | String | Display name |
| `email` | String (unique) | Login email |
| `passwordHash` | String | bcrypt hash |
| `bio` | String? | Short bio shown on homepage |
| `specialisations` | String | JSON array, e.g. `["美国","英国","PhD"]` |
| `photoUrl` | String? | Profile photo URL |
| `bookingWindowJson` | String? | JSON: `{days:[1,2,3,4,5], startHour:10, endHour:18}` (0=Sun) |
| `googleConnected` | Boolean | Whether Google Calendar is linked |
| `googleAccessToken` | String? | Encrypted at rest (Phase 2); plaintext in Phase 1 |
| `googleRefreshToken` | String? | Persisted for token refresh |
| `googleTokenExpiry` | DateTime? | When access token expires |
| `zoomConnected` | Boolean | Whether Zoom account is linked |
| `zoomAccessToken` | String? | Zoom OAuth access token |
| `zoomRefreshToken` | String? | Zoom refresh token |
| `zoomTokenExpiry` | DateTime? | When Zoom access token expires |
| `zoomUserId` | String? | Zoom user ID (needed for Create Meeting endpoint) |
| `createdAt` | DateTime | Auto-set |
| `updatedAt` | DateTime | Auto-updated |

**Validation rules**:
- `bookingWindowJson.startHour` < `bookingWindowJson.endHour`
- `bookingWindowJson.days` is a non-empty subset of [0,1,2,3,4,5,6]
- Default booking window if not set: Mon–Fri 09:00–18:00

---

### Lead (潜在学生)

Submitted intake form from a prospective student. Not a User — no authentication.

| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | PK |
| `name` | String | Student's name |
| `wechatId` | String | WeChat handle |
| `email` | String | For email notifications |
| `institution` | String | Current school |
| `major` | String | Current major |
| `gpa` | Float | Numeric GPA |
| `gpaScale` | Float | Scale denominator (e.g., 4.0, 5.0, 100) |
| `graduationYear` | Int | Expected graduation year |
| `targetCountries` | String | JSON array, e.g. `["美国","英国"]` |
| `targetDegree` | String | One of: 本科、硕士、博士、语言学校 |
| `testScores` | String? | JSON object, e.g. `{"TOEFL":105,"GRE":320}` |
| `notes` | String? | Free-text |
| `createdAt` | DateTime | Submission timestamp |

**Validation rules**:
- `gpa` must be > 0 and ≤ `gpaScale`
- `graduationYear` must be ≥ current year
- `email` must be a valid email format
- `targetCountries` must be non-empty

---

### Appointment (预约)

A confirmed booking linking a Lead to a Consultant time slot.

| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | PK |
| `leadId` | String (unique FK) | → Lead. One lead = one appointment max in Phase 1 |
| `consultantId` | String (FK) | → Consultant |
| `startAt` | DateTime | Appointment start — stored as UTC; displayed as CST (UTC+8) in all UI and emails |
| `durationMin` | Int | Fixed 20 in Phase 1 |
| `zoomMeetingUrl` | String? | Join URL from Zoom API; null if creation failed |
| `zoomMeetingId` | String? | Zoom internal meeting ID |
| `confirmEmailSent` | Boolean | True after confirmation emails sent |
| `reminderSent` | Boolean | True after 24h reminder sent |
| `status` | String | `confirmed` \| `cancelled` (default: `confirmed`) |
| `createdAt` | DateTime | Booking timestamp |

**Uniqueness constraint**: No two Appointments may have the same `consultantId` + `startAt` (prevents double-booking). Enforced via unique index in Prisma schema + atomic DB write check.

**State transitions**:
```
[created] → confirmed (default on creation)
confirmed → cancelled (consultant-initiated; Phase 3 student cancellation)
```

---

## Prisma Schema (target)

```prisma
// prisma/schema.prisma

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Consultant {
  id                String   @id @default(cuid())
  name              String
  email             String   @unique
  passwordHash      String
  bio               String?
  specialisations   String   @default("[]")
  photoUrl          String?
  bookingWindowJson String?

  googleConnected    Boolean   @default(false)
  googleAccessToken  String?
  googleRefreshToken String?
  googleTokenExpiry  DateTime?

  zoomConnected    Boolean   @default(false)
  zoomAccessToken  String?
  zoomRefreshToken String?
  zoomTokenExpiry  DateTime?
  zoomUserId       String?

  appointments Appointment[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Lead {
  id              String  @id @default(cuid())
  name            String
  wechatId        String
  email           String
  institution     String
  major           String
  gpa             Float
  gpaScale        Float
  graduationYear  Int
  targetCountries String  @default("[]")
  targetDegree    String
  testScores      String?
  notes           String?

  appointment Appointment?

  createdAt DateTime @default(now())
}

model Appointment {
  id           String   @id @default(cuid())
  leadId       String   @unique
  consultantId String
  startAt      DateTime
  durationMin  Int      @default(20)

  zoomMeetingUrl String?
  zoomMeetingId  String?

  confirmEmailSent Boolean @default(false)
  reminderSent     Boolean @default(false)
  status           String  @default("confirmed")

  lead       Lead       @relation(fields: [leadId], references: [id])
  consultant Consultant @relation(fields: [consultantId], references: [id])

  createdAt DateTime @default(now())

  @@unique([consultantId, startAt])
}
```

---

## Seed Data (`prisma/seed.ts`)

Creates one consultant for local testing:

```
name:     "张明"
email:    "consultant@test.com"
password: "password123"  (hashed)
bio:      "美国TOP30硕士，5年留学申请经验，擅长理工科和商科申请。"
specialisations: ["美国", "英国", "硕士", "PhD"]
bookingWindowJson: {"days":[1,2,3,4,5], "startHour":10, "endHour":18}
```
