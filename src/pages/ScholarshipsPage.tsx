import { useEffect, useState } from 'react'
import { scholarshipRepository } from '../repositories/scholarshipRepository'
import { applicationRepository } from '../repositories/applicationRepository'
import { currentStudent } from '../data/studentProfile'
import type { Scholarship, ScholarshipApplication } from '../types'
import { ScholarshipCard } from '../components/scholarships/ScholarshipCard'
import { ProfileCompletionNudge } from '../components/scholarships/ProfileCompletionNudge'
import { track } from '../lib/analytics'

export function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [applications, setApplications] = useState<Record<string, ScholarshipApplication | null>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    track('scholarships_page_viewed')
    ;(async () => {
      const all = await scholarshipRepository.getAll()
      setScholarships(all)
      const apps = await Promise.all(
        all.map((s) => applicationRepository.getByScholarship(s.id, currentStudent.id)),
      )
      setApplications(Object.fromEntries(all.map((s, i) => [s.id, apps[i]])))
      setLoading(false)
    })()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-ink-900">Scholarships</h1>
        <p className="mt-1 text-[15px] text-ink-500">
          Explore scholarship opportunities from Exxat and our partner sites and schools.
        </p>
      </div>

      <ProfileCompletionNudge />

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : scholarships.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-10 text-center">
          <p className="font-semibold text-ink-900">No scholarships available right now.</p>
          <p className="mt-1 text-sm text-ink-500">Check back soon for new opportunities.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {scholarships.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              application={applications[scholarship.id] ?? null}
            />
          ))}
        </div>
      )}
    </div>
  )
}
