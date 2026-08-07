const origin = process.argv[2] || 'http://localhost:3000'
const routes = ['/', '/state', '/forms', '/async', '/routes/alpha', '/docs/resux/runtime/resume', '/performance', '/api/stats', '/bench', '/__resux/health']
const rounds = Number(process.argv[3] || 5)

async function time(url) {
  const started = performance.now()
  const response = await fetch(url)
  await response.text()
  return { status: response.status, ms: performance.now() - started }
}

for (const route of routes) {
  const samples = []
  for (let i = 0; i < rounds; i++) {
    samples.push(await time(origin + route))
  }
  const times = samples.map((s) => s.ms)
  const avg = times.reduce((a, b) => a + b, 0) / times.length
  const min = Math.min(...times)
  const max = Math.max(...times)
  const status = samples.map((s) => s.status).join(',')
  console.log(`${route.padEnd(32)} avg=${avg.toFixed(2)}ms min=${min.toFixed(2)}ms max=${max.toFixed(2)}ms status=${status}`)
}
