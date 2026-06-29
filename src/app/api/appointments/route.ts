import { NextResponse } from "next/server"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { getServerSession } from "next-auth"
import { z } from "zod"

import type { NextRequest } from "next/server"

import { authOptions } from "@/configs/next-auth"
import { sendConfirmation } from "@/lib/email"
import { db } from "@/lib/prisma"
import { createZoomMeeting } from "@/lib/zoom"

const AppointmentSchema = z.object({
  leadId: z.string().cuid(),
  consultantId: z.string().cuid(),
  startAt: z.string().datetime(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const appointments = await db.appointment.findMany({
    where: { consultantId: session.user.id },
    include: {
      lead: {
        select: {
          name: true,
          email: true,
          wechatId: true,
          institution: true,
          targetDegree: true,
        },
      },
    },
    orderBy: { startAt: "asc" },
  })

  return NextResponse.json({ appointments })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = AppointmentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { leadId, consultantId, startAt } = parsed.data
  const startDate = new Date(startAt)

  const [lead, consultant] = await Promise.all([
    db.lead.findUnique({ where: { id: leadId } }),
    db.consultant.findUnique({ where: { id: consultantId } }),
  ])

  if (!lead)
    return NextResponse.json({ error: "Lead not found" }, { status: 404 })
  if (!consultant)
    return NextResponse.json({ error: "Consultant not found" }, { status: 404 })

  let appointment
  try {
    appointment = await db.$transaction(async (tx) => {
      return tx.appointment.create({
        data: {
          leadId,
          consultantId,
          startAt: startDate,
          durationMin: 20,
        },
      })
    })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 409 }
      )
    }
    throw err
  }

  // Create Zoom meeting (non-blocking — booking is confirmed regardless)
  let zoomMeetingUrl: string | null = null
  let zoomMeetingId: string | null = null

  if (consultant.zoomConnected) {
    try {
      const meeting = await createZoomMeeting(consultant, startDate, 20)
      zoomMeetingUrl = meeting.joinUrl
      zoomMeetingId = meeting.id
      await db.appointment.update({
        where: { id: appointment.id },
        data: { zoomMeetingUrl, zoomMeetingId },
      })
    } catch (err) {
      console.error("Zoom meeting creation failed:", err)
    }
  }

  // Send confirmation emails
  let emailSent = false
  try {
    await sendConfirmation(appointment, lead, consultant, zoomMeetingUrl)
    await db.appointment.update({
      where: { id: appointment.id },
      data: { confirmEmailSent: true },
    })
    emailSent = true
  } catch (err) {
    console.error("Confirmation email failed:", err)
  }

  return NextResponse.json(
    {
      appointmentId: appointment.id,
      startAt: appointment.startAt.toISOString(),
      consultantName: consultant.name,
      zoomMeetingUrl,
      emailSent,
    },
    { status: 201 }
  )
}
