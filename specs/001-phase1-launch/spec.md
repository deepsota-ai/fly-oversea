# Feature Specification: Phase 1 — Launch Presence (上线获客)

**Feature Branch**: `001-phase1-launch`

**Created**: 2026-06-28

**Status**: Draft

**Input**: 构建 SaaS.md Phase 1 需求，先用 local 跑起来

---

## Overview

Phase 1 establishes the platform's online presence and automates the lead-capture and appointment-booking flow. A prospective student lands on the company homepage, fills in their academic background, selects a consultant, browses that consultant's available time slots (synced from Google Calendar), confirms a booking, and immediately receives a confirmation email containing a Zoom meeting link. Consultants link their Google Calendar and Zoom accounts once via an admin setup page; from then on availability and meeting creation are fully automated.

The entire phase runs locally (`localhost`) for development and validation. No production deployment is required to complete Phase 1.

---

## Clarifications

### Session 2026-06-28

- Q: Which timezone should be used for displaying booking times in the UI and emails? → A: China Standard Time (UTC+8) — all times stored as UTC in the database and displayed as CST to both students and consultants.
- Q: What happens when the same email address submits the intake form more than once? → A: Warn and merge — if the email already exists in the system, show "我们已有您的信息，是否更新并继续预约?" and update the existing Lead record (overwrite fields) rather than creating a duplicate. If the email already has a confirmed appointment, show "您已有预约记录" with the existing appointment details.
- Q: Who can cancel an appointment in Phase 1, and how? → A: Consultant only — cancel via their dashboard; system sends a cancellation notification email to the student. Students cannot self-cancel in Phase 1 (no student accounts).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Student Discovers Brand and Initiates Booking (Priority: P1)

A prospective student in China searches for study-abroad consulting. They land on the homepage, read about the service and consultants, feel confident in the brand, and click the primary CTA to start the free 20-minute consultation booking.

**Why this priority**: Top of funnel. Without this, no leads enter the system.

**Independent Test**: Open `localhost:3000` in a browser. Verify the homepage renders all sections and the CTA navigates to the booking flow.

**Acceptance Scenarios**:

1. **Given** a visitor on the homepage, **When** they scroll through, **Then** they see: hero section with CTA, service overview, consultant profiles (photo + bio + specialisation), student testimonials, WeChat QR code, and contact info.
2. **Given** a visitor on a mobile browser (including WeChat WebView), **When** they open the page, **Then** the layout is single-column, all text is readable without zooming, and the CTA is reachable without horizontal scroll.
3. **Given** a visitor who clicks the CTA button, **When** it is activated, **Then** they are taken to Step 1 of the booking flow.

---

### User Story 2 — Student Completes Background Form (Priority: P1)

After clicking the CTA, the student fills in a structured intake form capturing their academic background and study goals. This data is stored and linked to their subsequent appointment.

**Why this priority**: Without background data the consultant cannot prepare for the 20-minute call.

**Independent Test**: Submit the form with valid data; verify the submission is stored and the student advances to Step 2.

**Acceptance Scenarios**:

1. **Given** a student on the booking form page, **When** they view it, **Then** they see the following required fields: full name, WeChat ID, email, current institution, major, GPA + scale denominator, expected graduation year, target countries (multi-select), target degree level; and the following optional fields: standardised test scores (TOEFL/IELTS/GRE/GMAT), additional notes.
2. **Given** a student who fills all required fields and submits, **When** submission succeeds, **Then** their data is saved and they advance to the consultant-selection step.
3. **Given** a student who leaves a required field empty and clicks Submit, **When** the form validates, **Then** the empty field is highlighted with a clear error message and no data is submitted.
4. **Given** a student who submits a valid form, **When** the system processes it, **Then** the consultant receives an email notification with the student's background summary.

---

### User Story 3 — Student Selects a Consultant (Priority: P1)

After submitting background info, the student sees cards for all available consultants and picks one to book with.

**Why this priority**: Required bridge between form submission and calendar display.

**Independent Test**: With at least one consultant seeded in the system, verify the selection card renders and clicking it advances to Step 3.

**Acceptance Scenarios**:

1. **Given** a student on the consultant-selection step, **When** the page loads, **Then** they see one card per consultant showing: photo, name, academic background, specialisation areas, and a "查看可用时间" (View Available Times) button.
2. **Given** a student who selects a consultant, **When** they click the button, **Then** they advance to Step 3 with that consultant's identity passed forward.

---

### User Story 4 — Student Books a Time Slot from Google Calendar Availability (Priority: P1)

The student sees only the time slots the selected consultant has marked available via their Google Calendar and books one. Double-booking is prevented.

**Why this priority**: Core value of Phase 1 — replaces manual WeChat scheduling.

**Independent Test**: With a consultant's Google Calendar linked, verify the calendar displays available slots for the next 14 days; book a slot; verify it is no longer selectable by a second visitor.

**Acceptance Scenarios**:

