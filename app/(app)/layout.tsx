'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { getLocal } from '@/lib/cache'
import { STORAGE_KEYS } from '@/lib/constants'
import type { User } from '@/types'
import BottomNav from '@/components/ui/BottomNav'

// ─── App Shell Layout ─────────────────────────────────────────────────────────
// Renders for all /home, /progress, /profile routes.
// Handles auth guard: if no user in localStorage → redirect to onboarding.
// Hydrates the user store from localStorage on first load.

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, hydrateFromStorage } = useUserStore()

  useEffect(() => {
    hydrateFromStorage()
  }, [hydrateFromStorage])

  useEffect(() => {
    // Guard: if not onboarded, redirect to onboarding
    const saved = getLocal<User>(STORAGE_KEYS.USER)
    if (!saved?.onboardingComplete) {
      router.replace('/onboarding/class')
    }
  }, [router])

  // Don't show bottom nav during practice session (full-screen experience)
  const isPracticeSession = pathname?.startsWith('/practice/session')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page content */}
      <main className={isPracticeSession ? '' : 'page-content'}>
        {children}
      </main>

      {/* Bottom navigation — hidden during active session */}
      {!isPracticeSession && <BottomNav />}
    </div>
  )
}
