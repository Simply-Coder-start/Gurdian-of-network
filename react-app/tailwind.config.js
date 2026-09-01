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
        /* Existing SOC dashboard tokens */
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
        tusarCyan: '#80CFFF',

        /* Landing page design tokens */
        ink: '#0A0D12',
        surfaceLanding: '#12171F',
        hairline: '#1B222B',
        textPrimary: '#E7ECF0',
        textSecondary: '#8B98A5',
        calm: '#4B5A6B',
        signal: '#FF7A45',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
