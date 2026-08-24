import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BellIcon, BriefcaseIcon, CalendarIcon, ChevronDownIcon, HelpIcon, HomeIcon, SparkleIcon } from '../ui/icons'
import { ProfileMenu } from './ProfileMenu'
import { currentStudent } from '../../data/studentProfile'

const navLinks = [
  { label: 'Home', icon: HomeIcon, href: '/' },
  { label: 'Placement Schedules', icon: CalendarIcon, href: '#' },
  { label: 'Jobs', icon: BriefcaseIcon, href: '/jobs' },
]

function initials(first: string, last: string) {
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase()
}

export function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface-nav">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link to="/" className="flex items-center gap-1 text-xl font-extrabold text-ink-900">
          Exxat<span className="text-brand-500">One</span>
          <ChevronDownIcon className="ml-0.5 text-ink-500" width={16} height={16} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              to={href}
              className="flex items-center gap-2 text-[15px] font-semibold text-ink-900 hover:text-brand-500"
            >
              <Icon />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black sm:flex">
            <SparkleIcon width={14} height={14} />
            Ask Leo
          </button>
          <button aria-label="Notifications" className="grid h-9 w-9 place-items-center rounded-full text-ink-700 hover:bg-white">
            <BellIcon />
          </button>
          <button aria-label="Help" className="grid h-9 w-9 place-items-center rounded-full text-ink-700 hover:bg-white">
            <HelpIcon />
          </button>
          <div className="relative">
            <button
              aria-label="Open profile menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 text-sm font-bold text-white"
            >
              {initials(currentStudent.firstName, currentStudent.lastName)}
            </button>
            {menuOpen && <ProfileMenu onClose={() => setMenuOpen(false)} />}
          </div>
        </div>
      </div>
    </header>
  )
}
