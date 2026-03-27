import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PrepFire — CBSE Daily Practice',
  description: 'Daily PYQ practice for CBSE students. 10 questions, 8 minutes, every day.',
  // PWA meta tags
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PrepFire',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Prevent zoom — important for quiz tap targets
  userScalable: false,
  themeColor: '#F97316',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Supabase for faster API calls */}
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link
            rel="preconnect"
            href={process.env.NEXT_PUBLIC_SUPABASE_URL}
          />
        )}
        {/* Load Inter font from Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-white min-h-screen">
        {/* Max-width container for desktop — app feels native on mobile */}
        <div className="mx-auto max-w-[430px] min-h-screen relative">
          {children}
        </div>
      </body>
    </html>
  )
}
