import type { ScholarshipProvider } from '../../types'

interface ProviderBadgeProps {
  provider: ScholarshipProvider
  size?: 'sm' | 'md'
}

const sizeClasses = {
  sm: { mark: 'h-6 w-6 text-xs', name: 'text-sm' },
  md: { mark: 'h-9 w-9 text-sm', name: 'text-[15px]' },
}

export function ProviderBadge({ provider, size = 'sm' }: ProviderBadgeProps) {
  const { mark, name } = sizeClasses[size]

  return (
    <div className="flex items-center gap-2">
      {provider.logo ? (
        <img src={provider.logo} alt={provider.name} className={`${mark} rounded-full object-cover`} />
      ) : (
        <span className={`grid shrink-0 place-items-center rounded-full bg-brand-500 font-bold text-white ${mark}`}>
          {provider.name.charAt(0).toUpperCase()}
        </span>
      )}
      <span className={`font-semibold text-ink-900 ${name}`}>{provider.name}</span>
    </div>
  )
}
