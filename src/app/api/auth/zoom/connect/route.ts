import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/configs/next-auth"
import { db } from "@/lib/prisma"
import { getZoomAuthUrl } from "@/lib/zoom"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = getZoomAuthUrl(session.user.id)
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
      zoomConnected: false,
      zoomAccessToken: null,
      zoomRefreshToken: null,
      zoomTokenExpiry: null,
      zoomUserId: null,
    },
  })

  return NextResponse.json({ disconnected: true })
}
