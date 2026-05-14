import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          cyan: '#67e8f9',
          blue: '#60a5fa',
          violet: '#a78bfa',
          green: '#34d399',
        },
      },
      letterSpacing: {
        tightest: '-0.065em',
        tighter2: '-0.045em',
      },
    },
  },
  plugins: [],
}

export default config
