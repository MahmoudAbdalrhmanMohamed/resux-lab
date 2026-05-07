module.exports = {
  content: [
    './app.vue',
    './error.vue',
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './islands/vue/**/*.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.10)'
      }
    }
  },
  plugins: []
}
