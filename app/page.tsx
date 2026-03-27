'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getLocal } from '@/lib/cache'
import { STORAGE_KEYS } from '@/lib/constants'
import type { User } from '@/types'

// ─── Root Page — Redirect Logic ──────────────────────────────────────────────
// Checks localStorage → routes to onboarding or home.
// Uses a client component because localStorage is browser-only.

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const user = getLocal<User>(STORAGE_KEYS.USER)
    if (user?.onboardingComplete) {
      router.replace('/home')
    } else {
      router.replace('/onboarding/class')
    }
  }, [router])

  // Show a spinner while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Logo mark */}
        <div className="text-5xl">🔥</div>
        <div className="w-6 h-6 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )
}
