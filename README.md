# Resux Lab Bench

A full Resux compatibility app for testing framework functionality, resumable interactions, SSR, routing, APIs, middleware, layouts, route rules, Vue islands, UI primitives, third-party packages, browser integrations, and performance behavior.

## Why this project exists

This app is intentionally not a tiny starter. It is the executable compatibility bench for Resux:

- home dashboard and feature checklist
- state and resumable click handlers
- form state with `v-model`
- SSR async data and client skeleton async data
- static, dynamic, and catch-all routes
- layout switching
- route middleware and server middleware
- server API and server route handlers
- route rules and module extension
- Vue runtime islands
- `resuxjs/ui` public component coverage
- native camera/permission/file-picker integration patterns
- progressive third-party package enhancements
- media/image/video behavior
- Tailwind design system
- performance and server compatibility checks

## Framework under test

The lab tests a packed sibling Resux checkout rather than whatever version happens to be published on npm. The committed `package.json` points at the current local tarball name for ordinary development, while CI rewrites that dependency to the filename actually produced by `npm pack`. This allows branches, tags, and commit SHAs with a different package version to be tested correctly.

For a fresh local checkout:

```sh
# Parent directory
git clone https://github.com/MahmoudAbdalrhmanMohamed/resux.git
git clone https://github.com/MahmoudAbdalrhmanMohamed/resux-lab.git

cd resux
npm ci
npm run build
rm -f resuxjs-*.tgz
npm pack

cd ../resux-lab
TARBALL="$(find ../resux -maxdepth 1 -type f -name 'resuxjs-*.tgz' -print -quit)"
if [ -z "$TARBALL" ]; then
  echo "No packed resuxjs tarball found" >&2
  exit 1
fi
npm install --save-exact "$TARBALL"
```

The generated tarball is versioned, for example `resuxjs-0.3.0.tgz`, but scripts must discover the actual filename instead of assuming a fixed version.

To test a framework branch, check out that branch in `../resux`, rebuild it, run `npm pack` again, and reinstall the newly generated tarball before rebuilding the lab.

The GitHub Actions **Resux compatibility lab** workflow automates this setup. Its manual `resux_ref` input accepts any framework branch, tag, or commit SHA. Normal lab pull requests test against framework `main`.

## Run development

```sh
npm run dev
```

This runs `resux dev . --port 4000`.

## Build and server checks

```sh
npm run build
npm run test:e2e
```

The HTTP/server suite validates framework routes, media behavior, package integration fallbacks/enhancement markers, and the new UI/browser-integration SSR shells.

## Browser integration checks

Install the Playwright Chromium browser once:

```sh
npx playwright install chromium
```

Then:

```sh
npm run build
npm run test:browser
```

This verifies real client behavior for:

- the `resuxjs/ui` Vue island
- input `v-model`
- `RxDatePicker`
- modal mounting
- browser capability detection
- native file picker state

The camera is **not** automatically requested in CI. The lab only checks capability/permission-state handling unless a user explicitly clicks the camera request button.

## Package integration coverage

The lab has executable pages for:

- Swiper
- Chart.js
- ECharts
- GSAP
- Anime.js
- Plyr
- Marked
- Highlight.js
- date-fns
- lodash-es
- package CSS loading
- missing-package diagnostics
- multiple client-enhancement triggers

Credentialed external providers such as Google Maps, Firebase Admin, Supabase service-role operations, and Stripe payment/webhook calls require dedicated test accounts/keys. The lab validates the Resux execution-boundary pattern without pretending to contact those services when credentials are absent.

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
- `/ui` `resuxjs/ui` public component showcase, including DatePicker
- `/integrations/browser-capabilities` camera/permission/file-picker browser integration pattern
- `/secure` route middleware demo
- `/media-test/video` ResuxVideo hero section
- `/media-test/images` ResuxImg/ResuxPicture placeholder/fallback states
- `/media-test/lcp` priority LCP image route
- `/package-tests` package compatibility index
- `/package-tests/swiper` SSR-first Swiper progressive enhancement
- `/package-tests/chart` SSR table fallback + Chart.js enhancement
- `/package-tests/echarts` SSR fallback + ECharts enhancement
- `/package-tests/animation-gsap` GSAP enhancement
- `/package-tests/animation-anime` Anime.js enhancement
- `/package-tests/video-player` native video + Plyr enhancement
- `/package-tests/markdown` SSR markdown
- `/package-tests/code-highlight` syntax highlighting enhancement
- `/package-tests/utility-date-fns` SSR-safe date utility
- `/package-tests/utility-lodash` SSR-safe utility package
- `/package-tests/css-package` CSS package enhancement
- `/package-tests/client-only-map` client-only package boundary demo
- `/package-tests/missing-package` package diagnostics/fallback demo
- `/api/stats` JSON endpoint
- `/bench` server route endpoint
- `/__resux/health` built-in health check

## Repository hygiene

Generated build output such as `.nitro`, `.resux-nitro`, `.resux`, and `.output` is ignored and must not be committed. The audit also removed an accidental generated `3403/` project directory that duplicated root starter files and was not referenced by the lab.

## Notes

The lab deliberately includes both Resux-native pages and Vue islands. Vue islands are used for UI/library integrations that naturally require the Vue runtime; SSR-first pages remain the default for content that can be represented without a client component tree.
