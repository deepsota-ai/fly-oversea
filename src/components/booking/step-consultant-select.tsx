"use client"

import { useEffect, useState } from "react"

import type { ConsultantPublic } from "@/types/booking"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StepConsultantSelect({
  onNext,
}: {
  onNext: (consultantId: string) => void
}) {
  const [consultants, setConsultants] = useState<ConsultantPublic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/consultants")
      .then((r) => r.json())
      .then(setConsultants)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return (
      <div className="text-center py-8 text-muted-foreground">
        加载顾问信息...
      </div>
    )

  if (error || consultants.length === 0)
    return (
      <div className="text-center py-8 space-y-2">
        <p className="text-muted-foreground">
          暂无可用顾问，请通过微信联系我们。
        </p>
      </div>
    )

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">第二步：选择顾问</h2>
      {consultants.map((c) => (
        <Card key={c.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center border flex-shrink-0">
                <span className="font-bold text-lg text-muted-foreground">
                  {c.name[0]}
                </span>
              </div>
              <span>{c.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {c.bio && <p className="text-sm text-muted-foreground">{c.bio}</p>}
            <div className="flex flex-wrap gap-1.5">
              {c.specialisations.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button onClick={() => onNext(c.id)} className="w-full">
              查看可用时间
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
