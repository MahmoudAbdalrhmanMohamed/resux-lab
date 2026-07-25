export default defineResuxConfig({
  css: ["/tailwind.css"],
  modules: [
    "resux:security",
    ["resux:performance", { assetMaxAge: 31536000 }],
    ["./modules/lab.ts", { label: "Resux Lab Bench" }],
  ],
  packages: {
    mode: {
      swiper: "progressive",
      "chart.js": "progressive",
      echarts: "progressive",
      gsap: "progressive",
      animejs: "progressive",
      plyr: "progressive",
      marked: "ssr",
      "date-fns": "ssr",
      "lodash-es": "ssr",
      "highlight.js": "progressive",
      "mapbox-gl": "clientOnly",
    },
    css: {
      swiper: [
        "swiper/css",
        "swiper/css/navigation",
        "swiper/css/pagination",
      ],
      plyr: ["plyr/dist/plyr.css"],
    },
  },
  runtimeConfig: {
    privateSecret: "lab-private-super-secret-99",
    public: {
      appName: "Resux Lab Bench",
      appOrigin: process.env.APP_ORIGIN || "http://localhost:3000",
      image: {
        provider: "resux",
        quality: 82,
        format: "webp",
        densities: [1, 2],
        providers: {
          resux: { baseURL: "/__resux/image" },
        },
      },
    },
  },
  app: {
    head: {
      title: "Resux Lab Bench",
      meta: [
        {
          name: "description",
          content:
            "A full Resux test app with Tailwind, routing, SSR, APIs, middleware, and performance checks.",
        },
        { name: "theme-color", content: "#111827" },
      ],
      link: [{ rel: "icon", href: "/favicon.svg" }],
    },
  },
  routeRules: {
    "/performance": {
      headers: { "x-resux-lab-route": "performance" },
      cache: false,
    },
    "/old-dashboard": {
      redirect: { to: "/", statusCode: 301 },
    },
    "/api/**": {
      headers: { "cache-control": "no-store" },
      cors: true,
    },
  },
  projectType: "education",
  halalAI: {
    enabled: true,
  }
});
