const STATUS = {
  pending: { label: 'Pending', cardCls: 'bg-gray-800', dotCls: 'bg-yellow-400' },
  complete: { label: 'Done!', cardCls: 'bg-green-950 border border-green-700', dotCls: 'bg-green-400' },
  missed: { label: 'Missed — $20 added', cardCls: 'bg-red-950 border border-red-700', dotCls: 'bg-red-400' },
}

export default function PersonCard({ person, status, onMark }) {
  const cfg = STATUS[status] || STATUS.pending

  const handleDone = () => onMark(status === 'complete' ? 'pending' : 'complete')
  const handleMiss = () => onMark(status === 'missed' ? 'pending' : 'missed')

  return (
    <div className={`rounded-2xl p-5 transition-colors duration-200 ${cfg.cardCls}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${cfg.dotCls}`} />
        <div>
          <div className="font-bold text-xl">{person.name}</div>
          <div className="text-sm text-gray-400">{cfg.label}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleDone}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
            status === 'complete'
              ? 'bg-green-500 text-white shadow-lg shadow-green-900'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          {status === 'complete' ? '✓ Done' : 'Mark Done'}
        </button>
        <button
          onClick={handleMiss}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
            status === 'missed'
              ? 'bg-red-500 text-white shadow-lg shadow-red-900'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          {status === 'missed' ? '✗ Missed' : 'Mark Miss'}
        </button>
      </div>
    </div>
  )
}
