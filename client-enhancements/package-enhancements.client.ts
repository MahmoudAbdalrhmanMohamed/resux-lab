type PackageStatusState = "idle" | "loading" | "ready" | "error" | "disposed";
type AnyRecord = Record<string, unknown>;

const MISSING_PACKAGE = "resux-missing-package-demo";

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function setPackageStatus(target: Element, state: PackageStatusState, detail = ""): void {
  target.setAttribute("data-rx-enhancement-state", state);
  const root = target.closest("[data-rx-package-demo]") ?? target;
  const node = root.querySelector?.("[data-rx-package-status]");
  if (!node) {
    return;
  }
  node.textContent = detail ? `${state}: ${detail}` : state;
}

function setPackageError(target: Element, error: unknown): void {
  const message = toMessage(error);
  setPackageStatus(target, "error", message);
  const root = target.closest("[data-rx-package-demo]") ?? target;
  const errorNode = root.querySelector?.("[data-rx-package-error]");
  if (errorNode) {
    errorNode.textContent = message;
  }
}

function defineStatusOnlyEnhancement(name: string): void {
  defineClientEnhancement(name, async (target) => {
    setPackageStatus(target, "loading");
    await Promise.resolve();
    setPackageStatus(target, "ready");
  });
}

defineClientEnhancement("chart-demo", async (target) => {
  setPackageStatus(target, "loading");
  try {
    const chartModule = await useClientPackage<AnyRecord>("chart.js/auto", {
      preferDefault: false,
    });
    const ChartCtor = (chartModule as { Chart?: new (...args: unknown[]) => { destroy?: () => void } }).Chart;
    if (typeof ChartCtor !== "function") {
      throw new Error('[resux-lab] Chart.js did not expose a "Chart" export.');
    }
    const canvas = target.querySelector("[data-rx-chart-canvas]") as HTMLCanvasElement | null;
    if (!canvas) {
      throw new Error("[resux-lab] Chart demo is missing [data-rx-chart-canvas].");
    }
    const rows = [...target.querySelectorAll("[data-rx-chart-row]")];
    const labels = rows.map((row) => row.getAttribute("data-rx-chart-label") ?? "metric");
    const values = rows.map((row) => Number(row.getAttribute("data-rx-chart-value") ?? "0"));
    const chart = new ChartCtor(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Web Vitals",
            data: values,
            borderColor: "#22d3ee",
            backgroundColor: "rgba(34, 211, 238, 0.16)",
            fill: true,
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
      },
    });
    setPackageStatus(target, "ready");
    return () => {
      chart.destroy?.();
      setPackageStatus(target, "disposed");
    };
  } catch (error) {
    setPackageError(target, error);
  }
});

defineClientEnhancement("echarts-demo", async (target) => {
  setPackageStatus(target, "loading");
  try {
    const echarts = await useClientPackage<AnyRecord>("echarts", {
      preferDefault: false,
    });
    const init = (echarts as { init?: (el: HTMLElement) => { setOption?: (option: AnyRecord) => void; dispose?: () => void } }).init;
    if (typeof init !== "function") {
      throw new Error('[resux-lab] ECharts did not expose "init".');
    }
    const root = target.querySelector("[data-rx-echarts-root]") as HTMLElement | null;
    if (!root) {
      throw new Error("[resux-lab] ECharts demo is missing [data-rx-echarts-root].");
    }
    const rows = [...target.querySelectorAll("[data-rx-echarts-row]")];
    const labels = rows.map((row) => row.getAttribute("data-rx-echarts-label") ?? "series");
    const values = rows.map((row) => Number(row.getAttribute("data-rx-echarts-value") ?? "0"));
    const instance = init(root);
    instance.setOption?.({
      backgroundColor: "transparent",
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: labels,
        axisLine: { lineStyle: { color: "#64748b" } },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#64748b" } },
        splitLine: { lineStyle: { color: "rgba(100, 116, 139, 0.2)" } },
      },
      series: [
        {
          data: values,
          type: "bar",
          itemStyle: { color: "#22d3ee" },
          barMaxWidth: 42,
        },
      ],
    });
    setPackageStatus(target, "ready");
    return () => {
      instance.dispose?.();
      setPackageStatus(target, "disposed");
    };
  } catch (error) {
    setPackageError(target, error);
  }
});

defineClientEnhancement("animation-gsap-demo", async (target) => {
  setPackageStatus(target, "loading");
  try {
    const gsapModule = await useClientPackage<AnyRecord>("gsap", { preferDefault: false });
    const gsapApi = ((gsapModule as { gsap?: AnyRecord }).gsap
      ?? (gsapModule as { default?: AnyRecord }).default
      ?? gsapModule) as {
      fromTo?: (...args: unknown[]) => void;
      killTweensOf?: (targets: unknown) => void;
    };
    if (typeof gsapApi.fromTo !== "function") {
      throw new Error('[resux-lab] GSAP did not expose "fromTo".');
    }
    const cards = [...target.querySelectorAll("[data-rx-animate-card]")];
    gsapApi.fromTo(
      cards,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power2.out" },
    );
    setPackageStatus(target, "ready");
    return () => {
      gsapApi.killTweensOf?.(cards);
      setPackageStatus(target, "disposed");
    };
  } catch (error) {
    setPackageError(target, error);
  }
});

