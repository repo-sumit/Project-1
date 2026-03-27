'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { getSubjectById } from '@/lib/constants'
import { clearPrepfireStorage } from '@/lib/cache'

export default function ProfilePage() {
  const router = useRouter()
  const { user, clearUser } = useUserStore()
  const [showConfirmReset, setShowConfirmReset] = useState(false)

  function handleReset() {
    clearUser()
    clearPrepfireStorage()
    router.replace('/onboarding/class')
  }

  if (!user) return null

  return (
    <div className="px-4 pt-12 pb-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      </div>

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
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Subjects
        </h2>
        <div className="flex flex-wrap gap-2">
          {user.subjectIds.map((id) => {
            const subject = getSubjectById(id)
            if (!subject) return null
            return (
              <span
                key={id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium"
              >
                {subject.icon} {subject.name}
              </span>
            )
          })}
        </div>
        <button
          onClick={() => router.push('/onboarding/subjects')}
          className="mt-4 text-sm text-orange-500 font-medium"
        >
          Change subjects →
        </button>
      </div>

      {/* Settings placeholder */}
      <div className="bg-white rounded-3xl p-5 shadow-sm mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Settings
        </h2>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-700">Daily reminder</span>
          <span className="text-sm text-gray-400">Coming soon</span>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-gray-50">
          <span className="text-sm text-gray-700">Notifications</span>
          <span className="text-sm text-gray-400">Coming soon</span>
        </div>
      </div>

      {/* App info */}
      <div className="bg-white rounded-3xl p-5 shadow-sm mb-4">
        <div className="text-xs text-gray-400 space-y-1">
          <div>PrepFire MVP · V1</div>
          <div>CBSE · Classes 9–12</div>
          <div>User ID: {user.id.slice(0, 8)}...</div>
        </div>
      </div>

      {/* Reset / Start over */}
      {!showConfirmReset ? (
        <button
          onClick={() => setShowConfirmReset(true)}
          className="w-full py-3 text-sm text-gray-400 border border-gray-200 rounded-2xl mt-2"
        >
          Reset & Start Over
        </button>
      ) : (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mt-2">
          <p className="text-sm text-red-700 mb-3 text-center">
            This will delete all your local data. Are you sure?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirmReset(false)}
              className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl"
            >
              Yes, Reset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
