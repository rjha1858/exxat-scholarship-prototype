import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { scholarshipRepository } from '../repositories/scholarshipRepository'
import { applicationRepository } from '../repositories/applicationRepository'
import { useApplication } from '../hooks/useApplication'
import { currentStudent } from '../data/studentProfile'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { ProfileCompletionNudge } from '../components/scholarships/ProfileCompletionNudge'
import { formatCurrency, formatDate, getScholarshipUiState } from '../lib/applicationState'
import { track } from '../lib/analytics'
import { CheckIcon } from '../components/ui/icons'
import { ProviderBadge } from '../components/scholarships/ProviderBadge'

const detailCtaCopy = {
  CLOSED_NO_APP: 'Applications Closed',
  NOT_STARTED: 'Apply Now',
  DRAFT: 'Continue Application',
  SUBMITTED: 'View Application Status',
  SELECTED: 'View Application Status',
  NOT_SELECTED: 'View Application Status',
} as const

export function ScholarshipDetailPage() {
  const { scholarshipId } = useParams()
  const navigate = useNavigate()
  const { data: scholarship, loading } = useAsync(
    () => scholarshipRepository.getById(scholarshipId ?? ''),
    [scholarshipId],
  )
  const { application, reload } = useApplication(scholarshipId)

  useEffect(() => {
    if (scholarship) track('scholarship_viewed', { scholarshipId: scholarship.id, providerId: scholarship.provider.id })
  }, [scholarship])

  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-white" />
  if (!scholarship) {
    return (
      <div className="rounded-2xl border border-line bg-white p-10 text-center">
        <p className="font-semibold text-ink-900">We couldn't find this scholarship.</p>
        <Link to="/scholarships" className="mt-3 inline-block text-sm font-semibold text-brand-500">
          Back to Scholarships
        </Link>
      </div>
    )
  }

  const state = getScholarshipUiState(scholarship, application)

  const handleCta = () => {
    if (state === 'CLOSED_NO_APP') return
    if (state === 'NOT_STARTED') track('scholarship_apply_clicked', { scholarshipId: scholarship.id })
    navigate(`/scholarships/${scholarship.id}/apply`)
  }

  const simulateOutcome = async (status: 'SELECTED' | 'NOT_SELECTED') => {
    await applicationRepository.setOutcome(scholarship.id, currentStudent.id, status)
    track(status === 'SELECTED' ? 'scholarship_application_selected' : 'scholarship_application_not_selected', {
      scholarshipId: scholarship.id,
    })
    reload()
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/scholarships" className="text-sm font-semibold text-ink-500 hover:text-ink-900">
        &larr; Back to Scholarships
      </Link>

      <ProfileCompletionNudge />

      <Card className="p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <ProviderBadge provider={scholarship.provider} size="md" />
            <h1 className="mt-3 text-3xl font-extrabold text-ink-900">{scholarship.title}</h1>
            <p className="mt-2 max-w-2xl text-[15px] text-ink-500">{scholarship.tagline}</p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <Badge tone={state === 'CLOSED_NO_APP' ? 'neutral' : 'success'}>
              {state === 'CLOSED_NO_APP' ? 'Applications closed' : 'Applications open'}
            </Badge>
            <div className="text-right">
              <div className="text-xs font-medium uppercase tracking-wide text-ink-300">Award</div>
              <div className="text-xl font-bold text-ink-900">{formatCurrency(scholarship.award.amount, scholarship.award.currency)}</div>
            </div>
          </div>
        </div>

        {state === 'SUBMITTED' && (
          <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50 p-5">
            <p className="font-bold text-ink-900">Thank you for applying!</p>
            <p className="mt-1 text-[15px] text-ink-700">
              Your application was submitted on {application?.submittedAt ? formatDate(application.submittedAt) : '—'} and is
              currently under review. We'll email you once winners are announced on {formatDate(scholarship.winnerAnnouncementAt)}.
            </p>
          </div>
        )}
        {state === 'SELECTED' && (
          <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50 p-5">
            <p className="font-bold text-ink-900">Congratulations!</p>
            <p className="mt-1 text-[15px] text-ink-700">
              You have been selected for the {scholarship.title}. Our team will follow up by email with next steps.
            </p>
          </div>
        )}
        {state === 'NOT_SELECTED' && (
          <div className="mt-6 rounded-xl border border-line bg-surface p-5">
            <p className="font-bold text-ink-900">Thank you for applying.</p>
            <p className="mt-1 text-[15px] text-ink-700">You were not selected for this scholarship this cycle.</p>
          </div>
        )}

        <div className="mt-6">
          <Button onClick={handleCta} disabled={state === 'CLOSED_NO_APP'}>
            {detailCtaCopy[state]}
          </Button>
        </div>
      </Card>

      <Card className="p-8">
        <h2 className="text-lg font-bold text-ink-900">About this scholarship</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{scholarship.description}</p>
      </Card>

      <Card className="p-8">
        <h2 className="text-lg font-bold text-ink-900">Eligibility</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {scholarship.eligibility.map((item) => (
            <li key={item.id} className="flex items-start gap-2 text-[15px] text-ink-700">
              <CheckIcon width={16} height={16} className="mt-0.5 shrink-0 text-success-700" />
              {item.label}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-8">
        <h2 className="text-lg font-bold text-ink-900">Award</h2>
        <p className="mt-2 text-[15px] text-ink-700">
          {formatCurrency(scholarship.award.amount, scholarship.award.currency)} per recipient.{' '}
          {scholarship.award.note}
        </p>
      </Card>

      <Card className="p-8">
        <h2 className="text-lg font-bold text-ink-900">What you'll need to apply</h2>
        <div className="mt-3 flex flex-col gap-4">
          {scholarship.applicationForm.sections.map((section) => (
            <div key={section.id}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-300">{section.title}</h3>
              <ul className="mt-1.5 flex flex-col gap-1.5">
                {section.fields.map((field) => (
                  <li key={field.id} className="text-[15px] text-ink-700">
                    {field.label}
                    {!field.required && <span className="ml-1.5 text-ink-300">(optional)</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-8">
        <h2 className="text-lg font-bold text-ink-900">Important dates</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-ink-300">Applications open</div>
            <div className="font-semibold text-ink-900">{formatDate(scholarship.applicationOpenAt)}</div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-ink-300">Application deadline</div>
            <div className="font-semibold text-ink-900">{formatDate(scholarship.applicationDeadline)}</div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-ink-300">Winner announcement</div>
            <div className="font-semibold text-ink-900">{formatDate(scholarship.winnerAnnouncementAt)}</div>
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <h2 className="text-lg font-bold text-ink-900">Guidelines</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {scholarship.guidelines.map((line, i) => (
            <li key={i} className="flex items-start gap-2 text-[15px] text-ink-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
              {line}
            </li>
          ))}
        </ul>
      </Card>

      {scholarship.recommenderGuidelines && scholarship.recommenderGuidelines.length > 0 && (
        <Card className="p-8">
          <h2 className="text-lg font-bold text-ink-900">Letter of Recommendation Guidelines</h2>
          <p className="mt-1 text-[15px] text-ink-500">
            Share this with your recommender — ask them to include the following in their letter:
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {scholarship.recommenderGuidelines.map((line, i) => (
              <li key={i} className="flex items-start gap-2 text-[15px] text-ink-700">
                <CheckIcon width={16} height={16} className="mt-0.5 shrink-0 text-success-700" />
                {line}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {state === 'SUBMITTED' && (
        <Card className="border-dashed p-6">
          <p className="text-sm font-semibold text-ink-500">Prototype controls (demo only)</p>
          <p className="text-sm text-ink-500">Simulate the review committee's decision to preview outcome states.</p>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => simulateOutcome('SELECTED')}>
              Simulate: Selected
            </Button>
            <Button variant="secondary" size="sm" onClick={() => simulateOutcome('NOT_SELECTED')}>
              Simulate: Not selected
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
