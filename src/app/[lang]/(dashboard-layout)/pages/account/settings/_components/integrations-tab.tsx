"use client"

import { useState } from "react"

import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface IntegrationStatus {
  googleConnected: boolean
  zoomConnected: boolean
  bookingWindowJson: string | null
}

const DAY_LABELS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6)

export function IntegrationsTab({
  initialStatus,
}: {
  initialStatus: IntegrationStatus
}) {
  const [status, setStatus] = useState(initialStatus)
  const [savingWindow, setSavingWindow] = useState(false)

  const defaultWindow = status.bookingWindowJson
    ? JSON.parse(status.bookingWindowJson)
    : { days: [1, 2, 3, 4, 5], startHour: 10, endHour: 18 }

  const [selectedDays, setSelectedDays] = useState<number[]>(defaultWindow.days)
  const [startHour, setStartHour] = useState<number>(defaultWindow.startHour)
  const [endHour, setEndHour] = useState<number>(defaultWindow.endHour)

  function toggleDay(day: number) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    )
  }

  async function disconnectGoogle() {
    await fetch("/api/auth/google/connect", { method: "DELETE" })
    setStatus((s) => ({ ...s, googleConnected: false }))
    toast({ title: "已断开 Google 日历连接" })
  }

  async function disconnectZoom() {
    await fetch("/api/auth/zoom/connect", { method: "DELETE" })
    setStatus((s) => ({ ...s, zoomConnected: false }))
    toast({ title: "已断开 Zoom 连接" })
  }

  async function saveBookingWindow() {
    if (selectedDays.length === 0) {
      toast({ title: "请至少选择一天", variant: "destructive" })
      return
    }
    if (startHour >= endHour) {
      toast({ title: "开始时间必须早于结束时间", variant: "destructive" })
      return
    }
    setSavingWindow(true)
    try {
      const res = await fetch("/api/consultants/me/booking-window", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: selectedDays, startHour, endHour }),
      })
      if (!res.ok) throw new Error()
      toast({ title: "预约时间段已保存" })
    } catch {
      toast({ title: "保存失败，请重试", variant: "destructive" })
    } finally {
      setSavingWindow(false)
    }
  }

  return (
    <div className="grid gap-6">
      {/* Google Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Google 日历</span>
            <Badge variant={status.googleConnected ? "default" : "secondary"}>
              {status.googleConnected ? "已连接" : "未连接"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          {status.googleConnected ? (
            <Button variant="destructive" size="sm" onClick={disconnectGoogle}>
              断开连接
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                window.location.href = "/api/auth/google/connect"
              }}
            >
              连接 Google 日历
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Zoom */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Zoom 会议</span>
            <Badge variant={status.zoomConnected ? "default" : "secondary"}>
              {status.zoomConnected ? "已连接" : "未连接"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          {status.zoomConnected ? (
            <Button variant="destructive" size="sm" onClick={disconnectZoom}>
              断开连接
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                window.location.href = "/api/auth/zoom/connect"
              }}
            >
              连接 Zoom
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Booking Window */}
      <Card>
        <CardHeader>
          <CardTitle>预约时间段设置</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label>可预约的工作日</Label>
            <div className="flex flex-wrap gap-3">
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Checkbox
                    id={`day-${i}`}
                    checked={selectedDays.includes(i)}
                    onCheckedChange={() => toggleDay(i)}
                  />
                  <Label htmlFor={`day-${i}`} className="cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="grid gap-1.5">
              <Label>开始时间</Label>
              <Select
                value={String(startHour)}
                onValueChange={(v) => setStartHour(Number(v))}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOURS.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {String(h).padStart(2, "0")}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="mt-5 text-muted-foreground">至</span>
            <div className="grid gap-1.5">
              <Label>结束时间</Label>
              <Select
                value={String(endHour)}
                onValueChange={(v) => setEndHour(Number(v))}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOURS.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {String(h).padStart(2, "0")}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={saveBookingWindow} disabled={savingWindow}>
            {savingWindow ? "保存中..." : "保存时间段"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
