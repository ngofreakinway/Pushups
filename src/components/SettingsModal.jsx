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
      className="fixed inset-0 bg-black/60 flex items-end justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-t-3xl w-full max-w-md p-6 pb-12"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-6" />
        <h2 className="text-lg font-bold mb-2">Daily Push-up Target</h2>
        <p className="text-sm text-gray-400 mb-4">
          Update when you and Leo agree to raise the bar.
        </p>
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full bg-gray-700 rounded-xl px-4 py-4 text-white text-2xl text-center mb-5 outline-none focus:ring-2 focus:ring-blue-500"
          min="1"
          autoFocus
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl bg-gray-700 text-gray-300 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
