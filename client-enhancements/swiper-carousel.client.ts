import { defineClientEnhancement } from "resuxjs";

type SwiperInstance = {
  destroy?: (deleteInstance?: boolean, cleanStyles?: boolean) => void;
  update?: () => void;
  on?: (eventName: string, handler: () => void) => void;
  off?: (eventName: string, handler: () => void) => void;
};

type NavigationIconMode = "auto" | "never" | "empty-only";

type SwiperEnhancementOptions = {
  slidesPerView?: number;
  spaceBetween?: number;
  watchOverflow?: boolean;
  breakpoints?: Record<string, unknown>;
  navigation?: boolean;
  pagination?: boolean;
  navigationIcons?: NavigationIconMode;
};

type EnhancementPayload = {
  trigger?: string;
  options?: Record<string, unknown>;
  __resux?: {
    trigger?: string;
    options?: Record<string, unknown>;
  };
} & Record<string, unknown>;

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function setPackageStatus(target: Element, state: string, detail = ""): void {
  target.setAttribute("data-rx-enhancement-state", state);
  const root = target.closest("[data-rx-package-demo]") ?? target;
  const node = root.querySelector?.("[data-rx-package-status]");
  if (!node) {
    return;
  }
  node.textContent = detail ? `${state}: ${detail}` : state;
}

function setSwiperFlag(root: Element, key: string, value: string): void {
  root.setAttribute(`data-rx-swiper-${key}`, value);
  const statusNode = root.querySelector?.(`[data-rx-swiper-status="${key}"]`);
  if (statusNode) {
    statusNode.textContent = value;
  }
}

function readOptions(payload: unknown): SwiperEnhancementOptions {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {};
  }
  const record = payload as EnhancementPayload;
  if (record.options && typeof record.options === "object" && !Array.isArray(record.options)) {
    return record.options as SwiperEnhancementOptions;
  }
  const {
    trigger: _trigger,
    options: _options,
    __resux: _meta,
    ...direct
  } = record;
  return direct as SwiperEnhancementOptions;
}

function normalizeNavigationIconMode(value: unknown): NavigationIconMode {
  if (value === "auto" || value === "never" || value === "empty-only") {
    return value;
  }
  return "empty-only";
}

function hasUserContent(button: Element): boolean {
  const clone = button.cloneNode(true) as Element;
  clone.querySelectorAll(".swiper-navigation-icon").forEach((icon) => icon.remove());
  const hasText = (clone.textContent ?? "").trim().length > 0;
  const hasCustomElement = clone.children.length > 0;
  return hasText || hasCustomElement;
}

function applyNavigationIconPolicy(root: Element, mode: NavigationIconMode): void {
  if (mode === "auto") {
    return;
  }
  const buttons = root.querySelectorAll(".swiper-button-prev, .swiper-button-next");
  buttons.forEach((button) => {
    const icons = button.querySelectorAll(".swiper-navigation-icon");
    if (mode === "never") {
      icons.forEach((icon) => icon.remove());
      return;
    }
    if (hasUserContent(button)) {
      icons.forEach((icon) => icon.remove());
    }
  });
}

export default defineClientEnhancement("swiper-carousel", async (el, payload) => {
  const errorNode = el.querySelector?.("[data-rx-package-error]");
  if (errorNode) {
    errorNode.textContent = "No errors.";
  }

  setPackageStatus(el, "loading");
  setSwiperFlag(el, "ssr", "true");
  setSwiperFlag(el, "swiper-js", "loading");
  setSwiperFlag(el, "swiper-css", "loading");
  setSwiperFlag(el, "active", "false");
  setSwiperFlag(el, "cleanup", "false");
  el.setAttribute("data-rx-swiper-enhancing", "true");

  try {
    const userOptions = readOptions(payload);
    const navigationIcons = normalizeNavigationIconMode(userOptions.navigationIcons);
    const [
      { default: Swiper },
      { Navigation, Pagination, A11y, Keyboard },
    ] = await Promise.all([
      import("swiper"),
      import("swiper/modules"),
      import("swiper/css"),
      import("swiper/css/navigation"),
      import("swiper/css/pagination"),
    ]);

    setSwiperFlag(el, "swiper-js", "true");
    setSwiperFlag(el, "swiper-css", "true");

    const container = el.querySelector(".swiper");
    if (!container) {
      throw new Error('[resux] Swiper enhancement failed: missing ".swiper" container.');
    }

    const nextEl = el.querySelector(".swiper-button-next");
    const prevEl = el.querySelector(".swiper-button-prev");
    const paginationEl = el.querySelector(".swiper-pagination");

    const defaults = {
      modules: [Navigation, Pagination, A11y, Keyboard],
      slidesPerView: 1,
      spaceBetween: 16,
      watchOverflow: true,
      observer: true,
      observeParents: true,
      keyboard: { enabled: true },
      a11y: { enabled: true },
      breakpoints: {
        640: { slidesPerView: 1.2, spaceBetween: 16 },
        768: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
        1280: { slidesPerView: 4, spaceBetween: 24 },
      },
    };

    const mergedOptions = {
      ...defaults,
      ...userOptions,
      breakpoints: {
        ...defaults.breakpoints,
        ...(userOptions.breakpoints ?? {}),
      },
      modules: defaults.modules,
      navigation: userOptions.navigation === false
        ? false
        : nextEl && prevEl
          ? {
            nextEl: nextEl as HTMLElement,
            prevEl: prevEl as HTMLElement,
            addIcons: navigationIcons !== "never",
          }
          : false,
      pagination: userOptions.pagination === false
        ? false
        : paginationEl
          ? { el: paginationEl as HTMLElement, clickable: true }
          : false,
    };

    const instance = new Swiper(container as HTMLElement, mergedOptions) as SwiperInstance;
    instance.update?.();
    const applyIconPolicy = () => {
      applyNavigationIconPolicy(el, navigationIcons);
    };
    applyIconPolicy();
    const iconPolicyEvents = ["navigationShow", "navigationHide", "slideChange", "update"];
    for (const eventName of iconPolicyEvents) {
      instance.on?.(eventName, applyIconPolicy);
    }

    setSwiperFlag(el, "active", "true");
    setSwiperFlag(el, "cleanup", "true");
    setPackageStatus(el, "active");
    if (errorNode) {
      errorNode.textContent = "No errors.";
    }

    return () => {
      el.removeAttribute("data-rx-swiper-enhancing");
      for (const eventName of iconPolicyEvents) {
        instance.off?.(eventName, applyIconPolicy);
      }
      instance.destroy?.(true, true);
      setSwiperFlag(el, "active", "false");
      setSwiperFlag(el, "cleanup", "false");
      setPackageStatus(el, "disposed");
    };
  } catch (error) {
    el.removeAttribute("data-rx-swiper-enhancing");
    const message = toMessage(error);
    setSwiperFlag(el, "swiper-js", "false");
    setSwiperFlag(el, "swiper-css", "false");
    setSwiperFlag(el, "active", "false");
    setSwiperFlag(el, "cleanup", "false");
    setPackageStatus(el, "error", message);
    if (errorNode) {
      errorNode.textContent = message;
    }
    throw error instanceof Error ? error : new Error(message);
  }
});
