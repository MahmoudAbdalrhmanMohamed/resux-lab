import { defineResuxPlugin } from "resuxjs";

export default defineResuxPlugin((app) => {
  app.provide("labPlugin", {
    name: "resux-lab-plugin",
    loadedAt: new Date().toISOString(),
  });
});
