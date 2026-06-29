import { NextResponse } from "next/server"

import type { BookingWindow } from "@/types/booking"
import type { NextRequest } from "next/server"

import {
  deriveAvailableSlots,
  getFreeBusy,
  refreshGoogleToken,
} from "@/lib/google-calendar"
import { db } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const consultant = await db.consultant.findUnique({ where: { id } })
  if (!consultant || !consultant.googleConnected) {
    return NextResponse.json(
      { error: "Consultant not found or Google Calendar not connected" },
      { status: 404 }
    )
  }

  let fresh = consultant
  try {
    fresh = await refreshGoogleToken(consultant)
  } catch {
    return NextResponse.json(
      { error: "无法刷新 Google 授权，请联系顾问重新连接日历" },
      { status: 503 }
    )
  }

  const now = new Date()
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 3_600_000)

  let busyBlocks: { start: string; end: string }[] = []
  try {
    busyBlocks = await getFreeBusy(fresh, now, twoWeeks)
  } catch {
    return NextResponse.json(
      { error: "此顾问当前无法获取可用时间，请稍后再试或通过微信联系我们" },
      { status: 503 }
    )
  }

  const defaultWindow: BookingWindow = {
    days: [1, 2, 3, 4, 5],
    startHour: 10,
    endHour: 18,
  }
  const bookingWindow: BookingWindow = consultant.bookingWindowJson
    ? (JSON.parse(consultant.bookingWindowJson) as BookingWindow)
    : defaultWindow

  const existingAppointments = await db.appointment.findMany({
    where: {
      consultantId: id,
      status: "confirmed",
      startAt: { gte: now, lte: twoWeeks },
    },
    select: { startAt: true },
  })

  const slots = deriveAvailableSlots(
    busyBlocks,
    bookingWindow,
    existingAppointments.map((a: { startAt: Date }) => a.startAt),
    now,
    twoWeeks
  )

  return NextResponse.json({ consultantId: id, slots })
}
