import { Link } from 'react-router-dom'
import type { Scholarship, ScholarshipApplication } from '../../types'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { ProviderBadge } from './ProviderBadge'
import { formatCurrency, formatDate, getScholarshipUiState } from '../../lib/applicationState'
import { ArrowRightIcon } from '../ui/icons'

const cardCtaCopy: Record<ReturnType<typeof getScholarshipUiState>, string> = {
  CLOSED_NO_APP: 'Applications Closed',
  NOT_STARTED: 'View Scholarship',
  DRAFT: 'Continue Application',
  SUBMITTED: 'Application Submitted',
  SELECTED: 'Winner Announced',
  NOT_SELECTED: 'View Application',
}

interface ScholarshipCardProps {
  scholarship: Scholarship
  application: ScholarshipApplication | null
}

export function ScholarshipCard({ scholarship, application }: ScholarshipCardProps) {
  const state = getScholarshipUiState(scholarship, application)

  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <ProviderBadge provider={scholarship.provider} />
        {state === 'DRAFT' && <Badge tone="warn">Draft saved</Badge>}
        {state === 'SUBMITTED' && <Badge tone="success">Submitted</Badge>}
        {state === 'SELECTED' && <Badge tone="brand">Selected</Badge>}
        {state === 'NOT_SELECTED' && <Badge tone="neutral">Not selected</Badge>}
        {state === 'CLOSED_NO_APP' && <Badge tone="neutral">Closed</Badge>}
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-lg font-bold text-ink-900">{scholarship.title}</h3>
            <p className="mt-1 max-w-2xl text-[15px] text-ink-500">{scholarship.tagline}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-row items-center gap-6 lg:flex-col lg:items-end lg:gap-3">
          <div className="flex gap-6 lg:justify-end">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-ink-300">Award</div>
              <div className="font-semibold text-ink-900">{formatCurrency(scholarship.award.amount, scholarship.award.currency)}</div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-ink-300">Deadline</div>
              <div className="font-semibold text-ink-900">{formatDate(scholarship.applicationDeadline)}</div>
            </div>
          </div>
          <Link
            to={`/scholarships/${scholarship.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-line px-5 py-2.5 text-[15px] font-semibold text-ink-900 hover:border-brand-400 hover:text-brand-600 lg:w-auto"
          >
            {cardCtaCopy[state]}
            <ArrowRightIcon width={16} height={16} />
          </Link>
        </div>
      </div>
    </Card>
  )
}
