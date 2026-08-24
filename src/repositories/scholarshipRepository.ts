import { scholarships } from '../data/seed'
import type { Scholarship } from '../types'

export const scholarshipRepository = {
  async getAll(): Promise<Scholarship[]> {
    return scholarships
  },
  async getById(id: string): Promise<Scholarship | undefined> {
    return scholarships.find((s) => s.id === id)
  },
}
