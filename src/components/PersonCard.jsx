import { useState, useEffect } from 'react'

const STATUS_CONFIG = {
  pending: {
    eyebrow: 'Pending',
    dot: 'bg-ink-subtle',
    doneCls: 'bg-white text-canvas hover:bg-gray-100 active:bg-gray-200',
    doneLabel: 'Mark Done',
    missCls: 'bg-surface-2 text-ink hover:bg-surface-3',
    missLabel: 'Mark Miss',
  },
  complete: {
    eyebrow: 'Complete',
    dot: 'bg-product-nomad',
    doneCls: 'bg-product-nomad text-white',
    doneLabel: '✓ Done',
    missCls: 'bg-surface-2 text-ink hover:bg-surface-3',
    missLabel: 'Mark Miss',
  },
  missed: {
    eyebrow: 'Missed — $20 Added',
    dot: 'bg-product-consul',
    doneCls: 'bg-white text-canvas hover:bg-gray-100',
    doneLabel: 'Mark Done',
    missCls: 'bg-product-consul text-white',
    missLabel: '✗ Missed',
  },
}

export default function PersonCard({ person, status, sets = [], target, onMark, onSaveSets }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const [expanded, setExpanded] = useState(false)
  const [localSets, setLocalSets] = useState([''])

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
  const setsSummary = sets.length > 0 ? `${sets.join(' + ')} = ${savedTotal}` : null

  const handleSave = () => {
    onSaveSets(parsedSets)
    setExpanded(false)
  }

  return (
    <div className="bg-surface-1 border border-hairline rounded-xl p-6">

      {/* Card header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-subtle mb-1">
            {cfg.eyebrow}
          </p>
          <h3 className="text-[22px] font-semibold leading-[1.18] tracking-[-0.4px] text-ink">
            {person.name}
          </h3>
          {setsSummary && !expanded && (
            <p className="text-[13px] font-medium text-ink-subtle mt-1">{setsSummary} reps</p>
          )}
        </div>
        <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${cfg.dot}`} />
      </div>

      {/* Status buttons */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={handleDone}
          className={`flex-1 py-[10px] px-[18px] rounded-lg text-sm font-semibold leading-[1.29] transition-all active:scale-[0.98] ${cfg.doneCls}`}
        >
          {cfg.doneLabel}
        </button>
        <button
          onClick={handleMiss}
          className={`flex-1 py-[10px] px-[18px] rounded-lg text-sm font-semibold leading-[1.29] transition-all active:scale-[0.98] ${cfg.missCls}`}
        >
          {cfg.missLabel}
        </button>
      </div>

      {/* Log sets toggle */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-subtle hover:text-ink-muted transition-colors py-1 flex items-center justify-center gap-1.5"
      >
        <span>{expanded ? '▲' : '▼'}</span>
        <span>{expanded ? 'Hide Sets' : (setsSummary ? 'Edit Sets' : 'Log Sets')}</span>
      </button>

      {/* Set breakdown */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-hairline">
          <div className="flex flex-col gap-2 mb-4">
            {localSets.map((val, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-subtle w-12 flex-shrink-0">
                  Set {i + 1}
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={val}
                  onChange={e => updateSet(i, e.target.value)}
                  placeholder="0"
                  className="flex-1 bg-surface-2 border border-hairline rounded-lg px-4 py-[10px] text-ink text-sm text-center outline-none focus:border-accent-blue transition-colors"
                  min="1"
                />
                {localSets.length > 1 && (
                  <button
                    onClick={() => removeSet(i)}
                    className="text-ink-subtle hover:text-product-consul transition-colors text-xl leading-none w-6 flex-shrink-0"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <button
              onClick={addSet}
              className="text-[11px] font-semibold uppercase tracking-[0.6px] text-accent-blue hover:opacity-80 transition-opacity"
            >
              + Add Set
            </button>
            <span className={`text-[13px] font-semibold tabular-nums ${
              localTotal >= target ? 'text-product-nomad' : 'text-ink-subtle'
            }`}>
              {localTotal} / {target} reps
            </span>
          </div>

          <button
            onClick={handleSave}
            disabled={parsedSets.length === 0}
            className="w-full py-[10px] px-[18px] rounded-lg bg-white text-canvas text-sm font-semibold leading-[1.29] hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            Save Sets
          </button>
        </div>
      )}
    </div>
  )
}
