import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'

const ICON = { complete: '✅', missed: '❌', pending: '⏳' }

function SetsLabel({ sets }) {
  if (!sets || sets.length === 0) return null
  const total = sets.reduce((a, b) => a + b, 0)
  return (
    <span className="text-xs text-gray-600 ml-1" title={sets.join(' + ')}>({total})</span>
  )
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
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
        History
      </h2>
      <div className="flex flex-col gap-2">
        {days.map(day => {
          const label = new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric',
          })
          const gs = day.gerardStatus || 'pending'
          const ls = day.leoStatus || 'pending'
          return (
            <div
              key={day.date}
              className="bg-gray-800 rounded-xl px-4 py-3 flex items-center justify-between"
            >
              <span className="text-sm text-gray-300">{label}</span>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center">
                  <span className="text-gray-400 mr-1">G</span>
                  <span>{ICON[gs]}</span>
                  <SetsLabel sets={day.gerardSets} />
                </span>
                <span className="flex items-center">
                  <span className="text-gray-400 mr-1">L</span>
                  <span>{ICON[ls]}</span>
                  <SetsLabel sets={day.leoSets} />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
