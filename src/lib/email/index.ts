import { Resend } from "resend"

import type {
  AppointmentRecord,
  ConsultantRecord,
  LeadRecord,
} from "@/lib/db-types"

import { CancellationEmail } from "./templates/cancellation"
import { ConfirmationEmail } from "./templates/confirmation"
import { ReminderEmail } from "./templates/reminder"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"
const TZ_OFFSET = 8 * 3_600_000

function formatCst(date: Date): string {
  return new Date(date.getTime() + TZ_OFFSET)
    .toISOString()
    .replace("T", " ")
    .slice(0, 16)
}

export async function sendConfirmation(
  appointment: AppointmentRecord,
  lead: LeadRecord,
  consultant: ConsultantRecord,
  zoomUrl: string | null
) {
  const startAtCst = formatCst(appointment.startAt)

  await Promise.all([
    resend.emails.send({
      from: FROM,
      to: lead.email,
      subject: `预约确认：${startAtCst} 留学咨询`,
      react: ConfirmationEmail({
        studentName: lead.name,
        consultantName: consultant.name,
        startAtCst,
        durationMin: appointment.durationMin,
        zoomUrl,
      }),
    }),
    resend.emails.send({
      from: FROM,
      to: consultant.email,
      subject: `新预约：${lead.name} - ${startAtCst}`,
      react: ConfirmationEmail({
        studentName: lead.name,
        consultantName: consultant.name,
        startAtCst,
        durationMin: appointment.durationMin,
        zoomUrl,
      }),
    }),
  ])
}

export async function sendReminder(
  appointment: AppointmentRecord,
  lead: LeadRecord,
  consultant: ConsultantRecord
) {
  const startAtCst = formatCst(appointment.startAt)

  await resend.emails.send({
    from: FROM,
    to: lead.email,
    subject: `提醒：明日 ${startAtCst} 留学咨询`,
    react: ReminderEmail({
      studentName: lead.name,
      consultantName: consultant.name,
      startAtCst,
      zoomUrl: appointment.zoomMeetingUrl,
    }),
  })
}

export async function sendCancellation(
  appointment: AppointmentRecord,
  lead: LeadRecord,
  consultant: ConsultantRecord
) {
  const startAtCst = formatCst(appointment.startAt)

  await resend.emails.send({
    from: FROM,
    to: lead.email,
    subject: "您的留学咨询预约已取消",
    react: CancellationEmail({
      studentName: lead.name,
      consultantName: consultant.name,
      startAtCst,
    }),
  })
}

export async function sendConsultantNotification(
  studentName: string,
  studentEmail: string,
  consultantEmail: string
) {
  await resend.emails.send({
    from: FROM,
    to: consultantEmail,
    subject: `新留学咨询申请：${studentName}`,
    html: `<p>您收到了一条新的留学咨询申请。</p><p>学生：${studentName} (${studentEmail})</p><p>请登录平台查看详情并安排预约。</p>`,
  })
}
