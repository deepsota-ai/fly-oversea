import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/configs/next-auth"
import { getGoogleAuthUrl } from "@/lib/google-calendar"
import { db } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = getGoogleAuthUrl(session.user.id)
  return NextResponse.redirect(url)
}

export async function DELETE() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await db.consultant.update({
    where: { id: session.user.id },
    data: {
      googleConnected: false,
      googleAccessToken: null,
      googleRefreshToken: null,
      googleTokenExpiry: null,
    },
  })

  return NextResponse.json({ disconnected: true })
}
