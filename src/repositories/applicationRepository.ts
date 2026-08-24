import type { ApplicationResponse, ApplicationStatus, ScholarshipApplication } from '../types'

const STORAGE_PREFIX = 'scholarship_application_'

function storageKey(scholarshipId: string, studentId: string) {
  return `${STORAGE_PREFIX}${scholarshipId}_${studentId}`
}

function nowIso() {
  return new Date().toISOString()
}

function read(scholarshipId: string, studentId: string): ScholarshipApplication | null {
  const raw = localStorage.getItem(storageKey(scholarshipId, studentId))
  if (!raw) return null
  try {
    return JSON.parse(raw) as ScholarshipApplication
  } catch {
    return null
  }
}

function write(app: ScholarshipApplication) {
  localStorage.setItem(storageKey(app.scholarshipId, app.studentId), JSON.stringify(app))
  return app
}

export const applicationRepository = {
  async getByScholarship(scholarshipId: string, studentId: string): Promise<ScholarshipApplication | null> {
    return read(scholarshipId, studentId)
  },

  async createDraft(scholarshipId: string, studentId: string): Promise<ScholarshipApplication> {
    const existing = read(scholarshipId, studentId)
    if (existing) return existing
    const app: ScholarshipApplication = {
      id: `app-${scholarshipId}-${studentId}`,
      scholarshipId,
      studentId,
      status: 'DRAFT',
      responses: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }
    return write(app)
  },

  async updateDraft(
    scholarshipId: string,
    studentId: string,
    responses: ApplicationResponse[],
  ): Promise<ScholarshipApplication> {
    const existing = read(scholarshipId, studentId) ?? (await this.createDraft(scholarshipId, studentId))
    const merged = new Map(existing.responses.map((r) => [r.fieldId, r]))
    for (const response of responses) {
      merged.set(response.fieldId, response)
    }
    const app: ScholarshipApplication = {
      ...existing,
      responses: Array.from(merged.values()),
      updatedAt: nowIso(),
    }
    return write(app)
  },

  async submit(scholarshipId: string, studentId: string): Promise<ScholarshipApplication> {
    const existing = read(scholarshipId, studentId)
    if (!existing) throw new Error('No draft application found to submit')
    const app: ScholarshipApplication = {
      ...existing,
      status: 'SUBMITTED',
      submittedAt: nowIso(),
      updatedAt: nowIso(),
    }
    return write(app)
  },

  async setOutcome(scholarshipId: string, studentId: string, status: ApplicationStatus): Promise<ScholarshipApplication> {
    const existing = read(scholarshipId, studentId)
    if (!existing) throw new Error('No application found')
    return write({ ...existing, status, updatedAt: nowIso() })
  },

  async resetAll(): Promise<void> {
    const keysToRemove = Object.keys(localStorage).filter((key) => key.startsWith(STORAGE_PREFIX))
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  },
}
