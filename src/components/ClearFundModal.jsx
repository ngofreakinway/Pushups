export default function ClearFundModal({ fundTotal, onConfirm, onClose }) {
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
          Dinner Fund
        </p>
        <h2 className="text-[22px] font-semibold leading-[1.18] tracking-[-0.4px] text-ink mb-1">
          Ready for dinner?
        </h2>
        <p className="text-sm font-medium leading-[1.71] text-ink-muted mb-6">
          Mark the fund as used and reset to $0.
        </p>
        <p className="text-[56px] font-bold leading-[1.18] tracking-[-1.6px] text-product-vault mb-8">
          ${fundTotal}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-[10px] px-[18px] rounded-lg bg-surface-2 text-ink-muted text-sm font-semibold leading-[1.29] hover:bg-surface-3 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-[10px] px-[18px] rounded-lg bg-white text-canvas text-sm font-semibold leading-[1.29] hover:bg-gray-100 transition-colors"
          >
            Clear Fund
          </button>
        </div>
      </div>
    </div>
  )
}
