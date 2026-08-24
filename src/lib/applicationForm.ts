import type {
  ApplicationField,
  ApplicationForm,
  ApplicationResponse,
  FileResponseValue,
  ScholarshipApplication,
  VideoFieldValue,
} from '../types'

export type FieldValue = string | string[] | number | FileResponseValue | VideoFieldValue | null

function emptyValueFor(field: ApplicationField): FieldValue {
  if (field.type === 'MULTI_SELECT') return []
  if (field.type === 'FILE_UPLOAD' || field.type === 'VIDEO') return null
  if (field.type === 'NUMBER') return ''
  return ''
}

export function allFields(form: ApplicationForm): ApplicationField[] {
  return form.sections.flatMap((section) => section.fields)
}

export function buildInitialResponses(
  form: ApplicationForm,
  application: ScholarshipApplication | null,
): Record<string, FieldValue> {
  const saved = new Map(application?.responses.map((r) => [r.fieldId, r.value]) ?? [])
  const result: Record<string, FieldValue> = {}
  for (const field of allFields(form)) {
    result[field.id] = saved.has(field.id) ? (saved.get(field.id) as FieldValue) : emptyValueFor(field)
  }
  return result
}

export function toResponses(responses: Record<string, FieldValue>): ApplicationResponse[] {
  return Object.entries(responses).map(([fieldId, value]) => ({ fieldId, value }))
}

export function stripHtml(html: string): string {
  if (typeof document === 'undefined') return html.replace(/<[^>]*>/g, '')
  const el = document.createElement('div')
  el.innerHTML = html
  return el.textContent ?? ''
}

export function isFieldEmpty(field: ApplicationField, value: FieldValue): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') {
    return (field.richText ? stripHtml(value) : value).trim().length === 0
  }
  if (Array.isArray(value)) return value.length === 0
  if (field.type === 'VIDEO') {
    const video = value as VideoFieldValue
    return video.mode === 'file' ? !video.file : !video.url || video.url.trim().length === 0
  }
  return false
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_RE = /^https?:\/\/.+\..+/i

export function wordCount(text: string): number {
  const trimmed = text.trim()
  return trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length
}

export function validateField(field: ApplicationField, value: FieldValue): string | undefined {
  if (field.required && isFieldEmpty(field, value)) {
    return `${field.label} is required.`
  }
  if (!isFieldEmpty(field, value) && field.type === 'EMAIL' && typeof value === 'string' && !EMAIL_RE.test(value)) {
    return 'Enter a valid email address.'
  }
  if (!isFieldEmpty(field, value) && field.type === 'NUMBER' && typeof value === 'string' && Number.isNaN(Number(value))) {
    return 'Enter a valid number.'
  }
  if (
    !isFieldEmpty(field, value) &&
    field.type === 'NUMBER' &&
    typeof value === 'string' &&
    !Number.isNaN(Number(value)) &&
    field.minValue !== undefined &&
    Number(value) < field.minValue
  ) {
    return `${field.label} must be at least ${field.minValue}.`
  }
  if (!isFieldEmpty(field, value) && field.type === 'TEXTAREA' && typeof value === 'string' && field.maxWords) {
    const count = wordCount(field.richText ? stripHtml(value) : value)
    if (count > field.maxWords) {
      return `Keep your essay to ${field.maxWords} words or fewer (currently ${count}).`
    }
  }
  if (
    !isFieldEmpty(field, value) &&
    field.type === 'FILE_UPLOAD' &&
    field.maxSizeBytes &&
    typeof value === 'object' &&
    value !== null &&
    'fileSize' in value &&
    (value as FileResponseValue).fileSize > field.maxSizeBytes
  ) {
    return `File is too large. Max size is ${Math.round(field.maxSizeBytes / (1024 * 1024))}MB.`
  }
  if (!isFieldEmpty(field, value) && field.type === 'VIDEO') {
    const video = value as VideoFieldValue
    if (video.mode === 'link' && video.url && !URL_RE.test(video.url.trim())) {
      return 'Enter a valid video link (starting with http:// or https://).'
    }
    if (video.mode === 'file' && video.file && field.maxSizeBytes && video.file.fileSize > field.maxSizeBytes) {
      return `File is too large. Max size is ${Math.round(field.maxSizeBytes / (1024 * 1024))}MB.`
    }
  }
  return undefined
}

export function displayValue(field: ApplicationField, value: FieldValue): string {
  if (isFieldEmpty(field, value)) return '—'
  if (field.type === 'FILE_UPLOAD' && value && typeof value === 'object' && 'fileName' in value) {
    return (value as FileResponseValue).fileName
  }
  if (field.type === 'VIDEO') {
    const video = value as VideoFieldValue
    return video.mode === 'file' ? video.file?.fileName ?? '—' : video.url ?? '—'
  }
  if (field.type === 'SINGLE_SELECT') {
    return field.options?.find((o) => o.value === value)?.label ?? String(value)
  }
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

export function completionPercentage(form: ApplicationForm, responses: Record<string, FieldValue>): number {
  const fields = allFields(form)
  if (fields.length === 0) return 0
  const filled = fields.filter((f) => !isFieldEmpty(f, responses[f.id] ?? null)).length
  return Math.round((filled / fields.length) * 100)
}