defineClientEnhancement("animation-anime-demo", async (target) => {
  setPackageStatus(target, "loading");
  try {
    const animeModule = await useClientPackage<AnyRecord>("animejs", { preferDefault: false });
    const animate = (animeModule as { animate?: (...args: unknown[]) => unknown }).animate
      ?? (animeModule as { default?: { animate?: (...args: unknown[]) => unknown } }).default?.animate;
    if (typeof animate !== "function") {
      throw new Error('[resux-lab] Anime.js did not expose "animate".');
    }
    const cards = [...target.querySelectorAll("[data-rx-animate-card]")];
    const animation = animate(cards, {
      opacity: [0, 1],
      translateY: [18, 0],
      delay: (_: unknown, index: number) => index * 70,
      duration: 620,
      ease: "out(3)",
    }) as { cancel?: () => void; pause?: () => void };
    setPackageStatus(target, "ready");
    return () => {
      animation.cancel?.();
      animation.pause?.();
      setPackageStatus(target, "disposed");
    };
  } catch (error) {
    setPackageError(target, error);
  }
});

defineClientEnhancement("video-player-demo", async (target) => {
  setPackageStatus(target, "loading");
  try {
    const PlyrCtor = await useClientPackage<new (target: HTMLElement, options?: AnyRecord) => { destroy?: () => void }>(
      "plyr",
      {
        css: ["plyr/dist/plyr.css"],
      },
    );
    const video = target.querySelector("video") as HTMLElement | null;
    if (!video) {
      throw new Error("[resux-lab] Video player demo is missing <video>.");
    }
    const player = new PlyrCtor(video, {
      controls: ["play", "progress", "current-time", "mute", "volume", "fullscreen"],
    });
    setPackageStatus(target, "ready");
    return () => {
      player.destroy?.();
      setPackageStatus(target, "disposed");
    };
  } catch (error) {
    setPackageError(target, error);
  }
});

defineClientEnhancement("code-highlight-demo", async (target) => {
  setPackageStatus(target, "loading");
  try {
    const hljsModule = await useClientPackage<AnyRecord>("highlight.js", {
      preferDefault: false,
      css: ["highlight.js/styles/github-dark.css"],
    });
    const highlightElement = (hljsModule as { highlightElement?: (el: HTMLElement) => void }).highlightElement
      ?? (hljsModule as { default?: { highlightElement?: (el: HTMLElement) => void } }).default?.highlightElement;
    if (typeof highlightElement !== "function") {
      throw new Error('[resux-lab] highlight.js did not expose "highlightElement".');
    }
    const block = target.querySelector("[data-rx-code-block]") as HTMLElement | null;
    if (!block) {
      throw new Error("[resux-lab] Code highlight demo is missing [data-rx-code-block].");
    }
    highlightElement(block);
    setPackageStatus(target, "ready");
  } catch (error) {
    setPackageError(target, error);
  }
});

defineClientEnhancement("css-package-demo", async (target) => {
  setPackageStatus(target, "loading");
  try {
    await useClientPackage("highlight.js", {
      preferDefault: false,
      css: ["highlight.js/styles/github-dark.css"],
    });
    const token = target.querySelector("[data-rx-css-token]");
    if (token) {
      token.classList.add("hljs-string");
    }
    setPackageStatus(target, "ready");
  } catch (error) {
    setPackageError(target, error);
  }
});

defineClientEnhancement("client-only-map-demo", async (target) => {
  setPackageStatus(target, "loading");
  try {
    const shell = target.querySelector("[data-rx-map-shell]") as HTMLElement | null;
    if (!shell) {
      throw new Error("[resux-lab] Client-only map demo is missing [data-rx-map-shell].");
    }
    shell.textContent = "Interactive browser-only widget initialized.";
    shell.classList.add("bg-emerald-500/10", "border-emerald-300/50");
    setPackageStatus(target, "ready");
    return () => {
      shell.textContent = "Interactive browser-only widget disposed.";
      shell.classList.remove("bg-emerald-500/10", "border-emerald-300/50");
      setPackageStatus(target, "disposed");
    };
  } catch (error) {
    setPackageError(target, error);
  }
});

defineStatusOnlyEnhancement("markdown-demo");
defineStatusOnlyEnhancement("animation-demo");
defineStatusOnlyEnhancement("immediate-demo");
defineStatusOnlyEnhancement("page-load-demo");
defineStatusOnlyEnhancement("manual-demo");

defineClientEnhancement("missing-package-demo", async (target) => {
  setPackageStatus(target, "loading");
  try {
    await useClientPackage(MISSING_PACKAGE);
    setPackageStatus(target, "ready");
  } catch (error) {
    setPackageError(target, error);
  }
});
