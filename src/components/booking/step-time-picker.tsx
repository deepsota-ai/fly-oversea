"use client"

import { useEffect, useState } from "react"

import type { TimeSlot } from "@/types/booking"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

export function StepTimePicker({
  consultantId,
  leadId,
  onSuccess,
}: {
  consultantId: string
  leadId: string
  onSuccess: () => void
}) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [slotConflict, setSlotConflict] = useState(false)

  useEffect(() => {
    fetch(`/api/consultants/${consultantId}/availability`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .catch(() => setError("无法加载可用时间，请稍后重试"))
      .finally(() => setLoading(false))
  }, [consultantId])

  async function confirmBooking() {
    if (!selectedSlot) return
    setConfirming(true)
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          consultantId,
          startAt: new Date(selectedSlot.start).toISOString(),
        }),
      })

      if (res.status === 409) {
        setSlotConflict(true)
        setSelectedSlot(null)
        return
      }

      if (!res.ok) throw new Error()
      onSuccess()
    } catch {
      setError("预约失败，请重试")
    } finally {
      setConfirming(false)
    }
  }

  if (loading)
    return (
      <div className="text-center py-8 text-muted-foreground">
        加载可用时间...
      </div>
    )

  if (error)
    return (
      <div className="text-center py-8 space-y-2">
        <p className="text-muted-foreground">{error}</p>
      </div>
    )

  // Group slots by date
  const byDate: Record<string, TimeSlot[]> = {}
  for (const slot of slots) {
    const dateKey = slot.start.slice(0, 10)
    ;(byDate[dateKey] ??= []).push(slot)
  }
  const dates = Object.keys(byDate).sort()

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>第三步：选择预约时间</CardTitle>
        </CardHeader>
        <CardContent>
          {dates.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              此顾问近期暂无空闲时间，请通过微信联系我们。
            </p>
          ) : (
            <div className="space-y-6">
              {dates.map((date) => (
                <div key={date}>
                  <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                    {new Date(date + "T00:00:00+08:00").toLocaleDateString(
                      "zh-CN",
                      { weekday: "long", month: "long", day: "numeric" }
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {byDate[date].map((slot) => (
                      <Button
                        key={slot.start}
                        variant={
                          selectedSlot?.start === slot.start
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot.start.slice(11, 16)}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              {selectedSlot && (
                <div className="border-t pt-4 space-y-3">
                  <p className="text-sm">
                    已选择：
                    <span className="font-semibold">
                      {formatCst(selectedSlot.start)}
                    </span>
                    （北京时间）
                  </p>
                  <Button
                    onClick={confirmBooking}
                    disabled={confirming}
                    className="w-full"
                  >
                    {confirming ? "确认中..." : "确认预约"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={slotConflict}
        onOpenChange={(o) => !o && setSlotConflict(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>该时间段已被预约</AlertDialogTitle>
            <AlertDialogDescription>请选择其他时间段。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setSlotConflict(false)}>
              好的，重新选择
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
