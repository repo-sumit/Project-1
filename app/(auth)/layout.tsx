// Auth layout — no bottom navigation bar
// Clean, focused screens for onboarding

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  )
}
