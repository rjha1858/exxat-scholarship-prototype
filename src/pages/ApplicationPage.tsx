import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { scholarshipRepository } from '../repositories/scholarshipRepository'
import { applicationRepository } from '../repositories/applicationRepository'
import { currentStudent } from '../data/studentProfile'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { ApplicationFieldRenderer } from '../components/scholarships/ApplicationFieldRenderer'
import { ProfileCompletionNudge } from '../components/scholarships/ProfileCompletionNudge'
import {
  allFields,
  buildInitialResponses,
  completionPercentage,
  toResponses,
  validateField,
  type FieldValue,
} from '../lib/applicationForm'
import { track } from '../lib/analytics'

export function ApplicationPage() {
  const { scholarshipId } = useParams()
  const navigate = useNavigate()

  const { data: scholarship, loading } = useAsync(
    () => scholarshipRepository.getById(scholarshipId ?? ''),
    [scholarshipId],
  )

  const [responses, setResponses] = useState<Record<string, FieldValue>>({})
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!scholarship) return
    ;(async () => {
      const existing = await applicationRepository.getByScholarship(scholarship.id, currentStudent.id)
      if (!existing) {
        track('scholarship_application_started', { scholarshipId: scholarship.id, providerId: scholarship.provider.id })
      }
      const application = existing ?? (await applicationRepository.createDraft(scholarship.id, currentStudent.id))
      setResponses(buildInitialResponses(scholarship.applicationForm, application))
      setReady(true)
    })()
  }, [scholarship])

  const percent = useMemo(
    () => (scholarship ? completionPercentage(scholarship.applicationForm, responses) : 0),
    [scholarship, responses],
  )

  if (loading || !ready || !scholarship) {
    return <div className="h-96 animate-pulse rounded-2xl bg-white" />
  }

  async function saveDraft() {
    setSaving(true)
    await applicationRepository.updateDraft(scholarship!.id, currentStudent.id, toResponses(responses))
    track('scholarship_application_draft_saved', {
      scholarshipId: scholarship!.id,
      completionPercentage: percent,
    })
    setSaving(false)
  }

  function validateAll(): boolean {
    const nextErrors: Record<string, string | undefined> = {}
    let valid = true
    for (const field of allFields(scholarship!.applicationForm)) {
      const err = validateField(field, responses[field.id] ?? null)
      if (err) valid = false
      nextErrors[field.id] = err
    }
    setErrors(nextErrors)
    return valid
  }

  async function handleReview() {
    if (!validateAll()) return
    await saveDraft()
    navigate(`/scholarships/${scholarship!.id}/application/review`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to={`/scholarships/${scholarship.id}`} className="text-sm font-semibold text-ink-500 hover:text-ink-900">
          &larr; {scholarship.title}
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold text-ink-900">Application</h1>
        <p className="mt-1 text-[15px] text-ink-500">Fill out the form below, then review your application before submitting.</p>
      </div>

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

      <ProfileCompletionNudge />

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium text-ink-500">
          <span>Application form</span>
          <span>{percent}% complete</span>
        </div>
        <ProgressBar percent={percent} />
      </div>

      <Card className="flex flex-col gap-8 p-8">
        {scholarship.applicationForm.sections.map((section) => (
          <div key={section.id} className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold text-ink-900">{section.title}</h2>
              {section.description && <p className="mt-1 text-sm text-ink-500">{section.description}</p>}
            </div>
            {section.fields
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <ApplicationFieldRenderer
                  key={field.id}
                  field={field}
                  value={responses[field.id] ?? null}
                  error={errors[field.id]}
                  onChange={(value) => {
                    setResponses((prev) => ({ ...prev, [field.id]: value }))
                    setErrors((prev) => ({ ...prev, [field.id]: undefined }))
                  }}
                />
              ))}
          </div>
        ))}
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to={`/scholarships/${scholarship.id}`}>
          <Button variant="secondary">Cancel</Button>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={saveDraft} disabled={saving}>
            {saving ? 'Saving…' : 'Save Draft'}
          </Button>
          <Button onClick={handleReview}>Review Application</Button>
        </div>
      </div>
    </div>
  )
}
