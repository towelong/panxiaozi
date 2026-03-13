import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

function stringifySearch(search: Record<string, unknown>) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(search)) {
    if (typeof value === 'undefined') continue
    if (value === null) {
      params.set(key, '')
      continue
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'undefined') continue
        params.append(key, String(item))
      }
      continue
    }
    if (typeof value === 'object') {
      params.set(key, JSON.stringify(value))
      continue
    }
    params.set(key, String(value))
  }
  const str = params.toString()
  return str ? `?${str}` : ''
}

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    // defaultPreload: 'intent',
    // defaultPreloadStaleTime: 0,
    // stringifySearch,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
