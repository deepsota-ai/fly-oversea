/** Structural types matching Prisma models — avoids @prisma/client type resolution issues with pnpm */

export interface ConsultantRecord {
  id: string
  email: string
  name: string
  passwordHash: string
  bio: string | null
  photoUrl: string | null
  specialisations: string
  googleConnected: boolean
  googleAccessToken: string | null
  googleRefreshToken: string | null
  googleTokenExpiry: Date | null
  zoomConnected: boolean
  zoomAccessToken: string | null
  zoomRefreshToken: string | null
  zoomTokenExpiry: Date | null
  zoomUserId: string | null
  bookingWindowJson: string | null
  createdAt: Date
  updatedAt: Date
}

export interface LeadRecord {
  id: string
  name: string
  wechatId: string
  email: string
  institution: string
  major: string
  gpa: number
  gpaScale: number
  graduationYear: number
  targetCountries: string
  targetDegree: string
  testScores: string | null
  notes: string | null
  createdAt: Date
}

export interface AppointmentRecord {
  id: string
  leadId: string
  consultantId: string
  startAt: Date
  durationMin: number
  zoomMeetingUrl: string | null
  zoomMeetingId: string | null
  confirmEmailSent: boolean
  reminderSent: boolean
  status: string
  createdAt: Date
}
