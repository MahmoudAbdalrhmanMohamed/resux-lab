import { defineNitroConfig } from "nitropack/config";

export default defineNitroConfig({
  compatibilityDate: "2026-05-02",
  // Nitro auto-scans app-level folders that overlap with Resux conventions.
  // Resux app modules/plugins should not be treated as Nitro runtime entries.
  ignore: ["modules/**", "plugins/**", "middleware/**"],
  // Keep file scanning focused on the generated Resux adapter directory.
  scanDirs: [".resux-nitro"],
  publicAssets: [
    {
      dir: "public",
      baseURL: "/"
    }
  ],
  handlers: [
    {
      route: "/**",
      handler: "./.resux-nitro/handler.ts"
    }
  ],
  routeRules: {
    "/__resux/route": {
      headers: {
        "cache-control": "no-store"
      }
    },
    "/__resux/dev-events": {
      headers: {
        "cache-control": "no-store"
      }
    },
    "/__resux/handlers/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    "/__resux/plugins/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    "/__resux/middleware/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    "/__resux/vue-islands/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    "/__resux/runtime-client.mjs": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    "/api/**": {
      headers: {
        "cache-control": "no-store"
      }
    },
    "/**": {
      headers: {
        "cache-control": "no-store"
      }
    }
  },
  prerender: {
    crawlLinks: false,
    routes: []
  }
});
