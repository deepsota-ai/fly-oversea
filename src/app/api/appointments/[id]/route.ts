import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import type { NextRequest } from "next/server"

import { authOptions } from "@/configs/next-auth"
import { sendCancellation } from "@/lib/email"
import { db } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const appointment = await db.appointment.findUnique({
    where: { id },
    include: { lead: true, consultant: true },
  })

  if (!appointment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (appointment.consultantId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (appointment.status === "cancelled") {
    return NextResponse.json({ error: "Already cancelled" }, { status: 409 })
  }

  await db.appointment.update({
    where: { id },
    data: { status: "cancelled" },
  })

  try {
    await sendCancellation(
      appointment,
      appointment.lead,
      appointment.consultant
    )
  } catch (err) {
    console.error("Cancellation email failed:", err)
  }

  return NextResponse.json({ success: true })
}
