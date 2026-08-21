import { defineNitroConfig } from "nitropack/config";

export default defineNitroConfig({
  compatibilityDate: "2026-05-02",
  ignore: ["modules/**", "plugins/**", "middleware/**"],
  scanDirs: [".resux-nitro"],
  publicAssets: [
    {
      dir: "public",
      baseURL: "/"
    },
    {
      dir: ".resux/client",
      baseURL: "/__resux",
      fallthrough: true
    }
  ],
  serverAssets: [
    {
      baseName: "resux",
      dir: ".resux/server"
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
    "/__resux/image": {
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