import type { HTMLAttributes } from 'react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(20,20,31,0.04)] ${className}`}
      {...props}
    />
  )
}
