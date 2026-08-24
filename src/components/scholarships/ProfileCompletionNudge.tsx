import { Link } from 'react-router-dom'
import { currentStudent } from '../../data/studentProfile'
import { Button } from '../ui/Button'
import { AlertIcon } from '../ui/icons'

const NUDGE_THRESHOLD_PERCENT = 10

export function ProfileCompletionNudge() {
  if (currentStudent.profileCompletionPercent >= NUDGE_THRESHOLD_PERCENT) return null

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
        <AlertIcon width={18} height={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink-900">
          Your Exxat One profile is only {currentStudent.profileCompletionPercent}% complete
        </p>
        <p className="mt-1 text-sm text-ink-700">
          Reviewers use your Exxat One profile alongside your application. A complete profile improves your chances
          of being shortlisted.
        </p>
      </div>
      <Link to="/" className="shrink-0">
        <Button variant="secondary" size="sm">
          Complete Your Profile
        </Button>
      </Link>
    </div>
  )
}
