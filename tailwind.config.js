/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAF8F5',
        'paper-muted': '#F5F2EB',
        ink: '#1C1917',
        'ink-muted': '#57534E',
        'ink-subtle': '#78716C',
        crimson: '#991B1B',
        'crimson-dark': '#7F1D1D',
        'rule-border': '#E7E5E4',
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
