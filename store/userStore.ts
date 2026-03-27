import { create } from 'zustand'
import type { User, Streak } from '@/types'
import { getLocal, setLocal, removeLocal } from '@/lib/cache'
import { STORAGE_KEYS } from '@/lib/constants'

// ─── User Store ───────────────────────────────────────────────────────────────
// Holds the current user profile and streak.
// Hydrated from localStorage on app start.

interface UserStore {
  user: User | null
  streak: Streak

  // Actions
  setUser: (user: User) => void
  updateUser: (partial: Partial<User>) => void
  setStreak: (streak: Streak) => void
  clearUser: () => void
  hydrateFromStorage: () => void
}

const DEFAULT_STREAK: Streak = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  streak: DEFAULT_STREAK,

  setUser: (user) => {
    setLocal(STORAGE_KEYS.USER, user)
    set({ user })
  },

  updateUser: (partial) => {
    const current = get().user
    if (!current) return
    const updated = { ...current, ...partial }
    setLocal(STORAGE_KEYS.USER, updated)
    set({ user: updated })
  },

  setStreak: (streak) => {
    set({ streak })
  },

  clearUser: () => {
    removeLocal(STORAGE_KEYS.USER)
    set({ user: null, streak: DEFAULT_STREAK })
  },

  // Call this once on app mount to reload state from localStorage
  hydrateFromStorage: () => {
    const savedUser = getLocal<User>(STORAGE_KEYS.USER)
    if (savedUser) {
      set({ user: savedUser })
    }
  },
}))
