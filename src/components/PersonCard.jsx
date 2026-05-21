import { useState, useEffect } from 'react'

const STATUS = {
  pending: { label: 'Pending', cardCls: 'bg-gray-800', dotCls: 'bg-yellow-400' },
  complete: { label: 'Done!', cardCls: 'bg-green-950 border border-green-700', dotCls: 'bg-green-400' },
  missed: { label: 'Missed — $20 added', cardCls: 'bg-red-950 border border-red-700', dotCls: 'bg-red-400' },
}

export default function PersonCard({ person, status, sets = [], target, onMark, onSaveSets }) {
  const cfg = STATUS[status] || STATUS.pending
  const [expanded, setExpanded] = useState(false)
  const [localSets, setLocalSets] = useState([''])

  // Sync saved sets into local state when the card is expanded
  useEffect(() => {
    if (expanded) {
      setLocalSets(sets.length > 0 ? sets.map(String) : [''])
    }
  }, [expanded])

  const handleDone = () => onMark(status === 'complete' ? 'pending' : 'complete')
  const handleMiss = () => onMark(status === 'missed' ? 'pending' : 'missed')

  const addSet = () => setLocalSets(prev => [...prev, ''])
  const removeSet = i => setLocalSets(prev => prev.filter((_, idx) => idx !== i))
  const updateSet = (i, val) => setLocalSets(prev => prev.map((s, idx) => idx === i ? val : s))

  const parsedSets = localSets.map(s => parseInt(s, 10)).filter(n => !isNaN(n) && n > 0)
  const localTotal = localSets.reduce((sum, s) => sum + (parseInt(s, 10) || 0), 0)
  const savedTotal = sets.reduce((sum, n) => sum + n, 0)

  const handleSave = () => {
    onSaveSets(parsedSets)
    setExpanded(false)
  }

  const setsSummary = sets.length > 0
    ? sets.join(' + ') + ' = ' + savedTotal
    : null

  return (
    <div className={`rounded-2xl p-5 transition-colors duration-200 ${cfg.cardCls}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${cfg.dotCls}`} />
        <div>
          <div className="font-bold text-xl">{person.name}</div>
          <div className="text-sm text-gray-400">{cfg.label}</div>
          {setsSummary && !expanded && (
            <div className="text-xs text-gray-500 mt-0.5">{setsSummary} reps</div>
          )}
        </div>
      </div>

      {/* Status buttons */}
      <div className="flex gap-2 mb-3">
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

      {/* Log sets toggle */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors py-1 flex items-center justify-center gap-1.5"
      >
        <span>{expanded ? '▲' : '▼'}</span>
        <span>{expanded ? 'Hide sets' : (setsSummary ? 'Edit sets' : 'Log sets')}</span>
      </button>

      {/* Set breakdown */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex flex-col gap-2 mb-3">
            {localSets.map((val, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-10 flex-shrink-0">Set {i + 1}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={val}
                  onChange={e => updateSet(i, e.target.value)}
                  placeholder="0"
                  className="flex-1 bg-gray-700 rounded-lg px-3 py-2.5 text-white text-sm text-center outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
                {localSets.length > 1 && (
                  <button
                    onClick={() => removeSet(i)}
                    className="text-gray-600 hover:text-red-400 transition-colors text-xl leading-none w-7 flex-shrink-0"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-3">
            <button
              onClick={addSet}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              + Add set
            </button>
            <span className={`text-xs font-semibold tabular-nums ${
              localTotal >= target ? 'text-green-400' : 'text-gray-400'
            }`}>
              {localTotal} / {target} reps
            </span>
          </div>

          <button
            onClick={handleSave}
            disabled={parsedSets.length === 0}
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save sets
          </button>
        </div>
      )}
    </div>
  )
}
