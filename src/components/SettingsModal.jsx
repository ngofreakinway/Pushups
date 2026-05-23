import { useState } from 'react'

export default function SettingsModal({ currentTarget, onSave, onClose }) {
  const [value, setValue] = useState(String(currentTarget))

  const handleSave = () => {
    const num = parseInt(value, 10)
    if (!isNaN(num) && num > 0) {
      onSave(num)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-surface-1 border border-hairline rounded-t-3xl w-full max-w-md p-6 pb-12"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-8 h-0.5 bg-ink-subtle rounded-full mx-auto mb-6" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-subtle mb-2">
          Configuration
        </p>
        <h2 className="text-[22px] font-semibold leading-[1.18] tracking-[-0.4px] text-ink mb-1">
          Daily Target
        </h2>
        <p className="text-sm font-medium leading-[1.71] text-ink-muted mb-6">
          Update when you and Leo agree to raise the bar.
        </p>
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full bg-surface-2 border border-hairline rounded-lg px-4 py-[10px] text-ink text-[28px] font-semibold text-center mb-6 outline-none focus:border-accent-blue transition-colors"
          min="1"
          autoFocus
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-[10px] px-[18px] rounded-lg bg-surface-2 text-ink-muted text-sm font-semibold leading-[1.29] hover:bg-surface-3 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-[10px] px-[18px] rounded-lg bg-white text-canvas text-sm font-semibold leading-[1.29] hover:bg-gray-100 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
