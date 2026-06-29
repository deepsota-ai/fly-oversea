"use client"

import { Suspense, useState } from "react"

import { StepBackgroundForm } from "@/components/booking/step-background-form"
import { StepConsultantSelect } from "@/components/booking/step-consultant-select"
import { StepTimePicker } from "@/components/booking/step-time-picker"

type BookingStep = 1 | 2 | 3

export default function BookPage() {
  const [step, setStep] = useState<BookingStep>(1)
  const [leadId, setLeadId] = useState<string | null>(null)
  const [consultantId, setConsultantId] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="container max-w-2xl py-10">
      {/* Step indicator */}
      <div className="flex gap-4 mb-8 text-sm">
        {["填写信息", "选择顾问", "选择时间"].map((label, i) => (
          <div
            key={i}
            className={`flex items-center gap-1.5 ${step === i + 1 ? "text-primary font-semibold" : "text-muted-foreground"}`}
          >
            <span
              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs border ${step === i + 1 ? "border-primary bg-primary text-primary-foreground" : "border-muted"}`}
            >
              {i + 1}
            </span>
            {label}
          </div>
        ))}
      </div>

      <Suspense fallback={<div className="text-center py-8">加载中...</div>}>
        {confirmed ? (
          <div className="text-center py-12 space-y-3">
            <div className="text-4xl">✓</div>
            <h2 className="text-2xl font-semibold">预约成功！</h2>
            <p className="text-muted-foreground">
              预约确认邮件和Zoom会议链接已发送至您的邮箱，请注意查收。
            </p>
            <p className="text-sm text-muted-foreground">
              如有疑问，请通过微信联系我们。
            </p>
          </div>
        ) : step === 1 ? (
          <StepBackgroundForm
            onNext={(id) => {
              setLeadId(id)
              setStep(2)
            }}
          />
        ) : step === 2 ? (
          <StepConsultantSelect
            onNext={(id) => {
              setConsultantId(id)
              setStep(3)
            }}
          />
        ) : (
          leadId &&
          consultantId && (
            <StepTimePicker
              leadId={leadId}
              consultantId={consultantId}
              onSuccess={() => setConfirmed(true)}
            />
          )
        )}
      </Suspense>
    </div>
  )
}
