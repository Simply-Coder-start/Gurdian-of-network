/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#070A0D',
        panel: '#13191F',
        surface: '#1B2025',
        surfaceHigh: '#252A30',
        surfaceHighest: '#30353B',
        border: '#1C3B3B',
        borderSubtle: '#283138',
        outlineVariant: '#3B4A48',
        primary: '#51F0E3',
        primaryContainer: '#22D3C7',
        primaryFixed: '#5EF9EC',
        secondary: '#BBC9CB',
        tertiary: '#BFE0DF',
        warning: '#FFB963',
        error: '#FF4450',
        errorContainer: '#93000A',
        healthy: '#4ADE80',
        tusarBlue: '#4FB3E8',
        tusarCyan: '#80CFFF'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
