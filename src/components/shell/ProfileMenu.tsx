import { useEffect, useRef } from 'react'
import {
  FileIcon,
  GridIcon,
  LogoutIcon,
  SettingsIcon,
  SlidersIcon,
  UserIcon,
} from '../ui/icons'

interface ProfileMenuProps {
  onClose: () => void
}

const items = [
  { icon: UserIcon, label: 'My Profile' },
  { icon: FileIcon, label: 'My Files' },
  { icon: SlidersIcon, label: 'Profile Settings' },
  { icon: SettingsIcon, label: 'Account Settings' },
]

export function ProfileMenu({ onClose }: ProfileMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <div
      ref={ref}
      role="menu"
      className="absolute right-0 top-[calc(100%+8px)] w-72 overflow-hidden rounded-2xl border border-line bg-white shadow-lg"
    >
      {items.map(({ icon: Icon, label }) => (
        <button
          key={label}
          role="menuitem"
          className="flex w-full items-center gap-3 border-b border-line px-5 py-3.5 text-left text-[15px] text-ink-900 hover:bg-surface"
        >
          <Icon className="text-ink-700" />
          {label}
        </button>
      ))}
      <button
        role="menuitem"
        className="flex w-full items-center gap-3 border-b border-line bg-brand-50 px-5 py-3.5 text-left text-[15px] text-ink-900"
      >
        <GridIcon className="text-ink-700" />
        Go to <span className="font-bold">Exxat Prism</span>
      </button>
      <button role="menuitem" className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-[15px] font-medium text-danger-700 hover:bg-surface">
        <LogoutIcon />
        Log Out
      </button>
    </div>
  )
}
