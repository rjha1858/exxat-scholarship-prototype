export interface JobListing {
  id: string
  title: string
  employer: string
  location: string
  type: string
  postedLabel: string
}

export const jobListings: JobListing[] = [
  {
    id: 'job-1',
    title: 'New Graduate RN — Med-Surg',
    employer: 'Cedar Grove Medical Center',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    postedLabel: 'Posted 3 days ago',
  },
  {
    id: 'job-2',
    title: 'Staff Nurse — Pediatrics',
    employer: 'Harborview Children’s Hospital',
    location: 'San Diego, CA',
    type: 'Full-time',
    postedLabel: 'Posted 1 week ago',
  },
  {
    id: 'job-3',
    title: 'Clinical Rotation Coordinator',
    employer: 'Pacific Health Partners',
    location: 'Remote',
    type: 'Internship',
    postedLabel: 'Posted 2 days ago',
  },
  {
    id: 'job-4',
    title: 'Physical Therapy Aide',
    employer: 'Sunrise Rehabilitation Group',
    location: 'Irvine, CA',
    type: 'Part-time',
    postedLabel: 'Posted today',
  },
]
