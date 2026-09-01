import { defineNitroConfig } from "nitropack/config";

const mediaFixtureCacheHeaders = {
  "cache-control": "public, max-age=86400",
  "cdn-cache-control": "public, max-age=604800",
  "vercel-cdn-cache-control": "public, max-age=604800"
};

const prerenderedPageCacheHeaders = {
  "cache-control": "public, max-age=0, must-revalidate",
  "cdn-cache-control": "public, max-age=31536000, immutable",
  "vercel-cdn-cache-control": "public, max-age=31536000, immutable"
};

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
    "/media": {
      headers: prerenderedPageCacheHeaders
    },
    "/media-test/images/**": {
      headers: mediaFixtureCacheHeaders
    },
    "/media-test/videos/**": {
      headers: mediaFixtureCacheHeaders
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
    routes: ["/media"]
  }
});
