export default defineEventHandler(async (event) => {
  setHeader(event, 'x-resux-api', 'echo')
  const body = await readBody(event)
  return { ok: true, body }
})
