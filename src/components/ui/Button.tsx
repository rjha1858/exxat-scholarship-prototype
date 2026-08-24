import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-ink-900 text-white hover:bg-black disabled:bg-ink-300 disabled:text-white',
  secondary: 'bg-white text-ink-900 border border-line hover:bg-surface disabled:text-ink-300',
  ghost: 'bg-transparent text-ink-700 hover:bg-surface disabled:text-ink-300',
}

const sizeClasses: Record<Size, string> = {
  md: 'px-5 py-2.5 text-[15px]',
  sm: 'px-3.5 py-1.5 text-sm',
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  )
}