1. **Given** a student on the time-selection step, **When** the calendar loads, **Then** it shows only the time slots that are within the consultant's configured booking window AND are free on their Google Calendar, for the next 14 days.
2. **Given** a student who selects an available slot and confirms, **When** the booking is saved, **Then**: the slot becomes unavailable to other students immediately; the student sees a confirmation page with date, time, consultant name, and a note that the Zoom link will arrive by email.
3. **Given** two students who simultaneously attempt to book the same slot, **When** the second one confirms, **Then** they see a "time slot no longer available" message and are prompted to choose another.
4. **Given** a student who has confirmed a booking, **When** the time is within 24 hours of the appointment, **Then** they receive an automated reminder email.

---

### User Story 5 — Student Receives Confirmation Email with Zoom Link (Priority: P1)

Immediately after booking, both the student and the consultant receive an email containing the appointment details and an auto-generated Zoom meeting link.

**Why this priority**: Closes the loop — without the link, the meeting cannot happen.

**Independent Test**: Complete a booking end-to-end; verify both email addresses receive the confirmation within 2 minutes; verify the Zoom link opens a valid meeting room.

**Acceptance Scenarios**:

1. **Given** a booking that has just been confirmed, **When** the system processes it, **Then** within 2 minutes both the student's email and the consultant's email receive a message containing: appointment date/time, consultant name, student name, and a Zoom meeting link.
2. **Given** the Zoom meeting link in the confirmation email, **When** a recipient clicks it, **Then** it opens a Zoom meeting room associated with the consultant's Zoom account and pre-set for 20-minute duration.

---

### User Story 6 — Consultant Links Google Calendar (Priority: P1)

A consultant visits the admin setup page, authorises the platform to read their Google Calendar, and optionally sets a booking window. From that point their availability is automatically surfaced to students.

**Why this priority**: No consultant calendar = no available slots = booking flow breaks.

**Independent Test**: Complete Google OAuth flow in local dev; verify the system can call the Google Calendar Free/Busy API for that consultant and return non-empty data.

**Acceptance Scenarios**:

1. **Given** a consultant on their settings page, **When** they click "连接 Google 日历" (Connect Google Calendar), **Then** they are redirected to Google's OAuth consent screen requesting read-only calendar access.
2. **Given** a consultant who completes Google OAuth, **When** they return to the platform, **Then** their connection status shows "已连接" and a preview of their next 7 days of free/busy slots is visible.
3. **Given** a connected consultant who sets a booking window (e.g., Mon–Fri 10:00–18:00), **When** a student views this consultant's calendar, **Then** only slots within that window AND free on Google Calendar are shown.
4. **Given** a consultant who revokes access, **When** they disconnect, **Then** their slots immediately disappear from the student booking calendar.

---

### User Story 7 — Consultant Links Zoom Account (Priority: P1)

A consultant authorises the platform to create Zoom meetings on their behalf. This is a one-time setup.

**Why this priority**: Required for auto-generating meeting links in confirmation emails.

**Independent Test**: Complete Zoom OAuth flow in local dev; create a test booking; verify a Zoom meeting is created under the consultant's Zoom account.

**Acceptance Scenarios**:

1. **Given** a consultant on their settings page, **When** they click "连接 Zoom", **Then** they are redirected to Zoom's OAuth consent screen.
2. **Given** a consultant who completes Zoom OAuth, **When** they return, **Then** their Zoom connection shows "已连接".
3. **Given** a consultant whose Zoom account is connected and a student who completes a booking, **When** the booking is confirmed, **Then** a Zoom meeting is automatically created on the consultant's account and the link is included in the confirmation emails.

---

### Edge Cases

- What if the consultant has not yet connected their Google Calendar when a student tries to book? → The consultant does not appear in the consultant-selection step (only consultants with a linked, active Google Calendar are shown).
- What if Google Calendar API returns an error during slot loading? → Display "此顾问当前无法获取可用时间，请稍后再试或通过微信联系我们" (Unable to load availability, try again or contact us via WeChat) with the WeChat contact info.
- What if Zoom API fails when creating a meeting link? → The booking is still saved; both emails are sent with a placeholder "Meeting link will be sent shortly" note; the system retries Zoom link creation once and re-sends the email if successful. If retry fails, the consultant is notified to create the meeting manually.
- What if a student tries to book the same consultant twice? → If they submit a new intake form with the same email and a confirmed Appointment already exists, the system displays the existing appointment details and blocks a second booking. If they submit with a different email, a new Lead is created (treated as a distinct person).
- What if no slots are available for the next 14 days? → Display "此顾问近期暂无空闲时间，请通过微信联系我们" with WeChat contact info.

---

## Requirements *(mandatory)*

### Functional Requirements

**Homepage**
- **FR-001**: System MUST display a branded homepage with: hero section, service overview, consultant profiles, student testimonials, WeChat QR code, and contact information.
- **FR-002**: Homepage MUST render correctly on mobile browsers including WeChat WebView.
- **FR-003**: Homepage MUST include a primary CTA leading to the booking flow.

