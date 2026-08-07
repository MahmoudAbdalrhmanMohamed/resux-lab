import { defineResuxRouteMiddleware } from "resuxjs";

export default defineResuxRouteMiddleware((to) => {
  if (to.path.startsWith('/blocked')) {
    return abortNavigation('Blocked by global middleware', { statusCode: 403 })
  }
})
