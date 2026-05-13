/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mit: {
          50: '#f0fbfc',
          100: '#d6f4f7',
          200: '#a8e7ee',
          300: '#74d5e0',
          400: '#3fbecf',
          500: '#0ea5b7',
          600: '#0a8497',
          700: '#0a6776',
          800: '#0c525e',
          900: '#0e434d',
        },
        plum: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
      },
      fontFamily: {
        display: ['"Nunito"', 'system-ui', 'sans-serif'],
        sans: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 14px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)',
        pop: '0 10px 30px -10px rgba(14, 165, 183, 0.45)',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '60%': { transform: 'scale(1.04)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        drift: {
          '0%': { transform: 'translateY(0) rotate(0)' },
          '50%': { transform: 'translateY(-22px) rotate(8deg)' },
          '100%': { transform: 'translateY(0) rotate(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        floatUp: 'floatUp 240ms ease-out both',
        pop: 'pop 280ms cubic-bezier(.2,.9,.3,1.3) both',
        drift: 'drift 7s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
