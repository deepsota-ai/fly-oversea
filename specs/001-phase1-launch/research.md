# Research: Phase 1 — Launch Presence

## 1. Google Calendar OAuth + Free/Busy API

### Setup
- **App type**: Web server OAuth 2.0 (confidential client) in Google Cloud Console
- **Scope**: `https://www.googleapis.com/auth/calendar.freebusy` (narrowest — read-only free/busy; no event titles exposed)
- **Consent**: Set project to "Testing" mode in OAuth consent screen; add consultant email addresses as test users — no need to go through Google's app verification process for Phase 1

### Authorization flow
1. Redirect consultant to Google's authorization URL with `access_type=offline` — this is critical to receive a `refresh_token`
2. Google sends an authorization `code` to the callback URI
3. Exchange `code` for tokens at `https://oauth2.googleapis.com/token`
4. Response: `access_token` (expires in 3600 s), `refresh_token` (long-lived), `expires_in`

### Free/Busy API call
- **Endpoint**: `POST https://www.googleapis.com/calendar/v3/freeBusy`
- **Request**: `{ timeMin, timeMax, items: [{ id: "primary" }] }`
- **Response**: `calendars.primary.busy` — array of `{ start, end }` blocks (RFC3339, exclusive end)

### Deriving available slots
1. Sort busy blocks by `start`
2. Walk a cursor from `timeMin`. For each busy block, the gap `[cursor, block.start]` is a free interval
3. After last busy block, `[cursor, timeMax]` is free
4. Split free intervals into 20-minute slots
5. Remove any slot already booked in the platform DB

### Token refresh
- POST to `https://oauth2.googleapis.com/token` with `grant_type=refresh_token`
- Google refresh tokens don't expire on a schedule (only if unused 6+ months or user revokes)
- Refresh proactively when `expires_at < now + 60s`

**Decision**: Use `googleapis` npm package which handles token refresh automatically via `OAuth2Client.setCredentials()`.

---

## 2. Zoom OAuth + Create Meeting API

### Setup
- **App type**: General OAuth App (user-managed) — correct for consultants connecting personal Zoom accounts. NOT Server-to-Server OAuth (that's for the platform's own account)
- **Required scope**: `meeting:write:meeting` (granular scope for creating meetings)
- **Development mode**: Zoom OAuth apps in development mode only allow authorized users (you can add test accounts in Zoom Marketplace). No need to publish to Marketplace for Phase 1

### Authorization flow
1. Redirect consultant to `https://zoom.us/oauth/authorize` with `response_type=code`
2. Zoom sends `code` to callback URI
3. Exchange `code` at `https://zoom.us/oauth/token?grant_type=authorization_code` with Basic Auth header (`Base64(CLIENT_ID:CLIENT_SECRET)`)
4. Response: `access_token` (expires in 3600 s), `refresh_token` (expires after 90 days non-use), `token_type=bearer`

### Create Meeting API
- **Endpoint**: `POST https://api.zoom.us/v2/users/me/meetings` (Bearer auth)
- **Minimum request body**:
  ```json
  { "topic": "留学免费咨询", "type": 2, "start_time": "<ISO8601>", "duration": 20 }
  ```
- **Key response fields**:
  - `id` — numeric meeting ID
  - `join_url` — `https://zoom.us/j/<id>` — this is what goes in the email
  - `start_url` — host join URL (expires, don't store)

### Token refresh
- POST to `https://zoom.us/oauth/token?grant_type=refresh_token` with Basic Auth
- Zoom refresh token expires after 90 days of non-use — warn consultant to re-link if approaching expiry
- Refresh proactively when `expires_at < now + 60s`

**Decision**: Implement thin wrapper functions (`createZoomMeeting`, `refreshZoomToken`) in `src/lib/zoom.ts`. No SDK — the API surface is small.

---

## 3. Token Storage

### Fields per Consultant (both providers)

| Field | Google | Zoom |
|-------|--------|------|
| Access token | `googleAccessToken` | `zoomAccessToken` |
| Refresh token | `googleRefreshToken` | `zoomRefreshToken` |
| Expiry timestamp | `googleTokenExpiry` | `zoomTokenExpiry` |
| Provider user ID | not needed (use "primary") | `zoomUserId` |

**Phase 1**: Store tokens as plaintext in the database (libSQL). Token encryption deferred to Phase 2 (when dealing with paid users' data at scale). The Turso database itself is access-controlled.

---

## 4. Architecture Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | Turso (libSQL) local file for dev | Zero setup, SQLite syntax, trivially switch to cloud Turso for prod |
| Consultant auth | NextAuth CredentialsProvider | Simple; Google/Zoom OAuth are separate integration flows, not login |
| Google Calendar auth | Separate Route Handler OAuth flow | Not mixed with NextAuth; consultant explicitly authorises calendar read |
| Zoom auth | Separate Route Handler OAuth flow | Same pattern as Google; clean separation |
| Email | Resend SDK | Simple API, 3000 free emails/month, React email templates |
| Slot duration | Fixed 20 min | Per spec; variable durations are Phase 3 |
| Slot generation | Server-side at query time | No pre-generated slot records; compute from Google + booking window on demand |
| Token refresh | Proactive on each API call | Check expiry before calling; refresh inline if needed |
