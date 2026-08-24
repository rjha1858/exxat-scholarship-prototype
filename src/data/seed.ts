import type {
  ApplicationField,
  ApplicationSection,
  EligibilityItem,
  Scholarship,
  ScholarshipProvider,
} from '../types'

const exxat: ScholarshipProvider = {
  id: 'exxat',
  name: 'Exxat',
  type: 'EXXAT',
}

const commonEligibility: EligibilityItem[] = [
  { id: 'enrolled', label: 'Actively enrolled in a health science or behavioral science education program at the time of submission' },
  { id: 'any-program', label: 'Open to students whether or not their program subscribes to Exxat' },
  {
    id: 'gpa-evaluation',
    label: 'GPA is one of the criteria considered during evaluation, though there is no minimum GPA required to apply',
  },
]

const commonRecommenderGuidelines = [
  'Your name, title, and organization',
  'The nature and length of your relationship with the applicant (e.g., supervisor, instructor, professor, preceptor)',
  "Your assessment of the applicant's qualifications for the award category selected, addressing qualities such as commitment to learning, interpersonal and communication skills, professionalism, responsibility, problem solving, and leadership as relevant",
  'Any additional comments that support the application',
]

const commonGuidelines = (essayPrompt: string) => [
  `Submit a one-page essay (500 words maximum) responding to: "${essayPrompt}"`,
  'Include one letter of recommendation from an experiential supervisor or faculty member in your program.',
  'Report your current GPA. GPA is one of the criteria used during evaluation, but there is no minimum GPA required to apply.',
  'Include a 30-second video explaining how this award will help you with your professional goals — upload a file or share a YouTube (or other streaming) link.',
  'Applications are reviewed by the Exxat Review Committee based on the essay, video, letter of recommendation, and GPA. Incomplete applications will not be reviewed.',
  'If selected, you will have one week to provide a GPA verification letter from your program director or department chair and a letter confirming your current enrollment — Exxat may rescind the offer if these are not provided in time.',
  'If selected, you will be asked to provide your full name, a short bio, a high-resolution photo (at least 1024×1024px, PNG or JPG), your LinkedIn handle (if you have one), and permission to use your image for the winner announcement.',
]

function programDetailsSection(): ApplicationSection {
  return {
    id: 'program-details',
    title: 'Program Details',
    fields: [
      {
        id: 'school-name',
        key: 'schoolName',
        label: 'School Name',
        type: 'TEXT',
        required: true,
        order: 1,
        prefillSource: 'APPLICATION',
        placeholder: 'e.g. University of Southern California',
      },
      {
        id: 'year-in-program',
        key: 'yearInProgram',
        label: 'Year in Program',
        type: 'SINGLE_SELECT',
        required: true,
        order: 2,
        prefillSource: 'APPLICATION',
        options: [
          { value: 'first', label: 'First year' },
          { value: 'second', label: 'Second year' },
          { value: 'third', label: 'Third year' },
          { value: 'fourth', label: 'Fourth year' },
        ],
      },
    ],
  }
}

function academicSection(): ApplicationSection {
  return {
    id: 'academic-info',
    title: 'Academic Information',
    fields: [
      {
        id: 'current-gpa',
        key: 'currentGpa',
        label: 'Current GPA',
        type: 'NUMBER',
        required: true,
        order: 1,
        prefillSource: 'APPLICATION',
        helpText:
          "Self-reported. GPA is one of the criteria considered during evaluation — there is no minimum GPA required to apply. Winners' GPA will be verified with their school prior to awarding the scholarship.",
        placeholder: 'e.g. 3.7',
      },
    ],
  }
}

function essaySection(categoryTitle: string, prompt: string): ApplicationSection {
  const field: ApplicationField = {
    id: 'essay-response',
    key: 'essayResponse',
    label: `Essay: ${categoryTitle}`,
    type: 'TEXTAREA',
    required: true,
    order: 1,
    prefillSource: 'APPLICATION',
    helpText: prompt,
    placeholder: 'Write your one-page response here...',
    maxWords: 500,
    richText: true,
  }
  return {
    id: 'your-story',
    title: 'Your Story',
    description: 'One-page essay, 500 words maximum.',
    fields: [field],
  }
}

const MB = 1024 * 1024

