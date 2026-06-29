import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

import { exchangeZoomCode } from "@/lib/zoom"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code = searchParams.get("code")
  const consultantId = searchParams.get("state")

  if (!code || !consultantId) {
    return NextResponse.json(
      { error: "Missing code or state" },
      { status: 400 }
    )
  }

  try {
    await exchangeZoomCode(code, consultantId)
  } catch (err) {
    console.error("Zoom OAuth exchange failed:", err)
    return NextResponse.redirect(
      new URL(
        "/zh/pages/account/settings/integrations?zoomError=true",
        req.nextUrl.origin
      )
    )
  }

  return NextResponse.redirect(
    new URL(
      "/zh/pages/account/settings/integrations?zoomConnected=true",
      req.nextUrl.origin
    )
  )
}
