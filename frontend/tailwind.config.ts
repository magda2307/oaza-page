import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-display)', 'Georgia', 'serif'],
      },
      colors: {
        // Oaza brand palette
        'oaza-green': '#2D6A4F',
        'oaza-warm':  '#F4E8D1',
        'oaza-rust':  '#C1440E',
        // Legacy brand scale — used by existing components
        brand: {
          50:  '#f0f7f4',
          100: '#d9ece4',
          200: '#b3d9c9',
          300: '#7fbdaa',
          400: '#4d9e86',
          500: '#2D6A4F',  // maps to oaza-green
          600: '#245841',
          700: '#1b4531',
          800: '#133222',
          900: '#0a2015',
        },
      },
    },
  },
  plugins: [],
}

export default config
