import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import type { Metadata } from "next"

import { authOptions } from "@/configs/next-auth"
import { db } from "@/lib/prisma"

import { IntegrationsTab } from "../_components/integrations-tab"

export const metadata: Metadata = {
  title: "Integrations",
}

export default async function IntegrationsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/sign-in")

  const consultant = await db.consultant.findUnique({
    where: { id: session.user.id },
    select: {
      googleConnected: true,
      zoomConnected: true,
      bookingWindowJson: true,
    },
  })

  if (!consultant) redirect("/sign-in")

  return (
    <IntegrationsTab
      initialStatus={{
        googleConnected: consultant.googleConnected,
        zoomConnected: consultant.zoomConnected,
        bookingWindowJson: consultant.bookingWindowJson,
      }}
    />
  )
}
