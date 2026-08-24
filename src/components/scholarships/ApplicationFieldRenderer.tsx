import type { ApplicationField, FileResponseValue, VideoFieldValue } from '../../types'
import { stripHtml, wordCount, type FieldValue } from '../../lib/applicationForm'
import { Field } from '../ui/Field'
import { Select, TextInput, Textarea } from '../ui/inputs'
import { FileUpload } from '../ui/FileUpload'
import { RichTextEditor } from '../ui/RichTextEditor'
import { VideoUploadField } from './VideoUploadField'

interface ApplicationFieldRendererProps {
  field: ApplicationField
  value: FieldValue
  error?: string
  onChange: (value: FieldValue) => void
}

export function ApplicationFieldRenderer({ field, value, error, onChange }: ApplicationFieldRendererProps) {
  const prefilled = field.prefillSource === 'STUDENT_PROFILE'

  return (
    <Field label={field.label} htmlFor={field.id} required={field.required} helpText={field.helpText} error={error} prefilled={prefilled}>
      {(() => {
        switch (field.type) {
          case 'TEXTAREA': {
            const textValue = (value as string) ?? ''
            const words = wordCount(field.richText ? stripHtml(textValue) : textValue)
            return (
              <>
                {field.richText ? (
                  <RichTextEditor
                    id={field.id}
                    value={textValue}
                    placeholder={field.placeholder}
                    ariaInvalid={!!error}
                    onChange={onChange}
                  />
                ) : (
                  <Textarea
                    id={field.id}
                    value={textValue}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    aria-invalid={!!error}
                    onChange={(e) => onChange(e.target.value)}
                  />
                )}
                {field.maxWords && (
                  <div className={`text-right text-xs ${words > field.maxWords ? 'text-danger-700' : 'text-ink-300'}`}>
                    {words} / {field.maxWords} words
                  </div>
                )}
              </>
            )
          }
          case 'SINGLE_SELECT':
            return (
              <Select id={field.id} value={(value as string) ?? ''} aria-invalid={!!error} onChange={(e) => onChange(e.target.value)}>
                <option value="" disabled>
                  Select {field.label.toLowerCase()}
                </option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            )
          case 'NUMBER':
            return (
              <TextInput
                id={field.id}
                type="number"
                inputMode="decimal"
                value={(value as string) ?? ''}
                placeholder={field.placeholder}
                aria-invalid={!!error}
                onChange={(e) => onChange(e.target.value)}
              />
            )
          case 'FILE_UPLOAD': {
            const helpParts = []
            if (field.accept) helpParts.push(`Accepted: ${field.accept}`)
            if (field.maxSizeBytes) helpParts.push(`Max ${Math.round(field.maxSizeBytes / (1024 * 1024))}MB`)
            return (
              <FileUpload
                id={field.id}
                accept={field.accept}
                maxSizeBytes={field.maxSizeBytes}
                value={value as FileResponseValue | null}
                onChange={onChange}
                helpLabel={helpParts.length ? helpParts.join(' · ') : undefined}
              />
            )
          }
          case 'VIDEO':
            return (
              <VideoUploadField
                id={field.id}
                accept={field.accept}
                maxSizeBytes={field.maxSizeBytes}
                value={value as VideoFieldValue | null}
                onChange={onChange}
              />
            )
          case 'EMAIL':
            return (
              <TextInput
                id={field.id}
                type="email"
                value={(value as string) ?? ''}
                placeholder={field.placeholder}
                aria-invalid={!!error}
                onChange={(e) => onChange(e.target.value)}
              />
            )
          default:
            return (
              <TextInput
                id={field.id}
                type="text"
                value={(value as string) ?? ''}
                placeholder={field.placeholder}
                aria-invalid={!!error}
                onChange={(e) => onChange(e.target.value)}
              />
            )
        }
      })()}
    </Field>
  )
}
