import { useRef, useState } from 'react'
import type { FileResponseValue } from '../../types'

interface FileUploadProps {
  id: string
  accept?: string
  value: FileResponseValue | null
  onChange: (value: FileResponseValue | null) => void
  helpLabel?: string
  maxSizeBytes?: number
}

function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUpload({ id, accept, value, onChange, helpLabel, maxSizeBytes }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [sizeError, setSizeError] = useState<string | null>(null)

  function handleFile(file: File | undefined) {
    if (!file) return
    if (maxSizeBytes && file.size > maxSizeBytes) {
      setSizeError(`"${file.name}" is ${formatFileSize(file.size)}, which is over the ${formatFileSize(maxSizeBytes)} limit.`)
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    setSizeError(null)
    onChange({
      fileId: `file-${Date.now()}`,
      fileName: file.name,
      fileType: file.type || 'application/octet-stream',
      fileUrl: URL.createObjectURL(file),
      fileSize: file.size,
    })
  }

  if (value) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3">
        <div className="flex items-center gap-2 truncate text-[15px] text-ink-900">
          <span aria-hidden>📄</span>
          <span className="truncate">{value.fileName}</span>
          <span className="shrink-0 text-sm text-ink-500">· {formatFileSize(value.fileSize)}</span>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="shrink-0 text-sm font-semibold text-brand-500 hover:text-brand-700"
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line bg-white px-4 py-8 text-center hover:border-brand-400 hover:bg-brand-50"
      >
        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-lg text-ink-700"
        >
          +
        </span>
        <span className="text-[15px] font-medium text-ink-900">Upload or drag &amp; drop a file</span>
        {helpLabel && <span className="text-sm text-ink-500">{helpLabel}</span>}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </button>
      {sizeError && (
        <p role="alert" className="text-sm font-medium text-danger-700">
          {sizeError}
        </p>
      )}
    </div>
  )
}
