'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { getLocal } from '@/lib/cache'
import { STORAGE_KEYS } from '@/lib/constants'
import type { User } from '@/types'
import BottomNav from '@/components/ui/BottomNav'

// ─── App Shell — wraps all authenticated app pages ───────────────────────────
// Guards: redirects to onboarding if user has not completed setup.
// Hides bottom nav during active practice session (full-screen).

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const { hydrateFromStorage } = useUserStore()

  // Hydrate Zustand store from localStorage on first render
  useEffect(() => {
    hydrateFromStorage()
  }, [hydrateFromStorage])

  // Guard: if not onboarded, send to onboarding
  useEffect(() => {
    const saved = getLocal<User>(STORAGE_KEYS.USER)
    if (!saved?.onboardingComplete) {
      router.replace('/onboarding/class')
    }
  }, [router])

  // Hide bottom nav during active session (immersive practice screen)
  const hideNav = pathname?.startsWith('/practice/session')
               || pathname?.startsWith('/leaderboard')

  return (
    <div className="min-h-screen bg-gray-50">
      <main className={hideNav ? '' : 'page-content'}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
