import type { Scholarship, ScholarshipApplication } from '../types'

export type ScholarshipUiState = 'CLOSED_NO_APP' | 'NOT_STARTED' | 'DRAFT' | 'SUBMITTED' | 'SELECTED' | 'NOT_SELECTED'

export function getScholarshipUiState(
  scholarship: Scholarship,
  application: ScholarshipApplication | null,
): ScholarshipUiState {
  if (application?.status === 'SELECTED') return 'SELECTED'
  if (application?.status === 'NOT_SELECTED') return 'NOT_SELECTED'
  if (application && ['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED'].includes(application.status)) return 'SUBMITTED'
  if (application?.status === 'DRAFT') return 'DRAFT'
  if (scholarship.status === 'CLOSED') return 'CLOSED_NO_APP'
  return 'NOT_STARTED'
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
