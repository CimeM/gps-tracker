/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
          opacity: 'rgb(var(--primary-rgb) / <alpha-value>)'
        },
        accent: {
          DEFAULT: 'var(--accent)',
          dark: 'var(--accent-dark)'
        },
        text: {
          DEFAULT: 'var(--text)',
          light: 'var(--text-light)'
        },
        background: 'var(--background)',
        card: 'var(--card)',
        border: 'var(--border)',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      height: {
        'screen-90': '90vh',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};