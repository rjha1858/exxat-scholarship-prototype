import { useState } from 'react'
import { applicationRepository } from '../../repositories/applicationRepository'
import { CloseIcon, RefreshIcon, SlidersIcon } from '../ui/icons'

export function DemoControlsWidget() {
  const [open, setOpen] = useState(false)

  const handleReset = async () => {
    const confirmed = window.confirm(
      'Reset this demo? This clears all saved drafts, submissions, and outcomes so every scholarship looks brand new.',
    )
    if (!confirmed) return
    await applicationRepository.resetAll()
    window.location.href = '/'
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      <div
        className={`w-80 flex-col gap-4 rounded-2xl border border-dashed border-ink-300 bg-white p-4 shadow-lg ${
          open ? 'flex' : 'hidden'
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-300">Prototype controls (demo only)</p>
        <div id="demo-controls-slot" className="flex flex-col gap-3 empty:hidden" />
        <button
          onClick={handleReset}
          title="Prototype only: clears all scholarship application data for this demo"
          className="flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-700 hover:border-brand-400 hover:text-brand-600"
        >
          <RefreshIcon width={14} height={14} />
          Reset Demo Data
        </button>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-dashed border-ink-300 bg-white/95 px-4 py-2 text-xs font-semibold text-ink-500 shadow-md backdrop-blur hover:border-brand-400 hover:text-brand-600"
      >
        {open ? <CloseIcon width={14} height={14} /> : <SlidersIcon width={14} height={14} />}
        Demo Controls
      </button>
    </div>
  )
}