**Student Intake Form (Step 1)**
- **FR-004**: System MUST present a form collecting: name, WeChat ID, email (required); institution, major, GPA + scale, graduation year, target countries (multi-select), target degree level (required); test scores and notes (optional).
- **FR-005**: System MUST validate all required fields before submission and display field-level error messages.
- **FR-006**: System MUST persist the submission. If the submitted email already exists: display "我们已有您的信息，是否更新并继续预约?" and on confirmation update the existing Lead record (do not create a duplicate). If the existing Lead already has a confirmed Appointment, display the existing appointment details and stop the flow. On a new or updated submission, send an email notification to the consultant.
- **FR-007**: System MUST advance the student to the consultant-selection step after successful new or updated submission.

**Consultant Selection (Step 2)**
- **FR-008**: System MUST display only consultants who have an active Google Calendar connection.
- **FR-009**: Each consultant card MUST show: photo, name, background summary, and specialisation areas.

**Calendar Booking (Step 3)**
- **FR-010**: System MUST fetch the selected consultant's free/busy data from Google Calendar for the next 14 days.
- **FR-011**: System MUST intersect Google Calendar availability with the consultant's configured booking window to produce the final set of bookable slots.
- **FR-012**: System MUST prevent double-booking of the same slot (atomic reservation).
- **FR-013**: On booking confirmation, system MUST save the appointment linking the student submission, consultant, and time slot.
- **FR-014**: System MUST trigger confirmation email to both student and consultant within 2 minutes of confirmed booking. All times in emails MUST be displayed in China Standard Time (UTC+8).
- **FR-015**: System MUST send a reminder email to the student 24 hours before the appointment.

**Zoom Integration**
- **FR-016**: System MUST allow a consultant to authorise their personal Zoom account via OAuth.
- **FR-017**: On booking confirmation, system MUST create a Zoom meeting on the consultant's account (20 min, waiting-room enabled) and include the join link in confirmation emails.
- **FR-018**: If Zoom meeting creation fails, system MUST still confirm the booking and notify the consultant to share a link manually.

**Google Calendar Integration**
- **FR-019**: System MUST allow a consultant to authorise read-only access to their Google Calendar via OAuth.
- **FR-020**: System MUST allow the consultant to set a weekly booking window (days of week + time range) that constrains which free slots are shown to students.
- **FR-021**: System MUST allow a consultant to revoke Google Calendar access, which immediately removes their slots from student view.

**Local Development**
- **FR-022**: All OAuth redirect URIs MUST be configurable via environment variables so the application runs correctly on `localhost:3000`.
- **FR-023**: System MUST provide a seed script to create at least one consultant record for local testing.

**Appointment Cancellation**
- **FR-024**: Consultant MUST be able to cancel a confirmed appointment from their dashboard.
- **FR-025**: On cancellation, system MUST update the appointment status to `cancelled`, free the time slot (making it bookable again), and send a cancellation notification email to the student.
- **FR-026**: Students cannot cancel appointments in Phase 1 (no student accounts); cancellation is consultant-initiated only.

### Key Entities

- **Lead** (潜在学生): Submitted intake form. Attributes: name, WeChat ID, email, institution, major, GPA, GPA scale, graduation year, target countries, target degree, test scores, notes, submitted-at.
- **Consultant** (顾问): Platform consultant. Attributes: name, photo URL, bio, specialisation tags, booking window (days + hours), Google Calendar OAuth tokens, Zoom OAuth tokens, notification email.
- **Appointment** (预约): A confirmed booking. Attributes: lead reference, consultant reference, start datetime, duration (20 min), zoom meeting URL, confirmation email sent flag, reminder sent flag, created-at.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A student can complete the full flow (homepage → form → consultant selection → time slot → confirmation) in under 5 minutes.
- **SC-002**: Confirmation emails reach both student and consultant within 2 minutes of booking confirmation in 100% of cases (local dev environment).
- **SC-003**: Double-booking of the same slot is prevented in 100% of attempts, including concurrent submissions.
- **SC-004**: The homepage loads in under 3 seconds on a standard laptop on localhost.
- **SC-005**: A consultant can complete Google Calendar + Zoom OAuth setup in under 5 minutes.
- **SC-006**: All primary flows work inside WeChat WebView (tested via mobile WeChat on localhost via LAN or ngrok).

---

## Assumptions

- Initial deployment is `localhost:3000` only; no public domain or TLS required for Phase 1.
- A single consultant is sufficient for Phase 1; multi-consultant support is already in the data model.
- Consultants use personal Google accounts (not Google Workspace); individual OAuth consent is used.
- Consultants use personal Zoom accounts; Zoom user-managed OAuth app (development mode) is sufficient — no Zoom Marketplace publication required.
- The booking slot unit is 20 minutes; variable slot durations are Phase 3.
- Google Calendar is read-only in Phase 1; the platform does not write events back to Google Calendar.
- Student authentication (login/account) is not required in Phase 1; students book as guests using their name + email.
- Email delivery uses Resend with a verified sender domain; for local dev, Resend test mode or a personal Gmail SMTP may be used.
- Chinese payment compliance and contract generation are Phase 2 concerns; no payment is required in Phase 1.
- The platform UI language is Simplified Chinese (简体中文).
