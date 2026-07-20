/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16213E',
        paper: '#FAFAF7',
        amber: '#E8A33D',
        sage: '#6B9080',
        rust: '#C1502E',
        charcoal: '#2B2B2B',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
