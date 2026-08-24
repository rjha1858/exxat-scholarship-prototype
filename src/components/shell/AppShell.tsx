import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'
import { DemoControlsWidget } from './DemoControlsWidget'

export function AppShell() {
  return (
    <div className="min-h-full">
      <TopNav />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
      <DemoControlsWidget />
    </div>
  )
}
