import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  htmlFor: string
  required?: boolean
  helpText?: string
  error?: string
  prefilled?: boolean
  children: ReactNode
}

export function Field({ label, htmlFor, required, helpText, error, prefilled, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[15px] font-semibold text-ink-900">
        {label}
        {required && <span className="ml-1 text-brand-500">*</span>}
        {prefilled && (
          <span className="ml-2 rounded-full bg-blue-tint px-2 py-0.5 text-xs font-medium text-blue-700">
            From your profile
          </span>
        )}
      </label>
      {helpText && <p className="text-sm text-ink-500">{helpText}</p>}
      {children}
      {error && (
        <p role="alert" className="text-sm font-medium text-danger-700">
          {error}
        </p>
      )}
    </div>
  )
}
