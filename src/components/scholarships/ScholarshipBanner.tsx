import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ScholarshipPromotion } from '../../types'
import { scholarshipRepository } from '../../repositories/scholarshipRepository'
import { applicationRepository } from '../../repositories/applicationRepository'
import { currentStudent } from '../../data/studentProfile'
import { track } from '../../lib/analytics'
import { ArrowRightIcon, AwardIcon } from '../ui/icons'
import { Badge } from '../ui/Badge'

interface ApplicationsSummary {
  draftScholarshipIds: string[]
  submitted: number
  selected: number
  notSelected: number
}

const bannerClassName =
  'flex w-full items-center justify-between gap-4 rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50 to-white px-6 py-5 text-left transition-colors hover:border-brand-200'

export function ScholarshipBanner({ promotion }: { promotion: ScholarshipPromotion }) {
  const navigate = useNavigate()
  const [summary, setSummary] = useState<ApplicationsSummary | null>(null)

  useEffect(() => {
    track('scholarships_home_banner_viewed', { promotionId: promotion.id })
  }, [promotion.id])

  useEffect(() => {
    ;(async () => {
      const scholarships = await scholarshipRepository.getAll()
      const applications = await Promise.all(
        scholarships.map((s) => applicationRepository.getByScholarship(s.id, currentStudent.id)),
      )
      const result: ApplicationsSummary = { draftScholarshipIds: [], submitted: 0, selected: 0, notSelected: 0 }
      applications.forEach((application, i) => {
        if (!application) return
        if (application.status === 'DRAFT') result.draftScholarshipIds.push(scholarships[i].id)
        else if (application.status === 'SELECTED') result.selected += 1
        else if (application.status === 'NOT_SELECTED') result.notSelected += 1
        else result.submitted += 1
      })
      setSummary(result)
    })()
  }, [])

  if (!promotion.active || !summary) return null

  const total = summary.draftScholarshipIds.length + summary.submitted + summary.selected + summary.notSelected

  function handleClick() {
    track('scholarships_home_banner_clicked', { promotionId: promotion.id })
    if (total === 0) {
      const target =
        promotion.targetType === 'SCHOLARSHIP_DETAIL' && promotion.targetId
          ? `/scholarships/${promotion.targetId}`
          : '/scholarships'
      navigate(target)
      return
    }
    if (total === 1 && summary!.draftScholarshipIds.length === 1) {
      navigate(`/scholarships/${summary!.draftScholarshipIds[0]}/apply`)
      return
    }
    navigate('/scholarships')
  }

  if (total === 0) {
    return (
      <button onClick={handleClick} className={bannerClassName}>
        <div className="flex items-center gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
            <AwardIcon />
          </span>
          <div>
            <div className="font-bold text-ink-900">{promotion.title}</div>
            <div className="text-sm text-ink-500">{promotion.description}</div>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white">
          {promotion.ctaLabel}
          <ArrowRightIcon width={14} height={14} />
        </span>
      </button>
    )
  }

  return (
    <button onClick={handleClick} className={bannerClassName}>
      <div className="flex items-center gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
          <AwardIcon />
        </span>
        <div>
          <div className="font-bold text-ink-900">Your Exxat Scholarship applications</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {summary.draftScholarshipIds.length > 0 && (
              <Badge tone="warn">
                {summary.draftScholarshipIds.length} Draft{summary.draftScholarshipIds.length > 1 ? 's' : ''}
              </Badge>
            )}
            {summary.submitted > 0 && <Badge tone="success">{summary.submitted} Submitted</Badge>}
            {summary.selected > 0 && <Badge tone="brand">{summary.selected} Selected</Badge>}
            {summary.notSelected > 0 && <Badge tone="neutral">{summary.notSelected} Not selected</Badge>}
          </div>
        </div>
      </div>
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white">
        {total === 1 && summary.draftScholarshipIds.length === 1 ? 'Continue Application' : 'View My Applications'}
        <ArrowRightIcon width={14} height={14} />
      </span>
    </button>
  )
}
