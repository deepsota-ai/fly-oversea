import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import type { NextRequest } from "next/server"

import { authOptions } from "@/configs/next-auth"
import { db } from "@/lib/prisma"

const BookingWindowSchema = z.object({
  days: z
    .array(z.number().int().min(0).max(6))
    .min(1, "At least one day required"),
  startHour: z.number().int().min(0).max(23),
  endHour: z.number().int().min(1).max(24),
})

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = BookingWindowSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { days, startHour, endHour } = parsed.data
  if (startHour >= endHour) {
    return NextResponse.json(
      { error: "startHour must be less than endHour" },
      { status: 400 }
    )
  }

  const updated = await db.consultant.update({
    where: { id: session.user.id },
    data: { bookingWindowJson: JSON.stringify({ days, startHour, endHour }) },
    select: { bookingWindowJson: true },
  })

  return NextResponse.json({ bookingWindowJson: updated.bookingWindowJson })
}
