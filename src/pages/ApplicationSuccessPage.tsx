import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { scholarshipRepository } from '../repositories/scholarshipRepository'
import { applicationRepository } from '../repositories/applicationRepository'
import { currentStudent } from '../data/studentProfile'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { formatCurrency, formatDate } from '../lib/applicationState'
import { track } from '../lib/analytics'
import { ArrowRightIcon, BriefcaseIcon, CheckIcon } from '../components/ui/icons'

export function ApplicationSuccessPage() {
  const { scholarshipId } = useParams()
  const navigate = useNavigate()
  const { data: scholarship, loading } = useAsync(
    () => scholarshipRepository.getById(scholarshipId ?? ''),
    [scholarshipId],
  )
  const { data: application } = useAsync(
    () => applicationRepository.getByScholarship(scholarshipId ?? '', currentStudent.id),
    [scholarshipId],
  )

  useEffect(() => {
    if (scholarship) track('jobs_cross_sell_viewed', { scholarshipId: scholarship.id })
  }, [scholarship])

  if (loading || !scholarship) return <div className="h-64 animate-pulse rounded-2xl bg-white" />

  const handleJobsCrossSellClick = () => {
    track('jobs_cross_sell_clicked', { scholarshipId: scholarship.id })
    navigate('/jobs')
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-10 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-success-100 text-success-700">
        <CheckIcon width={28} height={28} />
      </div>
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900">Application submitted successfully</h1>
        <p className="mt-2 text-[15px] text-ink-500">Thank you for applying to the {scholarship.title}.</p>
      </div>

      <Card className="w-full p-6 text-left">
        <dl className="flex flex-col gap-3">
          <div className="flex justify-between">
            <dt className="text-sm text-ink-500">Scholarship</dt>
            <dd className="text-sm font-semibold text-ink-900">{scholarship.title}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-ink-500">Award amount</dt>
            <dd className="text-sm font-semibold text-ink-900">{formatCurrency(scholarship.award.amount, scholarship.award.currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-ink-500">Submitted on</dt>
            <dd className="text-sm font-semibold text-ink-900">
              {application?.submittedAt ? formatDate(application.submittedAt) : '—'}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-ink-500">Winner announcement</dt>
            <dd className="text-sm font-semibold text-ink-900">{formatDate(scholarship.winnerAnnouncementAt)}</dd>
          </div>
          {application?.id && (
            <div className="flex justify-between">
              <dt className="text-sm text-ink-500">Reference ID</dt>
              <dd className="text-sm font-semibold text-ink-900">{application.id}</dd>
            </div>
          )}
        </dl>
      </Card>

      <div className="flex gap-3">
        <Link to="/scholarships">
          <Button>Back to Scholarships</Button>
        </Link>
        <Link to={`/scholarships/${scholarship.id}`}>
          <Button variant="secondary">View Application</Button>
        </Link>
      </div>

      <button
        onClick={handleJobsCrossSellClick}
        className="flex w-full items-center justify-between gap-4 rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50 to-white px-6 py-5 text-left transition-colors hover:border-brand-200"
      >
        <div className="flex items-center gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink-900 text-white">
            <BriefcaseIcon />
          </span>
          <div>
            <div className="font-bold text-ink-900">While you wait, get a head start on your career</div>
            <div className="text-sm text-ink-500">3k+ Jobs are hiring health science graduates like you on Exxat One.</div>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white">
          Browse Jobs
          <ArrowRightIcon width={14} height={14} />
        </span>
      </button>
    </div>
  )
}
