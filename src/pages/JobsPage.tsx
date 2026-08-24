import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { jobListings } from '../data/jobs'
import { BriefcaseIcon } from '../components/ui/icons'

export function JobsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-ink-900">Jobs</h1>
        <p className="mt-1 text-[15px] text-ink-500">3k+ Jobs from employers hiring health science graduates like you.</p>
      </div>

      <div className="flex flex-col gap-4">
        {jobListings.map((job) => (
          <Card key={job.id} className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface text-ink-700">
                <BriefcaseIcon />
              </span>
              <div>
                <h3 className="font-bold text-ink-900">{job.title}</h3>
                <p className="text-sm text-ink-500">
                  {job.employer} · {job.location}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-300">
                  {job.type} · {job.postedLabel}
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              View job
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
