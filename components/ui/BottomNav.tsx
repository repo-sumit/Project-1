'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  {
    href: '/home',
    label: 'Home',
    icon: (active: boolean) => (
      <svg className={`w-5 h-5 transition-colors ${active ? 'text-orange-500' : 'text-gray-400'}`}
        fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/practice',
    label: 'Practice',
    icon: (active: boolean) => (
      <svg className={`w-5 h-5 transition-colors ${active ? 'text-orange-500' : 'text-gray-400'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: '/progress',
    label: 'Progress',
    icon: (active: boolean) => (
      <svg className={`w-5 h-5 transition-colors ${active ? 'text-orange-500' : 'text-gray-400'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: (active: boolean) => (
      <svg className={`w-5 h-5 transition-colors ${active ? 'text-orange-500' : 'text-gray-400'}`}
        fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="
      fixed bottom-0 left-1/2 -translate-x-1/2
      w-full max-w-[430px]
      bg-white border-t border-gray-100
      flex items-center
      h-16
      z-50 shadow-[0_-1px_12px_rgba(0,0,0,0.06)]
    ">
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const isActive = pathname === href || (href !== '/home' && pathname?.startsWith(href))

        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-1 tap-target py-2"
          >
            {icon(isActive)}
            <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
