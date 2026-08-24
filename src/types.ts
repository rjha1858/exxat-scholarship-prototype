export type ProviderType = 'EXXAT' | 'SITE' | 'SCHOOL'

export interface ScholarshipProvider {
  id: string
  name: string
  type: ProviderType
  logo?: string
}

export type ScholarshipStatus = 'OPEN' | 'CLOSED' | 'UPCOMING'

export interface EligibilityItem {
  id: string
  label: string
}

export interface ImportantDate {
  id: string
  label: string
  date: string // ISO date
}

export type ApplicationFieldType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'EMAIL'
  | 'PHONE'
  | 'DATE'
  | 'SINGLE_SELECT'
  | 'MULTI_SELECT'
  | 'NUMBER'
  | 'FILE_UPLOAD'
  | 'VIDEO'
  | 'CHECKBOX'

export type PrefillSource = 'STUDENT_PROFILE' | 'APPLICATION'

export interface ApplicationFieldOption {
  value: string
  label: string
}

export interface ApplicationField {
  id: string
  key: string
  label: string
  description?: string
  type: ApplicationFieldType
  required: boolean
  order: number
  prefillSource?: PrefillSource
  editableWhenPrefilled?: boolean
  options?: ApplicationFieldOption[]
  placeholder?: string
  helpText?: string
  maxLength?: number
  maxWords?: number
  minValue?: number
  accept?: string
  maxSizeBytes?: number
  richText?: boolean
}

export interface ApplicationSection {
  id: string
  title: string
  description?: string
  fields: ApplicationField[]
}

export interface ApplicationForm {
  id: string
  scholarshipId: string
  sections: ApplicationSection[]
}

export interface Scholarship {
  id: string
  title: string
  provider: ScholarshipProvider
  providerType: ProviderType
  tagline: string
  description: string
  award: {
    amount: number
    currency: string
    numberOfAwards?: number
    note?: string
  }
  eligibility: EligibilityItem[]
  applicationOpenAt: string
  applicationDeadline: string
  winnerAnnouncementAt: string
  status: ScholarshipStatus
  guidelines: string[]
  recommenderGuidelines?: string[]
  applicationForm: ApplicationForm
}

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'SELECTED'
  | 'NOT_SELECTED'
  | 'WITHDRAWN'

export interface FileResponseValue {
  fileId: string
  fileName: string
  fileType: string
  fileUrl: string
  fileSize: number
}

export interface VideoFieldValue {
  mode: 'file' | 'link'
  file?: FileResponseValue
  url?: string
}

export interface ApplicationResponse {
  fieldId: string
  value: string | string[] | number | boolean | FileResponseValue | VideoFieldValue | null
}

export interface ScholarshipApplication {
  id: string
  scholarshipId: string
  studentId: string
  status: ApplicationStatus
  responses: ApplicationResponse[]
  submittedAt?: string
  createdAt: string
  updatedAt: string
}

export interface StudentProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  school: string
  program: string
  discipline: string
  graduationDate: string
  location?: string
  profileCompletionPercent: number
}

export interface ScholarshipPromotion {
  id: string
  title: string
  description: string
  ctaLabel: string
  targetType: 'SCHOLARSHIP_LIST' | 'SCHOLARSHIP_DETAIL'
  targetId?: string
  active: boolean
  startAt?: string
  endAt?: string
}
