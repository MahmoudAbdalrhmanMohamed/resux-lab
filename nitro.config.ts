import { defineNitroConfig } from "nitropack/config";
import { cp, stat, writeFile } from "node:fs/promises";
import path from "node:path";

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
  },
  hooks: {
    async compiled(nitro: any) {
      const resuxServerDir = path.join(nitro.options.rootDir, ".resux", "server");
      const functionsDir = path.join(nitro.options.output.dir, "functions");
      const functionNames = ["__fallback.func", "[...].func"];
      const pluginUtilsSrc = path.join(
        nitro.options.rootDir,
        "node_modules",
        "@rolldown",
        "pluginutils"
      );

      for (const functionName of functionNames) {
        const functionDir = path.join(functionsDir, functionName);

        try {
          await stat(functionDir);
        } catch {
          continue;
        }

        await cp(resuxServerDir, path.join(functionDir, ".resux", "server"), {
          recursive: true,
          force: true
        });

        const pluginUtilsDest = path.join(
          functionDir,
          "node_modules",
          "@rolldown",
          "pluginutils"
        );
        try {
          await stat(pluginUtilsDest);
        } catch {
          await cp(pluginUtilsSrc, pluginUtilsDest, {
            recursive: true,
            force: true
          });
        }

        const functionConfigPath = path.join(functionDir, ".vc-config.json");
        const functionConfig = {
          runtime: "nodejs22.x",
          handler: "index.mjs",
          launcherType: "Nodejs",
          shouldAddHelpers: false,
          supportsResponseStreaming: true
        };
        await writeFile(functionConfigPath, JSON.stringify(functionConfig, null, 2), "utf8");
      }

      const outputConfigPath = path.join(nitro.options.output.dir, "config.json");
      const outputConfig = {
        version: 3,
        routes: [
          { handle: "filesystem" },
          { src: "/(.*)", dest: "/__fallback" }
        ]
      };
      await writeFile(outputConfigPath, JSON.stringify(outputConfig, null, 2), "utf8");
    }
  }
});
