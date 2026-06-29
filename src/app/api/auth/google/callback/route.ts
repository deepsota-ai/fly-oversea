import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

import { exchangeGoogleCode } from "@/lib/google-calendar"

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
    await exchangeGoogleCode(code, consultantId)
  } catch (err) {
    console.error("Google OAuth exchange failed:", err)
    return NextResponse.redirect(
      new URL(
        "/zh/pages/account/settings?tab=integrations&googleError=true",
        req.nextUrl.origin
      )
    )
  }

  return NextResponse.redirect(
    new URL(
      "/zh/pages/account/settings/integrations?googleConnected=true",
      req.nextUrl.origin
    )
  )
}
