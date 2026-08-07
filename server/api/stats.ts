export default defineEventHandler((event) => {
  setHeader(event, 'x-resux-api', 'stats')
  const query = getQuery(event)
  return {
    app: 'Resux Lab Bench',
    timestamp: new Date().toISOString(),
    random: Math.round(Math.random() * 100000) / 100000,
    query
  }
})
