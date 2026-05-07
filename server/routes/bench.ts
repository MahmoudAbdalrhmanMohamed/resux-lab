export default defineEventHandler((event) => {
  setHeader(event, 'x-resux-route', 'bench')
  return {
    route: '/bench',
    timestamp: Date.now(),
    message: 'Server route handler is working.'
  }
})
