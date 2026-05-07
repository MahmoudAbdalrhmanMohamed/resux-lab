import { defineResuxModule } from "resuxjs"
type LabModuleOptions = {
  label?: string;
};

export default defineResuxModule<LabModuleOptions>({
  defaults: { label: "Resux Lab" },

  setup(options, resux) {
    const label = options.label ?? "Resux Lab";

    resux.addHead({
      meta: [{ name: "x-resux-lab-module", content: label }],
    });

    resux.addRouteRule("/module-added", {
      redirect: { to: "/", statusCode: 302 },
    });

    resux.extendRuntimeConfig({
      public: { labModule: label },
    });
  },
});
