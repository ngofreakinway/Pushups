import { useState, useEffect } from 'react'
import { db } from './firebase'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import PersonCard from './components/PersonCard'
import History from './components/History'
import SettingsModal from './components/SettingsModal'

const localDateKey = () => {
  const d = new Date()
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

const PEOPLE = [
  { id: 'gerard', name: 'Gerard' },
  { id: 'leo', name: 'Leo' },
]

const DEFAULT_SETTINGS = { target: 50, fundTotal: 0 }

export default function App() {
  const [todayData, setTodayData] = useState(null)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)

  const dateKey = localDateKey()

  useEffect(() => {
    const unsub1 = onSnapshot(doc(db, 'days', dateKey), snap => {
      setTodayData(snap.exists() ? snap.data() : {})
      setLoading(false)
    })
    const unsub2 = onSnapshot(doc(db, 'meta', 'settings'), snap => {
      if (snap.exists()) setSettings({ ...DEFAULT_SETTINGS, ...snap.data() })
    })
    return () => { unsub1(); unsub2() }
  }, [dateKey])

  const markStatus = async (personId, newStatus) => {
    const prevStatus = todayData?.[`${personId}Status`] || 'pending'
    if (prevStatus === newStatus) return

    let fundDelta = 0
    if (newStatus === 'missed') fundDelta = 20
    else if (prevStatus === 'missed') fundDelta = -20

    await setDoc(doc(db, 'days', dateKey), {
      [`${personId}Status`]: newStatus,
    }, { merge: true })

    if (fundDelta !== 0) {
      await setDoc(doc(db, 'meta', 'settings'), {
        fundTotal: Math.max(0, settings.fundTotal + fundDelta),
      }, { merge: true })
    }
  }

  const updateTarget = async newTarget => {
    await setDoc(doc(db, 'meta', 'settings'), { target: newTarget }, { merge: true })
  }

  const adjustFund = async delta => {
    const next = Math.max(0, settings.fundTotal + delta)
    await setDoc(doc(db, 'meta', 'settings'), { fundTotal: next }, { merge: true })
  }

  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-md mx-auto px-4 pb-16">

        {/* Header */}
        <div className="pt-14 pb-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Push-up Pact</h1>
          <p className="text-gray-400 mt-1 text-sm">{dateLabel}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-800 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold">{settings.target}</div>
            <div className="text-xs text-gray-400 mt-1">push-ups today</div>
          </div>
          <div className="bg-gray-800 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">${settings.fundTotal}</div>
            <div className="text-xs text-gray-400 mt-1">in the fund</div>
          </div>
        </div>

        {/* Person cards */}
        <div className="flex flex-col gap-4 mb-8">
          {PEOPLE.map(person => (
            <PersonCard
              key={person.id}
              person={person}
              status={todayData?.[`${person.id}Status`] || 'pending'}
              onMark={status => markStatus(person.id, status)}
            />
          ))}
        </div>

        {/* History */}
        <History />

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => setShowSettings(true)}
            className="w-full py-3 rounded-2xl bg-gray-800 text-gray-300 text-sm font-semibold hover:bg-gray-700 active:bg-gray-600 transition-colors"
          >
            Change daily target
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => adjustFund(-20)}
              className="flex-1 py-3 rounded-2xl bg-gray-800 text-gray-400 text-sm font-semibold hover:bg-gray-700 active:bg-gray-600 transition-colors"
            >
              Fund -$20
            </button>
            <button
              onClick={() => adjustFund(20)}
              className="flex-1 py-3 rounded-2xl bg-gray-800 text-gray-400 text-sm font-semibold hover:bg-gray-700 active:bg-gray-600 transition-colors"
            >
              Fund +$20
            </button>
          </div>
        </div>

      </div>

      {showSettings && (
        <SettingsModal
          currentTarget={settings.target}
          onSave={updateTarget}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
