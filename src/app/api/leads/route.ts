import { NextResponse } from "next/server"
import { z } from "zod"

import type { NextRequest } from "next/server"

import { sendConsultantNotification } from "@/lib/email"
import { db } from "@/lib/prisma"

const LeadSchema = z.object({
  name: z.string().min(1),
  wechatId: z.string().min(1),
  email: z.string().email(),
  institution: z.string().min(1),
  major: z.string().min(1),
  gpa: z.number().positive(),
  gpaScale: z.number().positive(),
  graduationYear: z.number().int().min(2024),
  targetCountries: z.array(z.string()).min(1),
  targetDegree: z.string().min(1),
  testScores: z.record(z.number()).optional(),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data

  const existing = await db.lead.findFirst({
    where: { email: data.email },
    include: { appointment: true },
  })

  if (existing?.appointment && existing.appointment.status === "confirmed") {
    return NextResponse.json(
      { exists: true, appointmentId: existing.appointment.id },
      { status: 200 }
    )
  }

  const leadData = {
    name: data.name,
    wechatId: data.wechatId,
    email: data.email,
    institution: data.institution,
    major: data.major,
    gpa: data.gpa,
    gpaScale: data.gpaScale,
    graduationYear: data.graduationYear,
    targetCountries: JSON.stringify(data.targetCountries),
    targetDegree: data.targetDegree,
    testScores: data.testScores ? JSON.stringify(data.testScores) : null,
    notes: data.notes ?? null,
  }

  let leadId: string

  if (existing) {
    const updated = await db.lead.update({
      where: { id: existing.id },
      data: leadData,
    })
    leadId = updated.id
  } else {
    const created = await db.lead.create({ data: leadData })
    leadId = created.id
  }

  // Notify consultant asynchronously (fire-and-forget)
  const consultant = await db.consultant.findFirst()
  if (consultant) {
    sendConsultantNotification(data.name, data.email, consultant.email).catch(
      console.error
    )
  }

  return NextResponse.json(
    { leadId, exists: !!existing },
    { status: existing ? 200 : 201 }
  )
}
