import { google } from "googleapis"

import type { ConsultantRecord } from "@/lib/db-types"
import type { BookingWindow, TimeSlot } from "@/types/booking"

import { db } from "@/lib/prisma"

const SCOPES = ["https://www.googleapis.com/auth/calendar.freebusy"]
const SLOT_DURATION_MIN = 20

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL + "/api/auth/google/callback"
  )
}

export function getGoogleAuthUrl(consultantId: string): string {
  const client = getOAuthClient()
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state: consultantId,
  })
}

export async function exchangeGoogleCode(
  code: string,
  consultantId: string
): Promise<void> {
  const client = getOAuthClient()
  const { tokens } = await client.getToken(code)

  await db.consultant.update({
    where: { id: consultantId },
    data: {
      googleConnected: true,
      googleAccessToken: tokens.access_token ?? null,
      googleRefreshToken: tokens.refresh_token ?? null,
      googleTokenExpiry: tokens.expiry_date
        ? new Date(tokens.expiry_date)
        : null,
    },
  })
}

export async function refreshGoogleToken(
  consultant: ConsultantRecord
): Promise<ConsultantRecord> {
  if (!consultant.googleRefreshToken) {
    throw new Error("No Google refresh token stored")
  }

  const now = Date.now()
  const expiry = consultant.googleTokenExpiry?.getTime() ?? 0
  if (expiry > now + 60_000) return consultant

  const client = getOAuthClient()
  client.setCredentials({ refresh_token: consultant.googleRefreshToken })
  const { credentials } = await client.refreshAccessToken()

  return db.consultant.update({
    where: { id: consultant.id },
    data: {
      googleAccessToken: credentials.access_token ?? null,
      googleTokenExpiry: credentials.expiry_date
        ? new Date(credentials.expiry_date)
        : null,
    },
  }) as Promise<ConsultantRecord>
}

export async function getFreeBusy(
  consultant: ConsultantRecord,
  timeMin: Date,
  timeMax: Date
): Promise<{ start: string; end: string }[]> {
  const client = getOAuthClient()
  client.setCredentials({
    access_token: consultant.googleAccessToken,
    refresh_token: consultant.googleRefreshToken ?? undefined,
  })

  const cal = google.calendar({ version: "v3", auth: client })
  const res = await cal.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id: "primary" }],
    },
  })

  const busy = res.data.calendars?.["primary"]?.busy ?? []
  return busy
    .filter((b) => b.start && b.end)
    .map((b) => ({ start: b.start!, end: b.end! }))
}

export function deriveAvailableSlots(
  busyBlocks: { start: string; end: string }[],
  bookingWindow: BookingWindow,
  existingStartTimes: Date[],
  fromDate: Date,
  toDate: Date,
  tzOffsetHours = 8
): TimeSlot[] {
  const slots: TimeSlot[] = []
  const existingMs = new Set(existingStartTimes.map((d) => d.getTime()))

  const cursor = new Date(fromDate)
  cursor.setUTCSeconds(0, 0)
  cursor.setUTCMinutes(0)

  while (cursor < toDate) {
    const localHour = (cursor.getUTCHours() + tzOffsetHours) % 24
    const localDayOfWeek = new Date(
      cursor.getTime() + tzOffsetHours * 3_600_000
    ).getUTCDay()

    if (
      bookingWindow.days.includes(localDayOfWeek) &&
      localHour >= bookingWindow.startHour &&
      localHour < bookingWindow.endHour
    ) {
      const slotEnd = new Date(cursor.getTime() + SLOT_DURATION_MIN * 60_000)
      const overlaps = busyBlocks.some((b) => {
        const bs = new Date(b.start).getTime()
        const be = new Date(b.end).getTime()
        return cursor.getTime() < be && slotEnd.getTime() > bs
      })

      if (!overlaps && !existingMs.has(cursor.getTime())) {
        const startCst = new Date(cursor.getTime() + tzOffsetHours * 3_600_000)
        const endCst = new Date(slotEnd.getTime() + tzOffsetHours * 3_600_000)
        slots.push({
          start: startCst.toISOString().replace("Z", "+08:00"),
          end: endCst.toISOString().replace("Z", "+08:00"),
        })
      }
    }

    cursor.setUTCMinutes(cursor.getUTCMinutes() + SLOT_DURATION_MIN)
  }

  return slots
}
