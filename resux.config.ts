export default defineResuxConfig({
  css: ['/tailwind.css'],
  modules: [
    'resux:security',
    ['resux:performance', { assetMaxAge: 31536000 }],
    ['./modules/lab.ts', { label: 'Resux Lab Bench' }]
  ],
  runtimeConfig: {
    public: {
      appName: 'Resux Lab Bench',
      appOrigin: process.env.APP_ORIGIN || 'http://localhost:3000'
    }
  },
  app: {
    head: {
      title: 'Resux Lab Bench',
      meta: [
        { name: 'description', content: 'A full Resux test app with Tailwind, routing, SSR, APIs, middleware, and performance checks.' },
        { name: 'theme-color', content: '#111827' }
      ]
    }
  },
  routeRules: {
    '/performance': {
      headers: { 'x-resux-lab-route': 'performance' },
      cache: false
    },
    '/old-dashboard': {
      redirect: { to: '/', statusCode: 301 }
    },
    '/api/**': {
      headers: { 'cache-control': 'no-store' },
      cors: true
    }
  }
})
