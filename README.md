# Resux Lab Bench

A full Resux + Tailwind demo app for testing framework functionality, resumable interactions, SSR, routing, APIs, middleware, layouts, route rules, Vue islands, and simple performance behavior.

## Why this project exists

This app is intentionally not a tiny starter. It is a framework test bench:

- home dashboard and feature checklist
- state and resumable click handlers
- form state with `v-model`
- SSR async data and client skeleton async data
- static, dynamic, and catch-all routes
- layout switching
- route middleware and server middleware
- server API and server route handlers
- route rules and module extension
- Tailwind design system
- simple performance page and CLI smoke runner

## Install

```bash
npm install
```

## Run development

```bash
npm run dev
```

This runs Tailwind watch and `resux dev . --port 3000` together.

## Build and preview

```bash
npm run build
npm run preview
```

## Performance smoke test

Start the app first, then run:

```bash
npm run perf
```

The smoke script calls important routes multiple times and prints average/min/max response times.

## Useful routes

- `/` dashboard
- `/state` resumable state and event handlers
- `/forms` `v-model`, dynamic classes, conditionals
- `/async` `useAsyncData`, `$fetch`, server API
- `/routes` routing index
- `/routes/alpha` dynamic params
- `/docs/resux/runtime/resume` catch-all params
- `/performance` browser-side interaction timing and API benchmark
- `/vue-island` Vue runtime island escape hatch
- `/secure` route middleware demo
- `/api/stats` JSON endpoint
- `/bench` server route endpoint
- `/__resux/health` built-in health check

## Notes

Resux is marked as an MVP, so the app keeps code inside the supported subset: `.vue` SFCs, plain CSS, simple `v-for`, `v-if`, `v-show`, `v-model`, server handlers, layouts, middleware, plugins, and resumable event handlers. If a future Resux release changes server handler conventions, the server files are isolated under `server/` and easy to adjust.
