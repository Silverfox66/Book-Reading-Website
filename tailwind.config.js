/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0f1024',
          900: '#171933',
        },
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        quest: {
          purple: '#7c3aed',
          violet: '#8b5cf6',
          teal: '#14b8a6',
          gold: '#f5b62e',
          rose: '#fb7185',
          sky: '#38bdf8',
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        pop: '0 8px 0 0 rgba(0,0,0,0.15)',
        card: '0 10px 30px -10px rgba(30, 20, 60, 0.25)',
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        'coin-spin': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-40px)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.35s cubic-bezier(.34,1.56,.64,1) both',
        'coin-spin': 'coin-spin 0.9s linear infinite',
        'float-up': 'float-up 1.2s ease-out forwards',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
