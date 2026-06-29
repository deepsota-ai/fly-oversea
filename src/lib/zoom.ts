import type { ConsultantRecord } from "@/lib/db-types"

import { db } from "@/lib/prisma"

const ZOOM_TOKEN_URL = "https://zoom.us/oauth/token"
const ZOOM_API_BASE = "https://api.zoom.us/v2"

export function getZoomAuthUrl(consultantId: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.ZOOM_CLIENT_ID ?? "",
    redirect_uri: process.env.ZOOM_REDIRECT_URI ?? "",
    state: consultantId,
  })
  return `https://zoom.us/oauth/authorize?${params}`
}

export async function exchangeZoomCode(
  code: string,
  consultantId: string
): Promise<void> {
  const credentials = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString("base64")

  const res = await fetch(
    `${ZOOM_TOKEN_URL}?grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(process.env.ZOOM_REDIRECT_URI ?? "")}`,
    {
      method: "POST",
      headers: { Authorization: `Basic ${credentials}` },
    }
  )

  if (!res.ok) throw new Error(`Zoom token exchange failed: ${res.status}`)
  const data = await res.json()

  const expiry = new Date(Date.now() + data.expires_in * 1000)

  await db.consultant.update({
    where: { id: consultantId },
    data: {
      zoomConnected: true,
      zoomAccessToken: data.access_token,
      zoomRefreshToken: data.refresh_token ?? null,
      zoomTokenExpiry: expiry,
      zoomUserId: "me",
    },
  })
}

export async function refreshZoomToken(
  consultant: ConsultantRecord
): Promise<ConsultantRecord> {
  if (!consultant.zoomRefreshToken) {
    throw new Error("No Zoom refresh token stored")
  }

  const now = Date.now()
  const expiry = consultant.zoomTokenExpiry?.getTime() ?? 0
  if (expiry > now + 60_000) return consultant

  const credentials = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString("base64")

  const res = await fetch(
    `${ZOOM_TOKEN_URL}?grant_type=refresh_token&refresh_token=${encodeURIComponent(consultant.zoomRefreshToken)}`,
    { method: "POST", headers: { Authorization: `Basic ${credentials}` } }
  )

  if (!res.ok) throw new Error(`Zoom token refresh failed: ${res.status}`)
  const data = await res.json()

  return db.consultant.update({
    where: { id: consultant.id },
    data: {
      zoomAccessToken: data.access_token,
      zoomRefreshToken: data.refresh_token ?? consultant.zoomRefreshToken,
      zoomTokenExpiry: new Date(Date.now() + data.expires_in * 1000),
    },
  }) as Promise<ConsultantRecord>
}

export async function createZoomMeeting(
  consultant: ConsultantRecord,
  startAt: Date,
  durationMin: number
): Promise<{ id: string; joinUrl: string }> {
  const fresh = await refreshZoomToken(consultant)
  const userId = fresh.zoomUserId ?? "me"

  const res = await fetch(`${ZOOM_API_BASE}/users/${userId}/meetings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${fresh.zoomAccessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic: "留学咨询预约",
      type: 2,
      start_time: startAt.toISOString(),
      duration: durationMin,
      timezone: "Asia/Shanghai",
      settings: {
        waiting_room: true,
        join_before_host: false,
        mute_upon_entry: true,
      },
    }),
  })

  if (!res.ok) throw new Error(`Zoom create meeting failed: ${res.status}`)
  const data = await res.json()
  return { id: String(data.id), joinUrl: data.join_url }
}
