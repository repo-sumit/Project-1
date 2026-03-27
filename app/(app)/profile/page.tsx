'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { getSubjectById } from '@/lib/constants'
import { clearPrepfireStorage } from '@/lib/cache'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function ProfilePage() {
  const router = useRouter()
  const { user, clearUser } = useUserStore()
  const [showConfirmReset,  setShowConfirmReset]  = useState(false)
  const [showDbGuide,       setShowDbGuide]       = useState(false)

  function handleReset() {
    clearUser()
    clearPrepfireStorage()
    router.replace('/onboarding/class')
  }

  if (!user) return null

  return (
    <div className="px-4 pt-12 pb-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      </div>

      {/* Demo mode banner */}
      {!isSupabaseConfigured && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">⚠️</span>
                <span className="text-sm font-semibold text-amber-800">Demo Mode</span>
              </div>
              <p className="text-xs text-amber-700">
                Using mock questions. Connect Supabase to use real questions and save your progress.
              </p>
            </div>
            <button
              onClick={() => setShowDbGuide(!showDbGuide)}
              className="flex-shrink-0 text-xs font-semibold text-amber-700 border border-amber-300 px-2.5 py-1.5 rounded-lg"
            >
              Setup →
            </button>
          </div>

          {/* DB setup guide */}
          {showDbGuide && (
            <div className="mt-4 pt-4 border-t border-amber-200">
              <p className="text-xs font-semibold text-amber-800 mb-3">
                🔌 Connect Supabase in 4 steps:
              </p>
              <ol className="text-xs text-amber-700 space-y-2.5 list-none">
                <li className="flex gap-2">
                  <span className="font-bold text-amber-600 w-5 shrink-0">1.</span>
                  <span>Go to <strong>supabase.com</strong> → Create a free project</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-amber-600 w-5 shrink-0">2.</span>
                  <span>SQL Editor → New Query → paste <strong>supabase/schema.sql</strong> → Run</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-amber-600 w-5 shrink-0">3.</span>
                  <span>Paste <strong>supabase/seed.sql</strong> → Run (adds 30 questions)</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-amber-600 w-5 shrink-0">4.</span>
                  <span>Settings → API → copy URL + keys → add to <strong>.env.local</strong>:</span>
                </li>
              </ol>
              <div className="mt-3 bg-amber-100 rounded-xl p-3 font-mono text-[10px] text-amber-900 leading-relaxed break-all">
                NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co<br/>
                NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...<br/>
                SUPABASE_SERVICE_ROLE_KEY=eyJ...
              </div>
              <p className="text-[11px] text-amber-600 mt-2">
                Then restart the dev server (<code>npm run dev</code>) and reload.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Connected badge */}
      {isSupabaseConfigured && (
        <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-2.5 mb-4 flex items-center gap-2">
          <span className="text-green-500">✓</span>
          <span className="text-xs font-medium text-green-700">Supabase connected — progress is saved</span>
        </div>
      )}

      {/* Avatar + name */}
      <div className="flex items-center gap-4 bg-white rounded-3xl p-5 shadow-sm mb-4">
        <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-2xl font-bold text-orange-600">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-bold text-gray-900 text-lg">{user.name}</div>
          <div className="text-sm text-gray-500">Class {user.classLevel} · CBSE</div>
        </div>
      </div>

      {/* Subjects */}
      <div className="bg-white rounded-3xl p-5 shadow-sm mb-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Subjects</h2>
        <div className="flex flex-wrap gap-2">
          {user.subjectIds.map((id) => {
            const subject = getSubjectById(id)
            if (!subject) return null
            return (
              <span key={id} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
                {subject.icon} {subject.name}
              </span>
            )
          })}
        </div>
        <button
          onClick={() => router.push('/onboarding/subjects')}
          className="mt-3 text-sm text-orange-500 font-medium"
        >
          Change subjects →
        </button>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-3xl p-5 shadow-sm mb-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Settings</h2>
        {[
          { label: 'Daily reminder', value: 'Coming soon' },
          { label: 'Notifications',  value: 'Coming soon' },
          { label: 'Dark mode',      value: 'Coming soon' },
        ].map((item, i, arr) => (
          <div key={item.label} className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
            <span className="text-sm text-gray-700">{item.label}</span>
            <span className="text-xs text-gray-400">{item.value}</span>
          </div>
        ))}
      </div>

      {/* App info */}
      <div className="bg-white rounded-3xl p-5 shadow-sm mb-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">About</h2>
        <div className="text-xs text-gray-400 space-y-1.5">
          <div>PrepFire · V1 · CBSE Classes 9–12</div>
          <div>User ID: <span className="font-mono">{user.id.slice(0, 12)}…</span></div>
          <div>Mode: {isSupabaseConfigured ? '🟢 Live (Supabase)' : '🟡 Demo (mock data)'}</div>
        </div>
      </div>

      {/* Reset */}
      {!showConfirmReset ? (
        <button
          onClick={() => setShowConfirmReset(true)}
          className="w-full py-3 text-sm text-gray-400 border border-gray-200 rounded-2xl mt-2"
        >
          Reset &amp; Start Over
        </button>
      ) : (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mt-2">
          <p className="text-sm text-red-700 mb-3 text-center font-medium">
            Delete all local data and restart onboarding?
          </p>
          <div className="flex gap-3">
            <button onClick={() => setShowConfirmReset(false)} className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl">Cancel</button>
            <button onClick={handleReset} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl">Yes, Reset</button>
          </div>
        </div>
      )}
    </div>
  )
}
