"use client"

import { useEffect, useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AppointmentRow {
  id: string
  startAt: string
  durationMin: number
  status: string
  zoomMeetingUrl: string | null
  lead: {
    name: string
    email: string
    wechatId: string
    institution: string
    targetDegree: string
  }
}

function formatCst(iso: string): string {
  return new Date(iso).toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((d) => setAppointments(d.appointments ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function handleCancel() {
    if (!cancelId) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/appointments/${cancelId}`, {
        method: "PATCH",
      })
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === cancelId ? { ...a, status: "cancelled" } : a
          )
        )
      }
    } finally {
      setCancelling(false)
      setCancelId(null)
    }
  }

  if (loading) {
    return (
      <div className="container py-8 text-muted-foreground">
        加载预约列表...
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-bold">预约管理</h1>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            暂无预约记录
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <Card key={appt.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">
                      {appt.lead.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {appt.lead.email} · {appt.lead.wechatId}
                    </p>
                  </div>
                  <Badge
                    variant={
                      appt.status === "confirmed"
                        ? "default"
                        : appt.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {appt.status === "confirmed"
                      ? "已确认"
                      : appt.status === "cancelled"
                        ? "已取消"
                        : appt.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">时间：</span>
                  {formatCst(appt.startAt)}（北京时间）
                </p>
                <p>
                  <span className="text-muted-foreground">学校：</span>
                  {appt.lead.institution}
                </p>
                <p>
                  <span className="text-muted-foreground">目标学位：</span>
                  {appt.lead.targetDegree}
                </p>
                {appt.zoomMeetingUrl && (
                  <p>
                    <span className="text-muted-foreground">会议链接：</span>
                    <a
                      href={appt.zoomMeetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline break-all"
                    >
                      {appt.zoomMeetingUrl}
                    </a>
                  </p>
                )}
                {appt.status === "confirmed" && (
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive hover:bg-destructive/10"
                      onClick={() => setCancelId(appt.id)}
                    >
                      取消预约
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!cancelId}
        onOpenChange={(o) => !o && setCancelId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认取消预约？</AlertDialogTitle>
            <AlertDialogDescription>
              取消后将向学生发送取消通知邮件，此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>返回</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={cancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling ? "取消中..." : "确认取消"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
