import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { scholarshipRepository } from '../repositories/scholarshipRepository'
import { applicationRepository } from '../repositories/applicationRepository'
import { currentStudent } from '../data/studentProfile'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { buildInitialResponses, displayValue, isFieldEmpty, type FieldValue } from '../lib/applicationForm'
import { track } from '../lib/analytics'
import type { ScholarshipApplication, VideoFieldValue } from '../types'

export function ApplicationReviewPage() {
  const { scholarshipId } = useParams()
  const navigate = useNavigate()
  const { data: scholarship, loading } = useAsync(
    () => scholarshipRepository.getById(scholarshipId ?? ''),
    [scholarshipId],
  )
  const [application, setApplication] = useState<ScholarshipApplication | null>(null)
  const [responses, setResponses] = useState<Record<string, FieldValue>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!scholarship) return
    ;(async () => {
      const app = await applicationRepository.getByScholarship(scholarship.id, currentStudent.id)
      setApplication(app)
      setResponses(buildInitialResponses(scholarship.applicationForm, app))
      track('scholarship_application_reviewed', { scholarshipId: scholarship.id })
    })()
  }, [scholarship])

  if (loading || !scholarship) return <div className="h-96 animate-pulse rounded-2xl bg-white" />

  const handleSubmit = async () => {
    setSubmitting(true)
    await applicationRepository.submit(scholarship.id, currentStudent.id)
    track('scholarship_application_submitted', { scholarshipId: scholarship.id, providerId: scholarship.provider.id })
    navigate(`/scholarships/${scholarship.id}/application/success`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to={`/scholarships/${scholarship.id}/apply`} className="text-sm font-semibold text-ink-500 hover:text-ink-900">
            &larr; Back to application
          </Link>
          <h1 className="mt-2 text-2xl font-extrabold text-ink-900">Review your application</h1>
          <p className="mt-1 text-[15px] text-ink-500">{scholarship.title}</p>
        </div>
        <Link to={`/scholarships/${scholarship.id}/apply`}>
          <Button variant="secondary" size="sm">
            Edit Application
          </Button>
        </Link>
      </div>

      {application?.status !== 'DRAFT' && (
        <div className="rounded-xl border border-line bg-surface p-4 text-sm text-ink-700">
          You've already submitted this application. Submitting again isn't necessary.
        </div>
      )}

      <Card className="flex items-center gap-4 p-5">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-500 text-sm font-bold text-white">
          {currentStudent.firstName[0]}
          {currentStudent.lastName[0]}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wide text-ink-300">Applying as</div>
          <div className="truncate font-semibold text-ink-900">
            {currentStudent.firstName} {currentStudent.lastName} · {currentStudent.email}
          </div>
          <div className="text-sm text-ink-500">{currentStudent.discipline}</div>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        {scholarship.applicationForm.sections.map((section) => (
          <Card key={section.id} className="p-6">
            <h2 className="mb-3 font-bold text-ink-900">{section.title}</h2>
            <dl className="flex flex-col gap-3">
              {section.fields.map((field) => {
                const value = responses[field.id] ?? null
                return (
                  <div key={field.id}>
                    <dt className="text-sm font-medium text-ink-500">{field.label}</dt>
                    {field.richText && !isFieldEmpty(field, value) ? (
                      <dd
                        className="prose-sm max-w-none text-[15px] text-ink-900 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                        dangerouslySetInnerHTML={{ __html: value as string }}
                      />
                    ) : field.type === 'VIDEO' && (value as VideoFieldValue | null)?.mode === 'link' ? (
                      <dd className="text-[15px] text-ink-900">
                        <a
                          href={(value as VideoFieldValue).url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-brand-600 underline"
                        >
                          {(value as VideoFieldValue).url}
                        </a>
                      </dd>
                    ) : (
                      <dd className="whitespace-pre-wrap text-[15px] text-ink-900">{displayValue(field, value)}</dd>
                    )}
                  </div>
                )
              })}
            </dl>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={submitting || application?.status !== 'DRAFT'}>
          {submitting ? 'Submitting…' : 'Submit Application'}
        </Button>
      </div>
    </div>
  )
}
