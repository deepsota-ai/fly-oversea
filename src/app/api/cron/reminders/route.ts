import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

import { sendReminder } from "@/lib/email"
import { db } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()
  const windowStart = new Date(now.getTime() + 23 * 3_600_000)
  const windowEnd = new Date(now.getTime() + 25 * 3_600_000)

  const appointments = await db.appointment.findMany({
    where: {
      status: "confirmed",
      reminderSent: false,
      startAt: { gte: windowStart, lte: windowEnd },
    },
    include: { lead: true, consultant: true },
  })

  let sent = 0
  let failed = 0

  for (const appt of appointments) {
    try {
      await sendReminder(appt, appt.lead, appt.consultant)
      await db.appointment.update({
        where: { id: appt.id },
        data: { reminderSent: true },
      })
      sent++
    } catch {
      failed++
    }
  }

  return NextResponse.json({ sent, failed })
}
