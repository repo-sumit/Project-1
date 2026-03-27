// ─── localStorage helpers ────────────────────────────────────────────────────
// Safe wrappers that handle SSR (server has no localStorage) and
// JSON parse errors gracefully.

/**
 * Read a value from localStorage.
 * Returns null if key doesn't exist, SSR, or JSON is corrupt.
 */
export function getLocal<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

/**
 * Write a value to localStorage as JSON.
 */
export function setLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    // Storage quota exceeded or private browsing — fail silently
    console.warn('[PrepFire] localStorage write failed:', e)
  }
}

/**
 * Remove a key from localStorage.
 */
export function removeLocal(key: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(key)
}

/**
 * Clear ALL PrepFire keys from localStorage.
 * Used on logout or reset.
 */
export function clearPrepfireStorage(): void {
  if (typeof window === 'undefined') return
  const keys = Object.keys(window.localStorage).filter((k) =>
    k.startsWith('prepfire_')
  )
  keys.forEach((k) => window.localStorage.removeItem(k))
}

/**
 * Get today's date as a 'YYYY-MM-DD' string (local time).
 * Used to key the daily set cache.
 */
export function todayString(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Generate a UUID v4 without any external library.
 * Used to create local user IDs.
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
