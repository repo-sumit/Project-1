import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // PrepFire brand palette
        brand: {
          primary:   '#F97316', // orange-500  — fire/energy
          dark:      '#EA580C', // orange-600  — pressed state
          light:     '#FFF7ED', // orange-50   — backgrounds
          surface:   '#FFFFFF',
          muted:     '#F9FAFB', // gray-50
          border:    '#E5E7EB', // gray-200
          text:      '#111827', // gray-900
          subtle:    '#6B7280', // gray-500
          success:   '#22C55E', // green-500
          error:     '#EF4444', // red-500
          xp:        '#A855F7', // purple-500
          streak:    '#F97316', // orange
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Keep bottom nav above content
      spacing: {
        'nav': '64px',
      },
      animation: {
        'slide-up': 'slideUp 0.25s ease-out',
        'fade-in':  'fadeIn 0.15s ease-out',
        'bounce-in':'bounceIn 0.3s ease-out',
        'pulse-once':'pulseOnce 0.4s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%':   { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceIn: {
          '0%':   { transform: 'scale(0.8)', opacity: '0' },
          '60%':  { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        pulseOnce: {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
