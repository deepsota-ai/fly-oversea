export interface ConsultantPublic {
  id: string
  name: string
  bio: string | null
  specialisations: string[]
  photoUrl: string | null
}

export interface LeadInput {
  name: string
  wechatId: string
  email: string
  institution: string
  major: string
  gpa: number
  gpaScale: number
  graduationYear: number
  targetCountries: string[]
  targetDegree: string
  testScores?: Record<string, number>
  notes?: string
}

export interface TimeSlot {
  start: string
  end: string
}

export interface AppointmentResult {
  appointmentId: string
  startAt: string
  consultantName: string
  zoomMeetingUrl: string | null
  emailSent: boolean
}

export interface BookingWindow {
  days: number[]
  startHour: number
  endHour: number
}
