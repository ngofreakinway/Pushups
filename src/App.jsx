import { useState, useEffect } from 'react'
import { db } from './firebase'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import PersonCard from './components/PersonCard'
import History from './components/History'
import SettingsModal from './components/SettingsModal'
import ClearFundModal from './components/ClearFundModal'

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
  const [showClearFund, setShowClearFund] = useState(false)
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
    await setDoc(doc(db, 'days', dateKey), { [`${personId}Status`]: newStatus }, { merge: true })
    if (fundDelta !== 0) {
      await setDoc(doc(db, 'meta', 'settings'), {
        fundTotal: Math.max(0, settings.fundTotal + fundDelta),
      }, { merge: true })
    }
  }

  const saveSets = async (personId, sets) => {
    await setDoc(doc(db, 'days', dateKey), { [`${personId}Sets`]: sets }, { merge: true })
  }

  const updateTarget = async newTarget => {
    await setDoc(doc(db, 'meta', 'settings'), { target: newTarget }, { merge: true })
  }

  const adjustFund = async delta => {
    await setDoc(doc(db, 'meta', 'settings'), {
      fundTotal: Math.max(0, settings.fundTotal + delta),
    }, { merge: true })
  }

  const clearFund = async () => {
    await setDoc(doc(db, 'meta', 'settings'), { fundTotal: 0 }, { merge: true })
    setShowClearFund(false)
  }

  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-subtle">
          Loading...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="max-w-md mx-auto px-5 pb-24">

        {/* Header */}
        <div className="pt-14 pb-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-subtle mb-3">
            Daily Tracker
          </p>
          <h1 className="text-[40px] font-bold leading-[1.19] tracking-[-1px] text-ink mb-2">
            Push-up Pact
          </h1>
          <p className="text-sm font-medium leading-[1.71] text-ink-muted">{dateLabel}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          <div className="bg-surface-1 border border-hairline rounded-xl p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-subtle mb-3">
              Today's Goal
            </p>
            <p className="text-[40px] font-semibold leading-[1.19] tracking-[-1px] text-ink">
              {settings.target}
            </p>
            <p className="text-[13px] font-medium text-ink-subtle mt-1">push-ups</p>
          </div>

          <button
            onClick={() => settings.fundTotal > 0 && setShowClearFund(true)}
            className={`bg-surface-1 border border-hairline rounded-xl p-5 text-left transition-colors ${
              settings.fundTotal > 0
                ? 'hover:bg-surface-2 cursor-pointer'
                : 'cursor-default'
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-subtle mb-3">
              Dinner Fund
            </p>
            <p className={`text-[40px] font-semibold leading-[1.19] tracking-[-1px] ${
              settings.fundTotal > 0 ? 'text-product-vault' : 'text-ink'
            }`}>
              ${settings.fundTotal}
            </p>
            <p className="text-[13px] font-medium text-ink-subtle mt-1">
              {settings.fundTotal > 0 ? 'tap to use' : 'no misses yet'}
            </p>
          </button>
        </div>

        {/* Today */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-subtle mb-4">
          Today
        </p>
        <div className="flex flex-col gap-4 mb-10">
          {PEOPLE.map(person => (
            <PersonCard
              key={person.id}
              person={person}
              status={todayData?.[`${person.id}Status`] || 'pending'}
              sets={todayData?.[`${person.id}Sets`] || []}
              target={settings.target}
              onMark={status => markStatus(person.id, status)}
              onSaveSets={sets => saveSets(person.id, sets)}
            />
          ))}
        </div>

        {/* History */}
        <History />

        {/* Settings */}
        <div className="mt-10 border-t border-hairline pt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-ink-subtle mb-4">
            Settings
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowSettings(true)}
              className="w-full py-[10px] px-[18px] rounded-lg bg-surface-2 text-ink text-sm font-semibold leading-[1.29] hover:bg-surface-3 transition-colors text-left"
            >
              Change daily target
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => adjustFund(-20)}
                className="flex-1 py-[10px] px-[18px] rounded-lg bg-surface-2 text-ink-muted text-sm font-semibold leading-[1.29] hover:bg-surface-3 transition-colors"
              >
                Fund −$20
              </button>
              <button
                onClick={() => adjustFund(20)}
                className="flex-1 py-[10px] px-[18px] rounded-lg bg-surface-2 text-ink-muted text-sm font-semibold leading-[1.29] hover:bg-surface-3 transition-colors"
              >
                Fund +$20
              </button>
            </div>
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
      {showClearFund && (
        <ClearFundModal
          fundTotal={settings.fundTotal}
          onConfirm={clearFund}
          onClose={() => setShowClearFund(false)}
        />
      )}
    </div>
  )
}
