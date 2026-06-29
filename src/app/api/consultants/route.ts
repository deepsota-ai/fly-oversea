import { NextResponse } from "next/server"

import { db } from "@/lib/prisma"

export async function GET() {
  const consultants = await db.consultant.findMany({
    where: { googleConnected: true },
    select: {
      id: true,
      name: true,
      bio: true,
      specialisations: true,
      photoUrl: true,
    },
  })

  return NextResponse.json(
    consultants.map((c) => ({
      id: c.id,
      name: c.name,
      bio: c.bio,
      specialisations: JSON.parse(c.specialisations) as string[],
      photoUrl: c.photoUrl,
    }))
  )
}
