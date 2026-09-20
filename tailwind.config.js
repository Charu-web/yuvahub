/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ea580c',
          hover: '#c2410c',
          light: '#fff7ed',
          dark: '#9a3412',
        },
        brand: {
          orange: '#FF5400',
          darkOrange: '#EA580C',
          lightOrange: '#FFF8F3',
          borderOrange: '#FFE6D5',
        }
      },
      fontFamily: {
        sans: ['Mukta', 'Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        mr: ['Mukta', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 8px 25px rgba(255, 84, 0, 0.06)',
        'card-hover': '0 12px 30px rgba(255, 84, 0, 0.12)',
        'badge': '0 2px 8px rgba(234, 88, 12, 0.25)',
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 70s linear infinite',
        'marquee-mobile': 'marqueeMobile 25s linear infinite',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeMobile: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
