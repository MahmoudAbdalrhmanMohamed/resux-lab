import { defineResuxRouteMiddleware } from "resuxjs";
export default defineResuxRouteMiddleware((to) => {
  if (to.query.token === 'resux') return
  return navigateTo('/login', { statusCode: 302 })
})

