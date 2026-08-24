import type { HTMLAttributes } from 'react'

type Tone = 'success' | 'warn' | 'danger' | 'neutral' | 'brand' | 'blue'

const toneClasses: Record<Tone, string> = {
  success: 'bg-success-100 text-success-700',
  warn: 'bg-warn-100 text-warn-700',
  danger: 'bg-danger-100 text-danger-700',
  neutral: 'bg-surface-nav text-ink-700',
  brand: 'bg-brand-100 text-brand-700',
  blue: 'bg-blue-tint text-blue-700',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

export function Badge({ tone = 'neutral', className = '', ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold ${toneClasses[tone]} ${className}`}
      {...props}
    />
  )
}
