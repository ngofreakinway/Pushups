export default function ClearFundModal({ fundTotal, onConfirm, onClose }) {
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
        <h2 className="text-lg font-bold mb-2">Dinner time?</h2>
        <p className="text-gray-400 text-sm mb-2">
          Mark the fund as used and reset to $0.
        </p>
        <p className="text-4xl font-extrabold text-green-400 mb-6">${fundTotal}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl bg-gray-700 text-gray-300 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 rounded-2xl bg-green-600 text-white font-semibold hover:bg-green-500 transition-colors"
          >
            Clear Fund
          </button>
        </div>
      </div>
    </div>
  )
}
