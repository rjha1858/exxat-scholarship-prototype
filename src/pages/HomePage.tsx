import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { ScholarshipBanner } from '../components/scholarships/ScholarshipBanner'
import { homeScholarshipPromotion } from '../data/promotion'
import { currentStudent } from '../data/studentProfile'
import { BriefcaseIcon, CalendarIcon, ArrowRightIcon } from '../components/ui/icons'

export function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-serif text-4xl text-ink-900">
        Hi, {currentStudent.firstName} {currentStudent.lastName}
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col gap-4 p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-500 text-base font-bold text-white">
              {currentStudent.firstName[0]}
              {currentStudent.lastName[0]}
            </div>
            <div>
              <div className="font-bold text-ink-900">
                {currentStudent.firstName} {currentStudent.lastName}
              </div>
              <div className="text-sm text-ink-500">{currentStudent.program}</div>
              <div className="text-sm text-ink-500">{currentStudent.school}</div>
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-ink-700">Your progress</span>
              <Badge tone="warn">Incomplete</Badge>
            </div>
            <ProgressBar percent={currentStudent.profileCompletionPercent} />
          </div>
        </Card>

        <Card className="flex flex-col gap-3 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-ink-900">
              <CalendarIcon />
              Placement Schedules
            </div>
            <ArrowRightIcon className="text-ink-500" width={16} height={16} />
          </div>
          <p className="text-sm text-ink-500">Track your placement schedules</p>
          <div className="mt-auto h-24 rounded-xl bg-surface" />
        </Card>

        <Card className="flex flex-col gap-3 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-ink-900">
              <BriefcaseIcon />
              Jobs
            </div>
            <ArrowRightIcon className="text-ink-500" width={16} height={16} />
          </div>
          <p className="text-sm text-ink-500">3k+ Jobs · Find your 1st job</p>
          <div className="mt-auto h-24 rounded-xl bg-surface" />
        </Card>
      </div>

      <ScholarshipBanner promotion={homeScholarshipPromotion} />

      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-xl font-bold text-ink-900">To Do</h2>
          <p className="text-sm text-ink-500">Tasks and actions that need your attention</p>
        </div>
        <Card className="flex flex-col gap-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="font-semibold text-ink-900">Wishlist</div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="danger">Some Action Needed</Badge>
              <Badge tone="neutral">Due on Sep 10</Badge>
              <Badge tone="blue">Upcoming</Badge>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-ink-900">Spring 2025 Clinical Rotation</h3>
            <p className="mt-1 text-sm text-ink-500">80 Availabilities · Clinical PT Applications · Oct 1 - Oct 15, 2025</p>
          </div>
        </Card>
      </div>

      <Card className="flex flex-wrap items-center gap-3 p-5">
        <span className="font-bold text-ink-900">Quick Access</span>
        {['Upcoming Placement', 'Saved Jobs', 'Applied Jobs', 'My files'].map((label) => (
          <span key={label} className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-700">
            {label}
          </span>
        ))}
      </Card>
    </div>
  )
}