function documentsSection(): ApplicationSection {
  return {
    id: 'supporting-documents',
    title: 'Supporting Documents',
    fields: [
      {
        id: 'qualifying-video',
        key: 'qualifyingVideo',
        label: 'Video: Your Professional Goals',
        type: 'VIDEO',
        required: true,
        order: 1,
        prefillSource: 'APPLICATION',
        helpText: 'A 30-second video explaining how this award will help you with your professional goals.',
        accept: '.mp4',
        maxSizeBytes: 25 * MB,
      },
      {
        id: 'recommendation-letter',
        key: 'recommendationLetter',
        label: 'Letter of recommendation',
        type: 'FILE_UPLOAD',
        required: true,
        order: 2,
        prefillSource: 'APPLICATION',
        helpText: 'From an experiential supervisor or faculty member in your program.',
        accept: '.pdf,.doc,.docx',
      },
      {
        id: 'supporting-document',
        key: 'supportingDocument',
        label: 'Additional Supporting Document',
        type: 'FILE_UPLOAD',
        required: false,
        order: 3,
        prefillSource: 'APPLICATION',
        helpText: 'Optional: any additional document that strengthens your case for a shortlist (e.g., a resume, certificate, or additional recommendation).',
        accept: '.pdf,.doc,.docx',
      },
    ],
  }
}

interface CategoryDefinition {
  id: string
  title: string
  tagline: string
  prompt: string
}

const categories: CategoryDefinition[] = [
  {
    id: 'exxat-scholarship-scholarly-productivity',
    title: 'Scholarly Productivity Scholarship',
    tagline: 'For students who advance healthcare through research, publications, and scholarly work.',
    prompt:
      'How do your scholarly contributions help further your future profession and/or healthcare? Describe the scholarly activities you have participated in — including, but not limited to, peer-reviewed publications, abstracts, posters, and oral, platform, or invited presentations — and the role you played in each.',
  },
  {
    id: 'exxat-scholarship-diversity-inclusion',
    title: 'Diversity and Inclusion Scholarship',
    tagline: 'For students whose diverse experiences strengthen the future healthcare workforce.',
    prompt:
      'In what ways is your experience as a diverse student an asset to your future role as a service provider or professional? Include relevant honors or awards, community service, leadership positions held, and any scholarly activity that supports your response.',
  },
  {
    id: 'exxat-scholarship-leadership',
    title: 'Leadership Scholarship',
    tagline: 'For students who lead and collaborate within healthcare teams and their communities.',
    prompt:
      'As a service provider or professional, leadership and the ability to serve as a member of a team are both important skills. How has your experience as a leader prepared you to serve as a member of a collaborative professional team? Describe the leadership positions you have held — community, campus, or professional — including the organization, dates of service, and responsibilities.',
  },
  {
    id: 'exxat-scholarship-underserved-communities',
    title: 'Care for Underserved Communities Scholarship',
    tagline: 'For students expanding access to care for underserved communities.',
    prompt:
      'There are many barriers to receiving care for residents of an underserved community. Describe a barrier you have personally addressed through volunteer work, employment, or experiential education, including the organization(s) involved, dates of service, and your role.',
  },
]

const applicationOpenAt = '2026-10-12'
const applicationDeadline = '2026-11-20'
const winnerAnnouncementAt = '2026-12-15'

export const scholarships: Scholarship[] = categories.map((category) => ({
  id: category.id,
  title: category.title,
  provider: exxat,
  providerType: exxat.type,
  tagline: category.tagline,
  description:
    'Exxat will award a total of $16,000 in student scholarships this year — four $1,000 awards in each of four categories. As part of the Exxat Scholarship Program, four students in this category will each be awarded $1,000 for exemplifying excellence relevant to this award.',
  award: {
    amount: 1000,
    currency: 'USD',
    numberOfAwards: 4,
    note: 'Four awards of $1,000 are given in this category.',
  },
  eligibility: commonEligibility,
  applicationOpenAt,
  applicationDeadline,
  winnerAnnouncementAt,
  status: 'OPEN',
  guidelines: commonGuidelines(category.prompt),
  recommenderGuidelines: commonRecommenderGuidelines,
  applicationForm: {
    id: `${category.id}-form`,
    scholarshipId: category.id,
    sections: [
      programDetailsSection(),
      essaySection(category.title, category.prompt),
      academicSection(),
      documentsSection(),
    ],
  },
}))
