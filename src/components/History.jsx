import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'

const STATUS_LABEL = { complete: 'Done', missed: 'Miss', pending: '—' }
const STATUS_COLOR = {
  complete: 'text-product-nomad',
  missed: 'text-product-consul',
  pending: 'text-ink-subtle',
}

function SetsTotal({ sets }) {
  if (!sets || sets.length === 0) return null
  const total = sets.reduce((a, b) => a + b, 0)
  return <span className="text-ink-subtle"> ({total})</span>
}

export default function History() {
  const [days, setDays] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'days'), orderBy('__name__', 'desc'), limit(30))
    return onSnapshot(q, snap => {
      setDays(snap.docs.map(d => ({ date: d.id, ...d.data() })))
    })
  }, [])

  if (days.length === 0) return null

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-subtle mb-4">
        History
      </p>
      <div className="bg-surface-1 border border-hairline rounded-xl overflow-hidden">
        {days.map((day, i) => {
          const label = new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric',
          })
          const gs = day.gerardStatus || 'pending'
          const ls = day.leoStatus || 'pending'
          return (
            <div
              key={day.date}
              className={`flex items-center justify-between px-5 py-3.5 ${
                i < days.length - 1 ? 'border-b border-hairline-soft' : ''
              }`}
            >
              <span className="text-[13px] font-medium text-ink-muted">{label}</span>
              <div className="flex gap-5 text-[13px] font-semibold">
                <span>
                  <span className="text-ink-subtle">G </span>
                  <span className={STATUS_COLOR[gs]}>{STATUS_LABEL[gs]}</span>
                  <SetsTotal sets={day.gerardSets} />
                </span>
                <span>
                  <span className="text-ink-subtle">L </span>
                  <span className={STATUS_COLOR[ls]}>{STATUS_LABEL[ls]}</span>
                  <SetsTotal sets={day.leoSets} />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
