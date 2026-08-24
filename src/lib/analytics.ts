type AnalyticsEvent =
  | 'scholarships_home_banner_viewed'
  | 'scholarships_home_banner_clicked'
  | 'scholarships_page_viewed'
  | 'scholarship_viewed'
  | 'scholarship_apply_clicked'
  | 'scholarship_application_started'
  | 'scholarship_application_draft_saved'
  | 'scholarship_application_reviewed'
  | 'scholarship_application_submitted'
  | 'scholarship_application_selected'
  | 'scholarship_application_not_selected'
  | 'jobs_cross_sell_viewed'
  | 'jobs_cross_sell_clicked'

interface AnalyticsProperties {
  scholarshipId?: string
  providerId?: string
  providerType?: string
  studentId?: string
  completionPercentage?: number
  [key: string]: unknown
}

export function track(event: AnalyticsEvent, properties: AnalyticsProperties = {}) {
  // eslint-disable-next-line no-console
  console.info('[analytics]', event, { ...properties, timestamp: new Date().toISOString() })
}
