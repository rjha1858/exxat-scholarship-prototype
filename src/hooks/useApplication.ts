import { useCallback, useEffect, useState } from 'react'
import { applicationRepository } from '../repositories/applicationRepository'
import { currentStudent } from '../data/studentProfile'
import type { ScholarshipApplication } from '../types'

export function useApplication(scholarshipId: string | undefined) {
  const [application, setApplication] = useState<ScholarshipApplication | null>(null)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!scholarshipId) return
    setLoading(true)
    const app = await applicationRepository.getByScholarship(scholarshipId, currentStudent.id)
    setApplication(app)
    setLoading(false)
  }, [scholarshipId])

  useEffect(() => {
    reload()
  }, [reload])

  return { application, loading, reload }
}
