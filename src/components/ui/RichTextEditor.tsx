import { useEffect, useRef } from 'react'

interface RichTextEditorProps {
  id: string
  value: string
  onChange: (html: string) => void
  placeholder?: string
  ariaInvalid?: boolean
}

const TOOLBAR_BUTTONS: { command: string; label: string; className?: string }[] = [
  { command: 'bold', label: 'B', className: 'font-bold' },
  { command: 'italic', label: 'I', className: 'italic' },
  { command: 'underline', label: 'U', className: 'underline' },
  { command: 'insertUnorderedList', label: '•' },
  { command: 'insertOrderedList', label: '1.' },
]

export function RichTextEditor({ id, value, onChange, placeholder, ariaInvalid }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInternalUpdate = useRef(false)

  useEffect(() => {
    if (ref.current && !isInternalUpdate.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || ''
    }
    isInternalUpdate.current = false
  }, [value])

  function handleInput() {
    if (ref.current) {
      isInternalUpdate.current = true
      onChange(ref.current.innerHTML)
    }
  }

  function exec(command: string) {
    ref.current?.focus()
    document.execCommand(command)
    handleInput()
  }

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 ${
        ariaInvalid ? 'border-danger-700' : 'border-line'
      }`}
    >
      <div className="flex items-center gap-1 border-b border-line bg-surface px-2 py-1.5">
        {TOOLBAR_BUTTONS.map((btn) => (
          <button
            key={btn.command}
            type="button"
            title={btn.command}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(btn.command)}
            className={`grid h-7 w-7 place-items-center rounded-md text-sm text-ink-700 hover:bg-white ${btn.className ?? ''}`}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div
        id={id}
        ref={ref}
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        suppressContentEditableWarning
        className="min-h-40 px-4 py-2.5 text-[15px] text-ink-900 outline-none empty:before:text-ink-300 empty:before:content-[attr(data-placeholder)]"
      />
    </div>
  )
}
