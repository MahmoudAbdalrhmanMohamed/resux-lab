export default defineServerMiddleware((event) => {
  setHeader(event, 'x-resux-lab', 'enabled')
})
