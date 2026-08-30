import type { FileResponseValue, VideoFieldValue } from '../../types'
import { FileUpload } from '../ui/FileUpload'
import { TextInput } from '../ui/inputs'
import { Tooltip } from '../ui/Tooltip'
import { HelpIcon } from '../ui/icons'

interface VideoUploadFieldProps {
  id: string
  value: VideoFieldValue | null
  onChange: (value: VideoFieldValue | null) => void
  accept?: string
  maxSizeBytes?: number
}

function VideoLinkHelp() {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-semibold text-ink-900">How to share a video link</p>
      <ol className="list-decimal space-y-1 pl-4">
        <li>Upload your video to a streaming platform of your choice.</li>
        <li>Make sure the sharing/visibility setting allows anyone with the link to view it.</li>
        <li>Copy the video's link and paste it here.</li>
      </ol>
    </div>
  )
}

export function VideoUploadField({ id, value, onChange, accept, maxSizeBytes }: VideoUploadFieldProps) {
  const mode = value?.mode ?? 'file'

  function selectMode(next: 'file' | 'link') {
    onChange({ mode: next, file: value?.file, url: value?.url })
  }

  function handleFileChange(file: FileResponseValue | null) {
    onChange({ mode: 'file', file: file ?? undefined, url: value?.url })
  }

  function handleUrlChange(url: string) {
    onChange({ mode: 'link', file: value?.file, url })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="inline-flex w-fit rounded-full border border-line bg-surface p-1 text-sm font-semibold text-ink-500">
        <button
          type="button"
          onClick={() => selectMode('file')}
          className={`rounded-full px-3 py-1.5 ${mode === 'file' ? 'bg-white text-ink-900 shadow-sm' : ''}`}
        >
          Upload video
        </button>
        <button
          type="button"
          onClick={() => selectMode('link')}
          className={`rounded-full px-3 py-1.5 ${mode === 'link' ? 'bg-white text-ink-900 shadow-sm' : ''}`}
        >
          Paste a link
        </button>
      </div>

      {mode === 'file' ? (
        <FileUpload
          id={id}
          accept={accept}
          maxSizeBytes={maxSizeBytes}
          value={value?.file ?? null}
          onChange={handleFileChange}
          helpLabel={accept ? `Accepted: ${accept}` : undefined}
        />
      ) : (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <TextInput
              id={id}
              type="url"
              placeholder="Paste your video link here"
              value={value?.url ?? ''}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
            <Tooltip content={<VideoLinkHelp />}>
              <button
                type="button"
                aria-label="How to share a video link"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-400 hover:bg-surface hover:text-brand-500"
              >
                <HelpIcon width={18} height={18} />
              </button>
            </Tooltip>
          </div>
          <p className="text-xs text-ink-500">
            Paste a link to your video from any streaming platform of your choice.
          </p>
        </div>
      )}
    </div>
  )
}
