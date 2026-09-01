<script setup lang="ts">
definePageMeta({ layout: "dashboard", title: "Resux media components" });

const none = undefined;
const nil = null;
const empty = "";

const buildImage = useResuxImage();
const cachedGeneratedUrl = buildImage("/media-test/images/hero-large.jpg", {
  width: 1400,
  format: "webp",
  quality: 88,
  cache: "1d",
});
const cachedExpiryUrl = buildImage("/media-test/images/hero-square.jpg", {
  width: 1200,
  format: "avif",
  quality: 90,
  cache: { maxAge: "7d" },
});
const noFormatNoQualityUrl = buildImage("/media-test/images/hero-large.jpg", {
  width: 1200,
  cache: true,
  modifiers: { format: false, quality: false },
});

const sharedSizes = "(min-width: 1280px) 40vw, (min-width: 768px) 84vw, 96vw";
const mediaIntrinsicSizes: Record<string, { width: number; height: number }> = {
  "/media-test/images/hero-large.jpg": { width: 2200, height: 1467 },
  "/media-test/images/hero-large.png": { width: 2200, height: 1467 },
  "/media-test/images/hero-wide.jpg": { width: 2400, height: 1080 },
  "/media-test/images/hero-square.jpg": { width: 1400, height: 1400 },
};

function inferMediaHeight(src: string | undefined, width: number | undefined): number | undefined {
  if (!src || !width) {
    return undefined;
  }
  const size = mediaIntrinsicSizes[src];
  if (!size) {
    return undefined;
  }
  return Math.max(1, Math.round((width * size.height) / size.width));
}

function inferMediaWidth(src: string | undefined): number | undefined {
  if (!src) {
    return undefined;
  }
  return mediaIntrinsicSizes[src]?.width;
}

const imgCases: Array<Record<string, any>> = [
  {
    id: "img-lazy-default",
    title: "Lazy image with default Resux placeholder",
    propsCode: `lazy loading="lazy" :placeholder="true" placeholderClass="bg-slate-800/70"`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Lazy image with default placeholder",
    lazy: true,
    loading: "lazy",
    placeholder: true,
    placeholderClass: "bg-slate-800/70",
    placeholderStyle: "filter: saturate(0.8)",
    width: 1400,
    sizes: sharedSizes,
    cache: false,
  },
  {
    id: "img-lazy-custom-placeholder",
    title: "Lazy image with custom placeholder image",
    propsCode: `lazy placeholder="/media-test/images/custom-placeholder.jpg"`,
    src: "/media-test/images/hero-wide.jpg",
    alt: "Lazy image with custom placeholder",
    lazy: true,
    loading: "lazy",
    placeholder: "/media-test/images/custom-placeholder.jpg",
    width: 1400,
    sizes: sharedSizes,
    cache: false,
  },
  {
    id: "img-lazy-text-placeholder",
    title: "Lazy image with text placeholder",
    propsCode: `lazy placeholder="Loading image..."`,
    src: "/media-test/images/hero-square.jpg",
    alt: "Lazy image with text placeholder",
    lazy: true,
    loading: "lazy",
    placeholder: "Loading image...",
    width: 1200,
    sizes: sharedSizes,
    cache: false,
  },
  {
    id: "img-eager-no-placeholder",
    title: "Eager image with no placeholder",
    propsCode: `loading="eager" placeholder=undefined`,
    src: "/media-test/images/hero-large.png",
    alt: "Eager PNG image",
    lazy: false,
    loading: "eager",
    placeholder: none,
    width: 1400,
    sizes: sharedSizes,
    cache: false,
  },
  {
    id: "img-broken-fallback",
    title: "Image with fallbackSrc configured",
    propsCode: `src="/media-test/images/hero-wide.jpg" fallbackSrc="/media-test/images/hero-square.jpg" width="860" fit="cover"`,
    src: "/media-test/images/hero-wide.jpg",
    alt: "Image fallback configuration",
    fallbackSrc: "/media-test/images/hero-square.jpg",
    lazy: true,
    loading: "lazy",
    placeholder: true,
    width: 860,
    sizes: none,
    cache: false,
  },
  {
    id: "img-broken-placeholder",
    title: "Image with placeholder only",
    propsCode: `src="/media-test/images/hero-large.jpg" lazy :placeholder="true"`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Image placeholder test",
    lazy: true,
    loading: "lazy",
    placeholder: true,
    width: 860,
    sizes: none,
    cache: false,
  },
  {
    id: "img-format-undefined-quality-undefined",
    title: "format=undefined, quality=undefined",
    propsCode: `:format="undefined" :quality="undefined" modifiers={ format:false, quality:false }`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Undefined format and quality",
    format: none,
    quality: none,
    modifiers: { format: false, quality: false },
    lazy: true,
    loading: "lazy",
    placeholder: "/resux-placeholder.svg",
    width: 1300,
    sizes: sharedSizes,
    cache: false,
  },
  {
    id: "img-format-null-quality-null",
    title: "format=null, quality=null",
    propsCode: `:format="null" :quality="null" modifiers={ format:false, quality:false }`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Null format and quality",
    format: nil,
    quality: nil,
    modifiers: { format: false, quality: false },
    lazy: true,
    loading: "lazy",
    placeholder: true,
    width: 1300,
    sizes: sharedSizes,
    cache: false,
  },
  {
    id: "img-format-empty-quality-empty",
    title: "format=\"\", quality=\"\"",
    propsCode: `format="" quality="" modifiers={ format:false, quality:false }`,
    src: "/media-test/images/hero-wide.jpg",
    alt: "Empty format and quality",
    format: empty,
    quality: empty,
    modifiers: { format: false, quality: false },
    lazy: true,
    loading: "lazy",
    placeholder: true,
    width: 1300,
    sizes: sharedSizes,
    cache: false,
  },
  {
    id: "img-cached-transform",
    title: "Cached transformed image",
    propsCode: `format="webp" quality=88 cache="1d"`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Cached transformed webp",
    format: "webp",
    quality: 88,
    cache: "1d",
    lazy: true,
    loading: "lazy",
    placeholder: true,
    width: 1400,
    sizes: sharedSizes,
  },
  {
    id: "img-original-vs-transform",
    title: "Original vs transformed quality comparison",
    propsCode: `format=null quality=null vs explicit format="webp" quality=88`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Original quality comparison",
    format: nil,
    quality: nil,
    modifiers: { format: false, quality: false },
    cache: false,
    lazy: true,
    loading: "lazy",
    placeholder: true,
    width: 1400,
    sizes: sharedSizes,
  },
].map((entry) => ({
  ...entry,
  height: entry.height ?? inferMediaHeight(entry.src ?? entry.fallbackSrc, entry.width),
}));

const pictureCases: Array<Record<string, any>> = [
  {
    id: "pic-lazy-default-placeholder",
    title: "Lazy picture with default Resux placeholder",
    propsCode: `lazy :placeholder="true" placeholderClass="bg-slate-800/60" formats="avif,webp,jpg"`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Lazy picture default placeholder",
    formats: "avif,webp,jpg",
    widths: "420,840,1280,1600",
    sizes: sharedSizes,
    placeholder: true,
    placeholderClass: "bg-slate-800/60",
    placeholderStyle: "filter: saturate(0.9)",
    cache: false,
  },
  {
    id: "pic-lazy-custom-placeholder",
    title: "Lazy picture with custom placeholder image",
    propsCode: `lazy placeholder="/media-test/images/custom-placeholder.jpg"`,
    src: "/media-test/images/hero-wide.jpg",
    alt: "Lazy picture custom placeholder",
    formats: "webp,jpg",
    widths: "420,840,1280,1600",
    sizes: sharedSizes,
    placeholder: "/media-test/images/custom-placeholder.jpg",
    cache: false,
  },
  {
    id: "pic-lazy-text-placeholder",
    title: "Lazy picture with text placeholder",
    propsCode: `lazy placeholder="Loading picture..."`,
    src: "/media-test/images/hero-square.jpg",
    alt: "Lazy picture text placeholder",
    formats: "webp,jpg",
    widths: "420,840,1280",
    sizes: sharedSizes,
    placeholder: "Loading picture...",
    cache: false,
  },
  {
    id: "pic-multiple-sources",
    title: "Picture with multiple source definitions",
    propsCode: `:sources="[{ src, format:'webp', media:'(min-width:768px)' }, { src, format:null, media:'(max-width:767px)' }]"`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Picture explicit multiple sources",
    sources: [
      {
        src: "/media-test/images/hero-wide.jpg",
        format: "webp",
        media: "(min-width: 768px)",
        widths: "640,1024,1600",
        sizes: "(min-width: 1280px) 44vw, 92vw",
      },
      {
        src: "/media-test/images/hero-square.jpg",
        format: nil,
        media: "(max-width: 767px)",
        widths: "320,480,720",
        sizes: "92vw",
      },
    ],
    fallback: "/media-test/images/hero-large.jpg",
    placeholder: true,
    cache: false,
  },
  {
    id: "pic-fallback-image",
    title: "Picture with fallback configuration",
    propsCode: `src="/media-test/images/hero-large.jpg" fallback="/media-test/images/hero-square.jpg" fallbackSrc="/media-test/images/hero-square.jpg"`,
    src: "/media-test/images/hero-large.jpg",
    fallback: "/media-test/images/hero-square.jpg",
    fallbackSrc: "/media-test/images/hero-square.jpg",
    alt: "Picture fallback configuration",
    formats: "webp,jpg",
    widths: "420,840,1280",
    sizes: sharedSizes,
    placeholder: true,
    cache: false,
  },
  {
    id: "pic-format-null",
    title: "Picture format=null (no conversion)",
    propsCode: `:format="null" :quality="88" modifiers={ format:false }`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Picture format null",
    format: nil,
    quality: 88,
    modifiers: { format: false },
    widths: "420,840,1280",
    sizes: sharedSizes,
    placeholder: true,
    cache: false,
  },
  {
    id: "pic-quality-null",
    title: "Picture quality=null (no compression)",
    propsCode: `formats="webp,jpg" :quality="null" modifiers={ quality:false }`,
    src: "/media-test/images/hero-large.jpg",
    alt: "Picture quality null",
    formats: "webp,jpg",
    quality: nil,
    modifiers: { quality: false },
    widths: "420,840,1280",
    sizes: sharedSizes,
    placeholder: true,
    cache: false,
  },
  {
    id: "pic-cached-transform",
    title: "Cached transformed picture",
    propsCode: `formats="avif,webp,jpg" quality=88 cache="7d"`,
    src: "/media-test/images/hero-square.jpg",
    alt: "Cached transformed picture",
    formats: "avif,webp,jpg",
    quality: 88,
    widths: "420,840,1280,1600",
    sizes: sharedSizes,
    placeholder: true,
    cache: "7d",
  },
  {
    id: "pic-cache-false",
    title: "Non-cached transformed picture",
    propsCode: `formats="webp,jpg" quality=88 :cache="false"`,
    src: "/media-test/images/hero-square.jpg",
    alt: "Non-cached transformed picture",
    formats: "webp,jpg",
    quality: 88,
    widths: "420,840,1280,1600",
    sizes: sharedSizes,
    placeholder: true,
    cache: false,
  },
].map((entry) => ({
  ...entry,
  width: entry.width ?? inferMediaWidth(entry.src ?? entry.fallback ?? entry.fallbackSrc),
  height: entry.height
    ?? inferMediaHeight(
      entry.src ?? entry.fallback ?? entry.fallbackSrc,
      entry.width ?? inferMediaWidth(entry.src ?? entry.fallback ?? entry.fallbackSrc),
    ),
}));

const videoCases: Array<Record<string, any>> = [
  {
    id: "video-eager-controls",
    title: "Eager video with controls",
    propsCode: `src + controls + preload=\"metadata\"`,
    src: "/media-test/videos/sample-360.mp4",
    controls: true,
    preload: "metadata",
    lazy: false,
    loading: "eager",
    poster: "/media-test/videos/sample-poster.jpg",
  },
  {
    id: "video-lazy-poster",
    title: "Lazy video with poster",
    propsCode: `lazy poster controls`,
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    poster: "/media-test/videos/sample-poster.jpg",
    preload: "metadata",
  },
  {
    id: "video-custom-controls-theme",
    title: "Lazy video with themed custom controls",
    propsCode: `lazy controls controlsAccent="#22d3ee" controlsBackground="rgba(15,23,42,.80)" controlsColor="#f8fafc"`,
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    poster: "/media-test/videos/sample-poster.jpg",
    preload: "metadata",
    controlsColor: "#f8fafc",
    controlsBackground: "rgba(15,23,42,.80)",
    controlsAccent: "#22d3ee",
    controlsIconPlay: ">",
    controlsIconPause: "||",
    controlsIconMute: "M",
    controlsIconUnmute: "S",
    controlsIconFullscreen: "[ ]",
    controlsIconExitFullscreen: "X",
  },
  {
    id: "video-lazy-default-placeholder",
    title: "Lazy video with default Resux placeholder",
    propsCode: `lazy :placeholder=\"true\" controls`,
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    placeholder: true,
    poster: "/media-test/videos/sample-poster.jpg",
    preload: "metadata",
  },
  {
    id: "video-lazy-skeleton-placeholder",
    title: "Lazy video with skeleton placeholder",
    propsCode: `lazy placeholder=\"/media-test/videos/placeholder.jpg\"`,
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    placeholder: "/media-test/videos/placeholder.jpg",
    poster: "/media-test/videos/sample-poster.jpg",
    preload: "metadata",
  },
  {
    id: "video-lazy-placeholder-image",
    title: "Lazy video with custom placeholder image",
    propsCode: `lazy placeholder=\"/media-test/images/custom-placeholder.jpg\"`,
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    placeholder: "/media-test/images/custom-placeholder.jpg",
    poster: "/media-test/videos/sample-poster.jpg",
    preload: "metadata",
  },
  {
    id: "video-lazy-placeholder-text",
    title: "Lazy video with text placeholder",
    propsCode: `lazy placeholder=\"Loading video...\"`,
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    placeholder: "Loading video...",
    poster: "/media-test/videos/sample-poster.jpg",
    preload: "metadata",
  },
  {
    id: "video-lazy-autoplay-loop",
    title: "Lazy autoplay muted loop video",
    propsCode: `lazy autoplay muted loop playsinline`,
    src: "/media-test/videos/sample-video.mp4",
    controls: false,
    autoplay: true,
    muted: true,
    loop: true,
    playsinline: true,
    lazy: true,
    loading: "lazy",
    placeholder: true,
    preload: "auto",
    poster: "/media-test/videos/sample-poster.jpg",
  },
  {
    id: "video-lazy-multi-source",
    title: "Lazy video with multiple sources",
    propsCode: `:sources="[{ src:'/sample-video-alt.mp4', type:'video/mp4' }, { src:'/sample-video.mp4', type:'video/mp4' }]"`,
    controls: true,
    lazy: true,
    loading: "lazy",
    poster: "/media-test/videos/sample-poster.jpg",
    placeholder: true,
    preload: "metadata",
    sources: [
      { src: "/media-test/videos/sample-video-alt.mp4", type: "video/mp4" },
      { src: "/media-test/videos/sample-video.mp4", type: "video/mp4" },
    ],
  },
  {
    id: "video-lazy-speed-control",
    title: "Lazy video with speed control",
    propsCode: `lazy controls speedControl :speeds="[0.5, 0.75, 1, 1.25, 1.5, 2]" :defaultSpeed="1"`,
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    poster: "/media-test/videos/sample-poster.jpg",
    placeholder: true,
    preload: "metadata",
    speedControl: true,
    speeds: [0.5, 0.75, 1, 1.25, 1.5, 2],
    defaultSpeed: 1,
    showSpeedIcon: true,
    speedLabel: "Playback speed",
  },
  {
    id: "video-grid-card",
    title: "Lazy video inside responsive card grid",
    propsCode: `lazy aspect-ratio=\"16 / 9\" class=\"card media\"`,
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    poster: "/media-test/videos/sample-poster.jpg",
    placeholder: true,
    aspectRatio: "16 / 9",
    preload: "metadata",
  },
  {
    id: "video-broken-src",
    title: "Video with fallback poster configuration",
    propsCode: `src=\"/media-test/videos/sample-video.mp4\" fallbackPoster=\"/media-test/videos/sample-poster.jpg\"`,
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    placeholder: "Video loading...",
    fallbackPoster: "/media-test/videos/sample-poster.jpg",
    preload: "metadata",
  },
];

const advancedVideoCases: Array<Record<string, any>> = [
  {
    id: "advanced-skip-default",
    title: "Skip overlay controls (default 1s)",
    propsCode: `controls lazy skipControls :skipSeconds="1"`,
    expected: "Tap/click left half to skip backward and right half to skip forward by 10s without any page refresh.",
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    poster: "/media-test/videos/sample-poster.jpg",
    placeholder: true,
    preload: "metadata",
    skipControls: true,
    skipSeconds: 1,
  },
  {
    id: "advanced-skip-custom",
    title: "Skip overlay controls (back 5s, forward 15s)",
    propsCode: `skipControls :skipBackwardSeconds="5" :skipForwardSeconds="15" skipLabel="Jump"`,
    expected: "Left/right click zones should skip by different durations and never trigger router navigation.",
    src: "/media-test/videos/sample-video.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    poster: "/media-test/videos/sample-poster.jpg",
    placeholder: true,
    preload: "metadata",
    skipControls: true,
    skipBackwardSeconds: 5,
    skipForwardSeconds: 15,
    skipLabel: "Jump",
  },
  {
    id: "advanced-hero-priority-preload",
    title: "Hero priority preload mode",
    propsCode: `hero priority preloadLink :lazy="false" loading="eager"`,
    expected: "Hero video should render eager with high fetch priority and preload link, without hard refresh.",
    src: "/media-test/videos/sample-360.mp4",
    controls: true,
    lazy: false,
    loading: "eager",
    poster: "/media-test/videos/sample-poster.jpg",
    preloadLink: true,
    hero: true,
    priority: true,
  },
  {
    id: "advanced-chunk-lazy",
    title: "Chunk/range-friendly lazy mode",
    propsCode: `lazy chunkLoading preload="metadata"`,
    expected: "Uses metadata-first loading hints and lazy reveal to reduce heavy initial transfers.",
    src: "/media-test/videos/sample-1080.mp4",
    controls: true,
    lazy: true,
    loading: "lazy",
    poster: "/media-test/videos/sample-poster.jpg",
    placeholder: true,
    preload: "metadata",
    chunkLoading: true,
  },
  {
    id: "advanced-poster-first-ready",
    title: "Poster-first then page-ready chunk loading",
    propsCode: `deferUntilPageReady revealOnPageReady chunkLoading poster`,
    expected: "Starts as poster/placeholder first, then reveals video load after full page ready with no reload.",
    src: "/media-test/videos/sample-360.mp4",
    controls: true,
    lazy: false,
    loading: "eager",
    poster: "/media-test/videos/sample-poster.jpg",
    placeholder: true,
    deferUntilPageReady: true,
    revealOnPageReady: true,
    chunkLoading: true,
    preload: "metadata",
  },
  {
    id: "advanced-hero-defer-chunk",
    title: "Hero + defer + chunk + skip combo",
    propsCode: `hero deferUntilPageReady chunkLoading skipControls :skipSeconds="5"`,
    expected: "Combines hero hints, deferred chunk loading, and skip controls while keeping SPA runtime stable.",
    src: "/media-test/videos/sample-360.mp4",
    controls: true,
    lazy: false,
    loading: "eager",
    poster: "/media-test/videos/sample-poster.jpg",
    placeholder: true,
    hero: true,
    deferUntilPageReady: true,
    revealOnPageReady: true,
    chunkLoading: true,
    preloadLink: true,
    skipControls: true,
    skipSeconds: 5,
  },
];

const videoAsset = {
  mp4: "/media-test/videos/sample-video.mp4",
  webm: "/media-test/videos/sample-video.webm",
  altMp4: "/media-test/videos/sample-video-alt.mp4",
  lazyMp4: "/media-test/videos/sample-video-lazy.mp4",
  q360: "/media-test/videos/sample-360.mp4",
  q720: "/media-test/videos/sample-720.mp4",
  q1080: "/media-test/videos/sample-1080.mp4",
  poster: "/media-test/videos/sample-poster.jpg",
  placeholder: "/media-test/videos/placeholder.jpg",
  badVideo: "/media-test/videos/missing-video.mp4",
  badPoster: "/media-test/videos/missing-poster.jpg",
};

type FullResuxVideoCase = {
  id: string;
  title: string;
  propsCode: string;
  expected: string;
  props?: Record<string, any>;
  debugTag?: string;
  spacerBefore?: boolean;
  containerClass?: string;
  containerStyle?: string;
  checklist?: string[];
};

type FullResuxVideoGroup = {
  id: string;
  title: string;
  description: string;
  cases: FullResuxVideoCase[];
};

function makeVideoCase(
  id: string,
  title: string,
  propsCode: string,
  expected: string,
  props: Record<string, any> | undefined = undefined,
  extras: Partial<FullResuxVideoCase> = {},
): FullResuxVideoCase {
  return {
    id,
    title,
    propsCode,
    expected,
    props,
    debugTag: id,
    ...extras,
  };
}

const baseLazyVideoProps = {
  src: videoAsset.mp4,
  controls: true,
  lazy: true,
  loading: "lazy",
  poster: videoAsset.poster,
  placeholder: true,
  preload: "metadata",
  width: 1280,
  height: 720,
  aspectRatio: "16 / 9",
};

const fullResuxVideoCapabilityGroups: FullResuxVideoGroup[] = [
  {
    id: "A",
    title: "A. Basic video types",
    description: "Core formats, poster and control combinations.",
    cases: [
      makeVideoCase("a1-basic-mp4", "1. Basic MP4 video", `src="/media-test/videos/sample-video.mp4" controls`, "Expected: MP4 plays with controls.", {
        src: videoAsset.mp4,
        controls: true,
        preload: "metadata",
        lazy: true,
        loading: "lazy",
        placeholder: true,
        poster: videoAsset.poster,
      }),
      makeVideoCase("a2-basic-webm", "2. Basic WebM video", `src="/media-test/videos/sample-video.webm" controls`, "Expected: WebM source should play directly.", {
        src: videoAsset.webm,
        controls: true,
        preload: "metadata",
        lazy: true,
        loading: "lazy",
        placeholder: true,
        poster: videoAsset.poster,
      }),
      makeVideoCase("a3-multi-webm-mp4", "3. Multiple sources: WebM first, MP4 fallback", `:sources="[{webm},{mp4}]" controls`, "Expected: browser tries WebM then MP4 fallback without navigation.", {
        controls: true,
        lazy: true,
        loading: "lazy",
        placeholder: true,
        poster: videoAsset.poster,
        preload: "metadata",
        sources: [
          { src: videoAsset.webm, type: "video/webm" },
          { src: videoAsset.mp4, type: "video/mp4" },
        ],
      }),
      makeVideoCase("a4-with-poster", "4. Video with poster", `poster="/media-test/videos/sample-poster.jpg"`, "Expected: poster is visible before playback.", {
        ...baseLazyVideoProps,
      }),
      makeVideoCase("a5-without-poster", "5. Video without poster", `no poster prop`, "Expected: loads without poster image and no navigation.", {
        ...baseLazyVideoProps,
        poster: undefined,
      }),
      makeVideoCase("a6-with-controls", "6. Video with controls", `controls`, "Expected: controls are visible and interactive.", {
        ...baseLazyVideoProps,
        controls: true,
      }),
      makeVideoCase("a7-without-controls", "7. Video without controls", `:controls="false"`, "Expected: no controls UI rendered.", {
        ...baseLazyVideoProps,
        controls: false,
      }),
    ],
  },
  {
    id: "B",
    title: "B. Loading modes",
    description: "Eager/lazy variations and reveal behavior.",
    cases: [
      makeVideoCase("b1-eager-video", "1. Eager video", `:lazy="false" loading="eager"`, "Expected: requests on initial render.", {
        src: videoAsset.q360,
        controls: true,
        lazy: false,
        loading: "eager",
        preload: "metadata",
        poster: videoAsset.poster,
      }),
      makeVideoCase("b2-lazy-video", "2. Lazy video", `lazy loading="lazy"`, "Expected: request starts only near viewport.", {
        ...baseLazyVideoProps,
      }),
      makeVideoCase("b3-lazy-far-below", "3. Lazy video far below fold", `lazy + spacer`, "Expected: no request until deep scroll.", {
        ...baseLazyVideoProps,
        src: videoAsset.lazyMp4,
      }, { spacerBefore: true }),
      makeVideoCase("b4-lazy-custom-root-margin", "4. Lazy video custom rootMargin", `root-margin="900px 0px"`, "Expected: reveals early via rootMargin.", {
        ...baseLazyVideoProps,
        rootMargin: "900px 0px",
      }),
      makeVideoCase("b5-lazy-custom-threshold", "5. Lazy video custom threshold", `threshold="0.4"`, "Expected: waits for more visibility before reveal.", {
        ...baseLazyVideoProps,
        threshold: 0.4,
      }),
      makeVideoCase("b6-lazy-preload-none", "6. Lazy video preload=none", `lazy preload="none"`, "Expected: remains none until reveal logic runs.", {
        ...baseLazyVideoProps,
        preload: "none",
      }),
      makeVideoCase("b7-lazy-preload-metadata-after-reveal", "7. Lazy preload metadata after reveal", `lazy preload="metadata"`, "Expected: SSR uses preload=none, reveal flips to metadata.", {
        ...baseLazyVideoProps,
        preload: "metadata",
      }),
      makeVideoCase("b8-eager-preload-metadata", "8. Eager preload metadata", `loading="eager" preload="metadata"`, "Expected: metadata preload on initial render.", {
        src: videoAsset.q360,
        controls: true,
        lazy: false,
        loading: "eager",
        preload: "metadata",
        poster: videoAsset.poster,
      }),
      makeVideoCase("b9-eager-preload-auto", "9. Eager preload auto", `loading="eager" preload="auto"`, "Expected: auto preload without route navigation.", {
        src: videoAsset.q360,
        controls: true,
        lazy: false,
        loading: "eager",
        preload: "auto",
        poster: videoAsset.poster,
      }),
    ],
  },
  {
    id: "C",
    title: "C. Playback modes",
    description: "Autoplay, muted, loop, and reduced motion behavior.",
    cases: [
      makeVideoCase("c1-muted-autoplay-loop", "1. Muted autoplay loop video", `autoplay muted loop`, "Expected: loops silently with autoplay policy compliance.", {
        ...baseLazyVideoProps,
        autoplay: true,
        muted: true,
        loop: true,
        controls: false,
        preload: "auto",
      }),
      makeVideoCase("c2-muted-autoplay-playsinline", "2. Muted autoplay playsinline", `autoplay muted playsinline`, "Expected: inline autoplay on supported devices.", {
        ...baseLazyVideoProps,
        autoplay: true,
        muted: true,
        playsinline: true,
        controls: false,
      }),
      makeVideoCase("c3-loop-only", "3. Loop-only video", `loop`, "Expected: loops when user starts playback.", {
        ...baseLazyVideoProps,
        loop: true,
      }),
      makeVideoCase("c4-muted-only", "4. Muted-only video", `muted`, "Expected: starts muted; no navigation side effects.", {
        ...baseLazyVideoProps,
        muted: true,
      }),
      makeVideoCase("c5-playsinline-only", "5. Playsinline-only video", `playsinline`, "Expected: requests inline playback mode.", {
        ...baseLazyVideoProps,
        playsinline: true,
      }),
      makeVideoCase("c6-reduced-motion", "6. Video respecting prefers-reduced-motion", `autoplay muted :force-autoplay="false"`, "Expected: autoplay is skipped under reduced motion.", {
        ...baseLazyVideoProps,
        autoplay: true,
        muted: true,
        forceAutoplay: false,
        controls: false,
      }),
      makeVideoCase("c7-force-autoplay", "7. Video with forceAutoplay", `autoplay muted :force-autoplay="true"`, "Expected: autoplay attempted even with reduced motion setting.", {
        ...baseLazyVideoProps,
        autoplay: true,
        muted: true,
        forceAutoplay: true,
        controls: false,
      }),
    ],
  },
  {
    id: "D",
    title: "D. Responsive / layout modes",
    description: "Aspect ratios, sizing, and container behavior.",
    cases: [
      makeVideoCase("d1-16-9", "1. 16:9 video", `aspect-ratio="16 / 9"`, "Expected: widescreen ratio maintained.", { ...baseLazyVideoProps, aspectRatio: "16 / 9" }),
      makeVideoCase("d2-4-3", "2. 4:3 video", `aspect-ratio="4 / 3"`, "Expected: 4:3 frame preserved.", { ...baseLazyVideoProps, aspectRatio: "4 / 3" }),
      makeVideoCase("d3-1-1", "3. 1:1 square video", `aspect-ratio="1 / 1"`, "Expected: square container.", { ...baseLazyVideoProps, aspectRatio: "1 / 1" }),
      makeVideoCase("d4-portrait", "4. Portrait video container", `aspect-ratio="9 / 16"`, "Expected: portrait layout container.", { ...baseLazyVideoProps, aspectRatio: "9 / 16" }),
      makeVideoCase("d5-full-width", "5. Full-width responsive video", `class="w-full"`, "Expected: fills container width responsively.", { ...baseLazyVideoProps }),
      makeVideoCase("d6-grid-card", "6. Video inside card grid", `card grid container`, "Expected: stable sizing in grid.", { ...baseLazyVideoProps, aspectRatio: "16 / 9" }),
      makeVideoCase("d7-narrow-mobile", "7. Video inside narrow mobile-like container", `max-width: 360px`, "Expected: no horizontal overflow in narrow container.", { ...baseLazyVideoProps }, {
        containerClass: "mx-auto max-w-[360px]",
      }),
      makeVideoCase("d8-fixed-size", "8. Video with fixed width/height", `:width="640" :height="360"`, "Expected: fixed dimensions respected.", {
        ...baseLazyVideoProps,
        width: 640,
        height: 360,
      }),
      makeVideoCase("d9-class-override", "9. Video with CSS class override", `class="ring-2 ring-emerald-400"`, "Expected: class styling applies cleanly.", { ...baseLazyVideoProps }, {
        containerClass: "ring-2 ring-emerald-400/80 rounded-2xl p-2",
      }),
      makeVideoCase("d10-inline-style", "10. Video with inline style override", `style="border-radius:24px; box-shadow:..."`, "Expected: inline style override applies.", {
        ...baseLazyVideoProps,
        style: "border-radius: 24px; box-shadow: 0 0 0 1px rgba(255,255,255,.15), 0 20px 40px rgba(0,0,0,.35);",
      }),
    ],
  },
  {
    id: "E",
    title: "E. Placeholder and poster tests",
    description: "Poster/placeholder/fallback combinations including breakage.",
    cases: [
      makeVideoCase("e1-placeholder-default", "1. placeholder=true default Resux logo", `placeholder`, "Expected: default placeholder logo before reveal.", { ...baseLazyVideoProps, placeholder: true }),
      makeVideoCase("e2-placeholder-custom-image", "2. Custom image placeholder", `placeholder="/media-test/videos/placeholder.jpg"`, "Expected: custom image placeholder visible.", { ...baseLazyVideoProps, placeholder: videoAsset.placeholder }),
      makeVideoCase("e3-placeholder-text", "3. Text placeholder", `placeholder="Loading video..."`, "Expected: text placeholder visible.", { ...baseLazyVideoProps, placeholder: "Loading video..." }),
      makeVideoCase("e4-placeholder-skeleton", "4. Skeleton placeholder", `placeholder="/media-test/videos/placeholder.jpg"`, "Expected: skeleton-like placeholder image.", { ...baseLazyVideoProps, placeholder: videoAsset.placeholder }),
      makeVideoCase("e5-poster-only", "5. Poster only", `poster="/media-test/videos/sample-poster.jpg"`, "Expected: poster shown before playback.", { ...baseLazyVideoProps, placeholder: undefined }),
      makeVideoCase("e6-poster-fallback-poster", "6. Poster with fallbackPoster", `poster + fallbackPoster`, "Expected: fallbackPoster available for error path.", {
        ...baseLazyVideoProps,
        poster: videoAsset.poster,
        fallbackPoster: videoAsset.poster,
      }),
      makeVideoCase("e7-broken-poster-fallback", "7. Broken poster with fallbackPoster", `poster=missing fallbackPoster=valid`, "Expected: fallbackPoster takes over.", {
        ...baseLazyVideoProps,
        poster: videoAsset.badPoster,
        fallbackPoster: videoAsset.poster,
      }),
      makeVideoCase("e8-broken-poster-placeholder", "8. Broken poster with placeholder", `poster=missing placeholder=true`, "Expected: placeholder remains visible.", {
        ...baseLazyVideoProps,
        poster: videoAsset.badPoster,
        placeholder: true,
      }),
      makeVideoCase("e9-broken-video-fallback", "9. Broken video with fallbackPoster", `src=missing fallbackPoster=valid`, "Expected: fallbackPoster after error, no reload.", {
        ...baseLazyVideoProps,
        src: videoAsset.badVideo,
        fallbackPoster: videoAsset.poster,
      }),
      makeVideoCase("e10-broken-video-text-placeholder", "10. Broken video with text placeholder", `src=missing placeholder="Video unavailable"`, "Expected: text placeholder/fallback state shown.", {
        ...baseLazyVideoProps,
        src: videoAsset.badVideo,
        placeholder: "Video unavailable",
      }),
      makeVideoCase("e11-broken-video-logo-placeholder", "11. Broken video with default logo placeholder", `src=missing placeholder=true`, "Expected: default placeholder persists on error.", {
        ...baseLazyVideoProps,
        src: videoAsset.badVideo,
        placeholder: true,
      }),
    ],
  },
  {
    id: "F",
    title: "F. Multiple source tests",
    description: "Source ordering, lazy source assignment, and failure handling.",
    cases: [
      makeVideoCase("f1-multi-eager", "1. Multiple sources eager", `:lazy="false" :sources="[webm,mp4]"`, "Expected: eager source resolution without router activity.", {
        controls: true,
        lazy: false,
        loading: "eager",
        preload: "none",
        poster: videoAsset.poster,
        sources: [
          { src: videoAsset.webm, type: "video/webm" },
          { src: videoAsset.mp4, type: "video/mp4" },
        ],
      }),
      makeVideoCase("f2-multi-lazy", "2. Multiple sources lazy", `lazy :sources="[webm,mp4]"`, "Expected: no source requests before reveal.", {
        ...baseLazyVideoProps,
        sources: [
          { src: videoAsset.webm, type: "video/webm" },
          { src: videoAsset.mp4, type: "video/mp4" },
        ],
      }),
      makeVideoCase("f3-multi-poster", "3. Multiple sources with poster", `poster + sources`, "Expected: poster shown while choosing source.", {
        ...baseLazyVideoProps,
        sources: [
          { src: videoAsset.webm, type: "video/webm" },
          { src: videoAsset.altMp4, type: "video/mp4" },
        ],
      }),
      makeVideoCase("f4-multi-placeholder", "4. Multiple sources with placeholder", `placeholder + sources`, "Expected: placeholder shown pre-reveal.", {
        ...baseLazyVideoProps,
        placeholder: videoAsset.placeholder,
        sources: [
          { src: videoAsset.webm, type: "video/webm" },
          { src: videoAsset.mp4, type: "video/mp4" },
        ],
      }),
      makeVideoCase("f5-multi-first-missing-second-valid", "5. First source missing, second works", `sources=[missing,mp4]`, "Expected: first failure then second source works.", {
        ...baseLazyVideoProps,
        sources: [
          { src: videoAsset.badVideo, type: "video/mp4" },
          { src: videoAsset.mp4, type: "video/mp4" },
        ],
      }),
      makeVideoCase("f6-multi-all-fail", "6. All sources fail + fallback placeholder", `sources=[missing,missing] fallbackPoster+placeholder`, "Expected: fallback placeholder state, no retry loop.", {
        ...baseLazyVideoProps,
        sources: [
          { src: videoAsset.badVideo, type: "video/mp4" },
          { src: "/media-test/videos/missing-video-2.mp4", type: "video/mp4" },
        ],
        fallbackPoster: videoAsset.poster,
        placeholder: "All sources failed",
      }),
      makeVideoCase("f7-multi-no-request-before-reveal", "7. No requests before lazy reveal", `lazy + sources + root-margin="0px"`, "Expected: source requests start only on intersection.", {
        ...baseLazyVideoProps,
        rootMargin: "0px 0px",
        threshold: 0.01,
        sources: [
          { src: videoAsset.webm, type: "video/webm" },
          { src: videoAsset.mp4, type: "video/mp4" },
        ],
      }),
      makeVideoCase("f8-multi-no-dup-requests-after-nav", "8. No duplicate source requests after navigation", `lazy + sources + debug attrs`, "Expected: one reveal/load cycle after route return.", {
        ...baseLazyVideoProps,
        sources: [
          { src: videoAsset.webm, type: "video/webm" },
          { src: videoAsset.mp4, type: "video/mp4" },
        ],
      }),
    ],
  },
  {
    id: "G",
    title: "G. Speed control tests",
    description: "Built-in speed UI behavior across lazy/eager/navigation paths.",
    cases: [
      makeVideoCase("g1-speed-default", "1. Speed control with default speeds", `speed-control`, "Expected: default speeds cycle in control.", {
        ...baseLazyVideoProps,
        speedControl: true,
      }),
      makeVideoCase("g2-speed-custom", "2. Speed control custom speeds", `speed-control :speeds="[0.25,0.5,1,1.25,1.5,2]"`, "Expected: custom list cycles in order.", {
        ...baseLazyVideoProps,
        speedControl: true,
        speeds: [0.25, 0.5, 1, 1.25, 1.5, 2],
      }),
      makeVideoCase("g3-speed-default-1-25", "3. Speed defaultSpeed=1.25", `speed-control :default-speed="1.25"`, "Expected: initial speed label starts at 1.25x.", {
        ...baseLazyVideoProps,
        speedControl: true,
        defaultSpeed: 1.25,
      }),
      makeVideoCase("g4-speed-hide-icon", "4. showSpeedIcon=false", `speed-control :show-speed-icon="false"`, "Expected: speed text shown without icon.", {
        ...baseLazyVideoProps,
        speedControl: true,
        showSpeedIcon: false,
      }),
      makeVideoCase("g5-speed-custom-label", "5. Custom speed label", `speed-control speed-label="Rate"`, "Expected: button aria label uses custom text.", {
        ...baseLazyVideoProps,
        speedControl: true,
        speedLabel: "Rate",
      }),
      makeVideoCase("g6-speed-lazy", "6. Speed control on lazy video", `lazy speed-control`, "Expected: speed works after lazy reveal.", {
        ...baseLazyVideoProps,
        speedControl: true,
      }),
      makeVideoCase("g7-speed-eager", "7. Speed control on eager video", `:lazy="false" loading="eager" speed-control`, "Expected: speed control works eagerly.", {
        src: videoAsset.q360,
        controls: true,
        lazy: false,
        loading: "eager",
        poster: videoAsset.poster,
        preload: "metadata",
        speedControl: true,
      }),
      makeVideoCase("g8-speed-after-nav", "8. Speed control after client-side navigation", `speed-control + debug`, "Expected: still one controls init after returning to /media.", {
        ...baseLazyVideoProps,
        speedControl: true,
      }),
      makeVideoCase("g9-speed-no-hard-refresh", "9. Speed control must not hard refresh", `speed-control`, "Expected: clicking speed never reloads page.", {
        ...baseLazyVideoProps,
        speedControl: true,
      }),
      makeVideoCase("g10-speed-no-router-nav", "10. Speed control must not trigger router nav", `speed-control`, "Expected: speed clicks are ignored by router interceptor.", {
        ...baseLazyVideoProps,
        speedControl: true,
      }),
    ],
  },
  {
    id: "H",
    title: "H. Quality control tests",
    description: "In-video quality selector behavior across lazy/eager/runtime scenarios.",
    cases: [
      makeVideoCase("h1-quality-selector-enabled", "1. Quality selector enabled", `quality-control + :qualities (in-player)`, "Expected: selecting quality swaps source in-place."),
      makeVideoCase("h2-quality-default", "2. Quality selector with defaultQuality", `default quality = 720p`, "Expected: starts on configured default quality."),
      makeVideoCase("h3-quality-no-default", "3. Quality selector without defaultQuality", `no default, first option fallback`, "Expected: first quality option used."),
      makeVideoCase("h4-quality-360-720-1080", "4. 360p/720p/1080p assets", `sample-360/sample-720/sample-1080`, "Expected: all local quality assets are selectable."),
      makeVideoCase("h5-quality-one-missing", "5. One missing quality source", `include missing quality URL`, "Expected: missing quality handled without reload."),
      makeVideoCase("h6-quality-advanced-source", "6. Advanced per-quality sources", `webm+mp4 for each quality`, "Expected: format fallback works per selected quality."),
      makeVideoCase("h7-quality-lazy", "7. Quality selector on lazy video", `lazy + selector`, "Expected: no request until reveal."),
      makeVideoCase("h8-quality-eager", "8. Quality selector on eager video", `eager + selector`, "Expected: selected source loads eagerly."),
      makeVideoCase("h9-quality-preserve-time", "9. Quality switch preserves time", `capture currentTime and restore`, "Expected: time is restored after switch."),
      makeVideoCase("h10-quality-resume-if-playing", "10. Quality switch resumes if playing", `capture paused state`, "Expected: auto-resume only when previously playing."),
      makeVideoCase("h11-quality-no-refresh", "11. Quality switch no hard refresh", `selector interactions`, "Expected: no document reload."),
      makeVideoCase("h12-quality-no-router-nav", "12. Quality switch no router nav", `in-player selector + controls`, "Expected: no route navigation."),
      makeVideoCase("h13-quality-after-nav", "13. Quality control after navigation", `navigate away/back`, "Expected: selector and video still function."),
      makeVideoCase("h14-quality-far-below", "14. Far-below-fold quality control", `quality harness below spacer`, "Expected: delayed loading until deep scroll."),
    ],
  },
  {
    id: "I",
    title: "I. Combined controls",
    description: "Speed + quality combined scenarios.",
    cases: [
      makeVideoCase("i1-speed-quality", "1. Speed + quality controls together", `speed-control + quality-control (in-player)`, "Expected: both controls coexist."),
      makeVideoCase("i2-speed-quality-lazy", "2. Speed + quality + lazy", `lazy + speed-control + quality-control`, "Expected: lazy reveal then both controls work."),
      makeVideoCase("i3-speed-quality-poster", "3. Speed + quality + poster", `poster + controls`, "Expected: poster shown before load."),
      makeVideoCase("i4-speed-quality-placeholder", "4. Speed + quality + placeholder", `placeholder + controls`, "Expected: placeholder behavior maintained."),
      makeVideoCase("i5-speed-quality-multi-format", "5. Speed + quality + multiple formats", `webm+mp4 per quality`, "Expected: format fallback preserved."),
      makeVideoCase("i6-speed-quality-broken-fallback", "6. Speed + quality + broken source fallback", `quality includes missing URL`, "Expected: broken quality path handled safely."),
      makeVideoCase("i7-speed-quality-grid", "7. Speed + quality in responsive grid", `grid layout`, "Expected: controls stay usable in grid."),
      makeVideoCase("i8-speed-quality-far-below", "8. Speed + quality far below fold", `spacer + lazy`, "Expected: delayed load + controls still functional."),
    ],
  },
  {
    id: "J",
    title: "J. Error and edge cases",
    description: "Invalid/missing source permutations and failure handling.",
    cases: [
      makeVideoCase("j1-missing-src", "1. Missing video source", `src="/media-test/videos/missing-video.mp4"`, "Expected: error state + fallback path, no reload.", {
        ...baseLazyVideoProps,
        src: videoAsset.badVideo,
        fallbackPoster: videoAsset.poster,
      }),
      makeVideoCase("j2-missing-first-valid-second", "2. Missing first source, valid second source", `sources=[missing,mp4]`, "Expected: second source used.", {
        ...baseLazyVideoProps,
        sources: [
          { src: videoAsset.badVideo, type: "video/mp4" },
          { src: videoAsset.mp4, type: "video/mp4" },
        ],
      }),
      makeVideoCase("j3-missing-all-sources", "3. Missing all sources", `sources=[missing,missing]`, "Expected: fallback placeholder state, no loops.", {
        ...baseLazyVideoProps,
        sources: [
          { src: videoAsset.badVideo, type: "video/mp4" },
          { src: "/media-test/videos/missing-video-2.mp4", type: "video/mp4" },
        ],
        placeholder: "Missing all sources",
      }),
      makeVideoCase("j4-invalid-url", "4. Invalid video URL", `src="/media-test/videos/%%%bad%%%.mp4"`, "Expected: handled as error without navigation.", {
        ...baseLazyVideoProps,
        src: "/media-test/videos/%%%bad%%%.mp4",
      }),
      makeVideoCase("j5-empty-src", "5. Empty src", `src=""`, "Expected: no crash and no route navigation.", {
        ...baseLazyVideoProps,
        src: "",
      }),
      makeVideoCase("j6-null-src", "6. src=null", `:src="null"`, "Expected: no source assignment; stable UI.", {
        ...baseLazyVideoProps,
        src: nil,
      }),
      makeVideoCase("j7-empty-sources", "7. sources=[]", `:sources="[]"`, "Expected: handles empty sources array safely.", {
        ...baseLazyVideoProps,
        sources: [],
      }),
      makeVideoCase("j8-empty-qualities", "8. qualities=[] (selector harness)", `quality options = []`, "Expected: selector disabled safely."),
      makeVideoCase("j9-missing-default-quality", "9. Missing selected defaultQuality", `default quality not in options`, "Expected: fallback quality chosen."),
      makeVideoCase("j10-invalid-quality-source", "10. Invalid selected quality source", `quality url missing`, "Expected: error fallback and no hard refresh."),
      makeVideoCase("j11-broken-poster", "11. Broken poster", `poster=missing`, "Expected: poster fail does not reload app.", {
        ...baseLazyVideoProps,
        poster: videoAsset.badPoster,
      }),
      makeVideoCase("j12-broken-fallback-poster", "12. Broken fallbackPoster", `fallbackPoster=missing`, "Expected: placeholder path still safe.", {
        ...baseLazyVideoProps,
        src: videoAsset.badVideo,
        fallbackPoster: videoAsset.badPoster,
      }),
      makeVideoCase("j13-no-infinite-retry", "13. Error must not retry forever", `broken source + observe network`, "Expected: one failure path, no infinite retries.", {
        ...baseLazyVideoProps,
        src: videoAsset.badVideo,
      }),
      makeVideoCase("j14-no-hard-refresh-on-error", "14. Error must not hard refresh", `broken source`, "Expected: no document reload.", {
        ...baseLazyVideoProps,
        src: videoAsset.badVideo,
      }),
      makeVideoCase("j15-no-duplicate-load-calls", "15. Error must not duplicate video.load()", `broken source + lazy`, "Expected: no repeated load loop for same failed source.", {
        ...baseLazyVideoProps,
        src: videoAsset.badVideo,
      }),
    ],
  },
  {
    id: "K",
    title: "K. Navigation / runtime activation tests",
    description: "Manual runtime checks for SPA navigation and re-activation idempotency.",
    cases: [
      makeVideoCase("k1-direct-load-media", "1. Direct load /media", `open /media directly`, "Expected: no hard refresh while revealing videos."),
      makeVideoCase("k2-navigate-away-back", "2. Navigate away and back to /media", `use app links`, "Expected: videos initialize once and still lazy-load correctly."),
      makeVideoCase("k3-browser-history", "3. Browser back/forward", `history back/forward`, "Expected: no duplicate observers or listeners."),
      makeVideoCase("k4-scroll-after-nav", "4. Scroll into video section after navigation", `navigate then scroll`, "Expected: in-place reveal only."),
      makeVideoCase("k5-speed-after-nav", "5. Speed control after navigation", `change route then adjust speed`, "Expected: speed control still works without reload."),
      makeVideoCase("k6-quality-after-nav", "6. Quality control after navigation", `change route then quality switch`, "Expected: quality switch still works safely."),
      makeVideoCase("k7-far-below-after-nav", "7. Far-below-fold lazy video after navigation", `navigate back then deep scroll`, "Expected: loads when near viewport."),
      makeVideoCase("k8-no-duplicate-observers", "8. No duplicate observers after navigation", `inspect data-resux-observed`, "Expected: one observation cycle per element."),
      makeVideoCase("k9-no-duplicate-listeners", "9. No duplicate listeners after navigation", `interact controls repeatedly`, "Expected: no multi-fire handler behavior."),
      makeVideoCase("k10-no-hard-refresh-any-point", "10. No hard refresh at any point", `watch network + scroll position`, "Expected: no full document reload."),
    ],
  },
];

const qualityControlOptions = [
  {
    id: "360p",
    label: "360p",
    sources: [
      { src: videoAsset.webm, type: "video/webm" },
      { src: videoAsset.q360, type: "video/mp4" },
    ],
  },
  {
    id: "720p",
    label: "720p",
    sources: [
      { src: videoAsset.webm, type: "video/webm" },
      { src: videoAsset.q720, type: "video/mp4" },
    ],
  },
  {
    id: "1080p",
    label: "1080p",
    sources: [
      { src: videoAsset.webm, type: "video/webm" },
      { src: videoAsset.q1080, type: "video/mp4" },
    ],
  },
  {
    id: "missing",
    label: "Missing quality",
    sources: [
      { src: "/media-test/videos/missing-quality.webm", type: "video/webm" },
      { src: "/media-test/videos/missing-quality.mp4", type: "video/mp4" },
    ],
  },
];

</script>

<template>
  <section class="grid gap-4 overflow-x-hidden sm:gap-6 lg:gap-8">
    <header class="panel min-w-0 p-4 sm:p-6 lg:p-8">
      <p class="text-xs font-bold uppercase tracking-[0.35em] text-cyan-200 sm:text-sm">Resux Media QA</p>
      <h1 class="mt-3 text-2xl font-black text-white sm:text-3xl lg:text-4xl">ResuxImg, ResuxPicture, ResuxVideo</h1>
      <p class="mt-4 max-w-4xl text-sm text-slate-300 sm:text-base">
        Responsive media regression page for lazy loading, placeholders, fallback behavior, cache URLs, and quality/format handling.
        Open browser network tab and verify lazy assets are not requested before scrolling into view.
      </p>
      <div class="mt-5 grid gap-2 text-xs font-semibold text-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        <span class="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">Expected: lazy item should not request before scroll</span>
        <span class="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">Expected: one 404, then fallback</span>
        <span class="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">Expected: video placeholder after failed video</span>
        <span class="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">Expected: works after client-side navigation, no hard refresh</span>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-xs text-cyan-100">
          <p class="font-semibold uppercase tracking-[0.2em] text-cyan-300">Cache URL (1d)</p>
          <p class="mt-2 break-all">{{ cachedGeneratedUrl }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-xs text-cyan-100">
          <p class="font-semibold uppercase tracking-[0.2em] text-cyan-300">Cache URL (7d)</p>
          <p class="mt-2 break-all">{{ cachedExpiryUrl }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-xs text-cyan-100">
          <p class="font-semibold uppercase tracking-[0.2em] text-cyan-300">No Format/Quality URL</p>
          <p class="mt-2 break-all">{{ noFormatNoQualityUrl }}</p>
        </div>
      </div>
    </header>

    <section class="panel min-w-0 p-4 sm:p-6 lg:p-8">
      <p class="text-xs font-bold uppercase tracking-[0.35em] text-cyan-200 sm:text-sm">ResuxImg</p>
      <h2 class="mt-3 text-xl font-black text-white sm:text-2xl">Lazy placeholders, fallback, format and cache behavior</h2>
      <div class="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article
          v-for="entry in imgCases"
          :key="entry.id"
          :data-media-case="entry.id"
          class="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/65 p-3 sm:p-4"
        >
          <p class="text-sm font-semibold text-white">{{ entry.title }}</p>
          <pre class="mt-2 overflow-x-auto rounded-xl bg-slate-900/70 p-2 text-[11px] text-cyan-100">{{ entry.propsCode }}</pre>
          <p v-if="entry.expected" class="mt-2 text-xs font-semibold text-cyan-100">{{ entry.expected }}</p>
          <ResuxImg
            class="mt-3 h-auto w-full rounded-2xl border border-white/10 object-cover"
            :src="entry.src"
            :alt="entry.alt"
            :width="entry.width"
            :height="entry.height"
            :sizes="entry.sizes"
            :quality="entry.quality"
            :format="entry.format"
            :cache="entry.cache"
            :modifiers="entry.modifiers"
            :lazy="entry.lazy"
            :loading="entry.loading"
            :root-margin="entry.rootMargin ?? '0px 0px'"
            :threshold="entry.threshold ?? 0"
            :placeholder="entry.placeholder"
            :placeholder-class="entry.placeholderClass"
            :placeholder-style="entry.placeholderStyle"
            :fallback-src="entry.fallbackSrc"
            decoding="async"
            fit="cover"
          />
        </article>
      </div>
    </section>

    <section class="panel min-w-0 p-4 sm:p-6 lg:p-8">
      <p class="text-xs font-bold uppercase tracking-[0.35em] text-purple-200 sm:text-sm">ResuxPicture</p>
      <h2 class="mt-3 text-xl font-black text-white sm:text-2xl">Multi-source picture, placeholder, fallback, quality controls</h2>
      <div class="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article
          v-for="entry in pictureCases"
          :key="entry.id"
          class="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/65 p-3 sm:p-4"
        >
          <p class="text-sm font-semibold text-white">{{ entry.title }}</p>
          <pre class="mt-2 overflow-x-auto rounded-xl bg-slate-900/70 p-2 text-[11px] text-purple-100">{{ entry.propsCode }}</pre>
          <p v-if="entry.expected" class="mt-2 text-xs font-semibold text-purple-100">{{ entry.expected }}</p>
          <ResuxPicture
            class="mt-3 h-auto w-full rounded-2xl border border-white/10 object-cover"
            :src="entry.src"
            :sources="entry.sources"
            :fallback="entry.fallback"
            :fallback-src="entry.fallbackSrc"
            :alt="entry.alt"
            :formats="entry.formats"
            :format="entry.format"
            :quality="entry.quality"
            :width="entry.width"
            :height="entry.height"
            :cache="entry.cache"
            :modifiers="entry.modifiers"
            :sizes="entry.sizes"
            :widths="entry.widths"
            :lazy="true"
            loading="lazy"
            :root-margin="entry.rootMargin ?? '0px 0px'"
            :threshold="entry.threshold ?? 0"
            :placeholder="entry.placeholder"
            :placeholder-class="entry.placeholderClass"
            :placeholder-style="entry.placeholderStyle"
          />
        </article>
      </div>
    </section>

    <section class="panel min-w-0 p-4 sm:p-6 lg:p-8">
      <p class="text-xs font-bold uppercase tracking-[0.35em] text-emerald-200 sm:text-sm">ResuxVideo</p>
      <h2 class="mt-3 text-xl font-black text-white sm:text-2xl">Lazy load, poster/placeholder/fallback, multi-source</h2>
      <div class="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article
          v-for="entry in videoCases"
          :key="entry.id"
          :data-media-case="entry.id"
          class="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/65 p-3 sm:p-4"
        >
          <p class="text-sm font-semibold text-white">{{ entry.title }}</p>
          <pre class="mt-2 overflow-x-auto rounded-xl bg-slate-900/70 p-2 text-[11px] text-emerald-100">{{ entry.propsCode }}</pre>
          <p v-if="entry.expected" class="mt-2 text-xs font-semibold text-emerald-100">{{ entry.expected }}</p>
          <ResuxVideo
            class="mt-3 w-full rounded-2xl border border-white/10 bg-black"
            :src="entry.src"
            :sources="entry.sources"
            :poster="entry.poster"
            :fallback-poster="entry.fallbackPoster"
            :width="entry.width ?? 1280"
            :height="entry.height ?? 720"
            :controls="entry.controls"
            :autoplay="entry.autoplay"
            :muted="entry.muted"
            :loop="entry.loop"
            :playsinline="entry.playsinline"
            :preload="entry.preload"
            :lazy="entry.lazy"
            :loading="entry.loading"
            :placeholder="entry.placeholder"
            :aspect-ratio="entry.aspectRatio ?? '16 / 9'"
            :root-margin="entry.rootMargin ?? '0px 0px'"
            :threshold="entry.threshold ?? 0.01"
            :title="entry.title"
            :aria-label="entry.title"
            :controls-color="entry.controlsColor"
            :controls-background="entry.controlsBackground"
            :controls-accent="entry.controlsAccent"
            :controls-icon-play="entry.controlsIconPlay"
            :controls-icon-pause="entry.controlsIconPause"
            :controls-icon-mute="entry.controlsIconMute"
            :controls-icon-unmute="entry.controlsIconUnmute"
            :controls-icon-fullscreen="entry.controlsIconFullscreen"
            :controls-icon-exit-fullscreen="entry.controlsIconExitFullscreen"
            :native-controls="entry.nativeControls"
            :speed-control="entry.speedControl"
            :speeds="entry.speeds"
            :default-speed="entry.defaultSpeed"
            :show-speed-icon="entry.showSpeedIcon"
            :speed-label="entry.speedLabel"
            :quality-control="entry.qualityControl"
            :qualities="entry.qualities"
            :default-quality="entry.defaultQuality"
            :show-quality-icon="entry.showQualityIcon"
            :quality-label="entry.qualityLabel"
          />
        </article>
      </div>
      <article class="mt-5 min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/65 p-3 sm:p-4">
        <p class="text-sm font-semibold text-white">Video quality setting control test (in-video UI)</p>
        <pre class="mt-2 overflow-x-auto rounded-xl bg-slate-900/70 p-2 text-[11px] text-emerald-100">quality-control + :qualities + speed-control inside ResuxVideo overlay</pre>
        <p class="mt-2 text-xs text-emerald-100">
          Quality and speed controls are rendered inside the video UI. Switching quality should update source selection in-place without a full-page reload.
        </p>
        <ResuxVideo
          class="mt-3 w-full rounded-2xl border border-white/10 bg-black"
          :sources="qualityControlOptions[1].sources"
          :qualities="qualityControlOptions"
          quality-control
          default-quality="720p"
          quality-label="Quality"
          :show-quality-icon="true"
          poster="/media-test/videos/sample-poster.jpg"
          :width="1280"
          :height="720"
          aspect-ratio="16 / 9"
          controls
          lazy
          loading="lazy"
          root-margin="0px 0px"
          threshold="0.01"
          placeholder="Quality profile lazy reveal"
          preload="metadata"
          speed-control
          :speeds="[0.5, 0.75, 1, 1.25, 1.5, 2]"
          :default-speed="1"
          speed-label="Playback speed"
          :show-speed-icon="true"
          aria-label="Video quality setting control test"
          title="Video quality setting control test"
          data-video-quality-inline="primary"
        />
        <ResuxVideo
          class="mt-4 w-full rounded-2xl border border-white/10 bg-black"
          :sources="qualityControlOptions[0].sources"
          :qualities="qualityControlOptions"
          quality-control
          :show-quality-icon="false"
          quality-label="Resolution"
          :width="1280"
          :height="720"
          controls
          :lazy="false"
          loading="eager"
          preload="metadata"
          :placeholder="true"
          speed-control
          :default-speed="1.25"
          speed-label="Playback"
          :show-speed-icon="false"
          aria-label="Video quality setting control test no default quality"
          title="Video quality setting control test no default quality"
          data-video-quality-inline="no-default"
        />
      </article>
    </section>

    <section class="panel min-w-0 p-4 sm:p-6 lg:p-8" data-video-test-suite="advanced-hero-skip-chunk">
      <p class="text-xs font-bold uppercase tracking-[0.35em] text-cyan-200 sm:text-sm">ResuxVideo Advanced</p>
      <h2 class="mt-3 text-xl font-black text-white sm:text-2xl">Hero preload, deferred chunk loading, and skip overlay controls</h2>
      <p class="mt-3 text-sm text-slate-300">
        Advanced runtime checks for click-to-skip zones, hero/preload hints, and poster-first deferred loading. Expected behavior:
        no hard refresh, no scroll reset, no router navigation, and one reveal/load cycle per video.
      </p>
      <div class="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article
          v-for="entry in advancedVideoCases"
          :key="entry.id"
          class="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/65 p-3 sm:p-4"
          :data-video-advanced-case="entry.id"
        >
          <p class="text-sm font-semibold text-white">{{ entry.title }}</p>
          <pre class="mt-2 overflow-x-auto rounded-xl bg-slate-900/70 p-2 text-[11px] text-cyan-100">{{ entry.propsCode }}</pre>
          <p class="mt-2 text-xs text-cyan-100">{{ entry.expected }}</p>
          <ResuxVideo
            class="mt-3 w-full rounded-2xl border border-white/10 bg-black"
            :src="entry.src"
            :sources="entry.sources"
            :poster="entry.poster"
            :fallback-poster="entry.fallbackPoster"
            :width="entry.width ?? 1280"
            :height="entry.height ?? 720"
            :controls="entry.controls ?? true"
            :autoplay="entry.autoplay"
            :muted="entry.muted"
            :loop="entry.loop"
            :playsinline="entry.playsinline"
            :preload="entry.preload ?? 'metadata'"
            :lazy="entry.lazy ?? true"
            :loading="entry.loading ?? 'lazy'"
            :placeholder="entry.placeholder ?? true"
            :aspect-ratio="entry.aspectRatio ?? '16 / 9'"
            :root-margin="entry.rootMargin ?? '0px 0px'"
            :threshold="entry.threshold ?? 0.01"
            :hero="entry.hero"
            :priority="entry.priority"
            :preload-link="entry.preloadLink"
            :chunk-loading="entry.chunkLoading"
            :chunked="entry.chunked"
            :defer-until-page-ready="entry.deferUntilPageReady"
            :reveal-on-page-ready="entry.revealOnPageReady"
            :fetchpriority="entry.fetchPriority"
            :speed-control="entry.speedControl"
            :speeds="entry.speeds"
            :default-speed="entry.defaultSpeed"
            :show-speed-icon="entry.showSpeedIcon"
            :speed-label="entry.speedLabel"
            :quality-control="entry.qualityControl"
            :qualities="entry.qualities"
            :default-quality="entry.defaultQuality"
            :show-quality-icon="entry.showQualityIcon"
            :quality-label="entry.qualityLabel"
            :skip-controls="entry.skipControls"
            :skip-seconds="entry.skipSeconds"
            :skip-backward-seconds="entry.skipBackwardSeconds"
            :skip-forward-seconds="entry.skipForwardSeconds"
            :show-skip-overlay="entry.showSkipOverlay"
            :skip-label="entry.skipLabel"
            :disable-skip-on-controls="entry.disableSkipOnControls"
            :title="entry.title"
            :aria-label="entry.title"
            :data-video-test-id="entry.id"
            :data-video-test-debug="`advanced-${entry.id}`"
          />
        </article>
      </div>
    </section>

    <section class="panel min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8" data-video-test-suite="full-capabilities">
      <p class="text-xs font-bold uppercase tracking-[0.35em] text-sky-200 sm:text-sm">ResuxVideo Capability Matrix</p>
      <h2 class="mt-3 text-xl font-black text-white sm:text-2xl">Full ResuxVideo capability tests</h2>
      <p class="mt-3 text-sm text-slate-300">
        This section validates all supported ResuxVideo behavior in grouped scenarios A-K. Groups are collapsible and mounted on demand
        to keep initial page load lighter while still covering lazy reveal, controls, fallbacks, speed, quality, and runtime navigation behavior.
      </p>
      <div class="mt-4 grid gap-2 text-xs font-semibold text-slate-200 sm:grid-cols-2 xl:grid-cols-4">
        <span class="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">No hard refresh allowed while scrolling or interacting.</span>
        <span class="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">Router must ignore media/control interactions.</span>
        <span class="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">Most tests are lazy to reduce initial network load.</span>
        <span class="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2">Each card includes debug attributes for DevTools checks.</span>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-4">
        <article
          v-for="group in fullResuxVideoCapabilityGroups"
          :key="group.id"
          class="rounded-3xl border border-white/10 bg-slate-950/65 p-3 sm:p-4"
          :data-video-test-group="group.id"
        >
          <details class="group/details" :open="group.id === 'A'">
            <summary
              class="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-left"
              :data-video-group-toggle="group.id"
            >
              <span>
                <span class="block text-sm font-semibold text-white">{{ group.title }}</span>
                <span class="mt-1 block text-xs text-slate-300">{{ group.description }}</span>
              </span>
              <span class="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200 group-open/details:hidden">Expand</span>
              <span class="hidden text-xs font-bold uppercase tracking-[0.18em] text-cyan-200 group-open/details:inline">Collapse</span>
            </summary>

            <div class="mt-4 space-y-4">
            <div class="grid grid-cols-1 gap-4 2xl:grid-cols-2">
              <article
                v-for="entry in group.cases"
                :key="entry.id"
                class="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 p-3"
                :data-video-test-id="entry.id"
                :data-video-test-group-case="group.id"
              >
                <p class="text-sm font-semibold text-white">{{ entry.title }}</p>
                <pre class="mt-2 overflow-x-auto rounded-xl bg-slate-900/70 p-2 text-[11px] text-sky-100">{{ entry.propsCode }}</pre>
                <p class="mt-2 text-xs text-slate-300">{{ entry.expected }}</p>

                <ul v-if="entry.checklist?.length" class="mt-2 space-y-1 text-xs text-slate-300">
                  <li v-for="step in entry.checklist" :key="step">• {{ step }}</li>
                </ul>

                <div v-if="entry.spacerBefore" class="mt-3 h-[42vh] rounded-2xl border border-dashed border-white/20 bg-slate-900/40" />
                <div
                  v-if="entry.props"
                  class="mt-3"
                  :class="entry.containerClass"
                  :style="entry.containerStyle"
                  :data-video-test-wrapper="entry.id"
                >
                  <ResuxVideo
                    class="w-full rounded-2xl border border-white/10 bg-black"
                    :src="entry.props.src"
                    :sources="entry.props.sources"
                    :poster="entry.props.poster"
                    :fallback-poster="entry.props.fallbackPoster"
                    :width="entry.props.width ?? 1280"
                    :height="entry.props.height ?? 720"
                    :controls="entry.props.controls ?? true"
                    :autoplay="entry.props.autoplay"
                    :muted="entry.props.muted"
                    :loop="entry.props.loop"
                    :playsinline="entry.props.playsinline"
                    :preload="entry.props.preload ?? 'metadata'"
                    :lazy="entry.props.lazy ?? true"
                    :loading="entry.props.loading ?? 'lazy'"
                    :placeholder="entry.props.placeholder ?? true"
                    :aspect-ratio="entry.props.aspectRatio ?? '16 / 9'"
                    :root-margin="entry.props.rootMargin ?? '0px 0px'"
                    :threshold="entry.props.threshold ?? 0.01"
                    :title="entry.title"
                    :aria-label="entry.title"
                    :controls-color="entry.props.controlsColor"
                    :controls-background="entry.props.controlsBackground"
                    :controls-accent="entry.props.controlsAccent"
                    :controls-icon-play="entry.props.controlsIconPlay"
                    :controls-icon-pause="entry.props.controlsIconPause"
                    :controls-icon-mute="entry.props.controlsIconMute"
                    :controls-icon-unmute="entry.props.controlsIconUnmute"
                    :controls-icon-fullscreen="entry.props.controlsIconFullscreen"
                    :controls-icon-exit-fullscreen="entry.props.controlsIconExitFullscreen"
                    :native-controls="entry.props.nativeControls"
                    :speed-control="entry.props.speedControl"
                    :speeds="entry.props.speeds"
                    :default-speed="entry.props.defaultSpeed"
                    :show-speed-icon="entry.props.showSpeedIcon"
                    :speed-label="entry.props.speedLabel"
                    :quality-control="entry.props.qualityControl"
                    :qualities="entry.props.qualities"
                    :default-quality="entry.props.defaultQuality"
                    :show-quality-icon="entry.props.showQualityIcon"
                    :quality-label="entry.props.qualityLabel"
                    :force-autoplay="entry.props.forceAutoplay"
                    :hero="entry.props.hero"
                    :priority="entry.props.priority"
                    :preload-link="entry.props.preloadLink"
                    :chunk-loading="entry.props.chunkLoading"
                    :chunked="entry.props.chunked"
                    :defer-until-page-ready="entry.props.deferUntilPageReady"
                    :reveal-on-page-ready="entry.props.revealOnPageReady"
                    :fetchpriority="entry.props.fetchPriority"
                    :skip-controls="entry.props.skipControls"
                    :skip-seconds="entry.props.skipSeconds"
                    :skip-backward-seconds="entry.props.skipBackwardSeconds"
                    :skip-forward-seconds="entry.props.skipForwardSeconds"
                    :show-skip-overlay="entry.props.showSkipOverlay"
                    :skip-label="entry.props.skipLabel"
                    :disable-skip-on-controls="entry.props.disableSkipOnControls"
                    :style="entry.props.style"
                    :data-video-test-id="entry.id"
                    :data-video-test-debug="entry.debugTag"
                    :data-video-test-group="group.id"
                  />
                </div>
              </article>
            </div>

            <article
              v-if="group.id === 'H'"
              class="rounded-2xl border border-emerald-300/20 bg-emerald-950/20 p-3"
              data-video-quality-harness="primary"
              data-video-test-id="quality-harness-primary"
            >
              <p class="text-sm font-semibold text-white">Quality harness: selector + preserve-time + resume-if-playing</p>
              <pre class="mt-2 overflow-x-auto rounded-xl bg-slate-900/70 p-2 text-[11px] text-emerald-100">buttons/select switch quality -> capture currentTime + playing state -> remount -> restore</pre>
              <p class="mt-2 text-xs text-emerald-100">
                Expected: switching quality should not hard refresh, should preserve approximate playback time, and resume only if the video was already playing.
              </p>
              <p class="mt-2 text-xs text-slate-300">
                Manual check: use in-video quality selector while playing and verify time continuity and playback resume behavior.
              </p>
              <ResuxVideo
                class="mt-3 w-full rounded-2xl border border-white/10 bg-black"
                :sources="qualityControlOptions[1].sources"
                :qualities="qualityControlOptions"
                quality-control
                default-quality="720p"
                quality-label="Quality"
                :show-quality-icon="true"
                :poster="videoAsset.poster"
                :fallback-poster="videoAsset.poster"
                :width="1280"
                :height="720"
                controls
                lazy
                loading="lazy"
                root-margin="0px 0px"
                threshold="0.01"
                :placeholder="true"
                preload="metadata"
                speed-control
                :speeds="[0.5, 0.75, 1, 1.25, 1.5, 2]"
                :default-speed="1"
                speed-label="Playback speed"
                :show-speed-icon="true"
                aria-label="Quality control harness primary"
                title="Quality control harness primary"
                data-video-test-id="harness-quality-primary-video"
              />

              <ResuxVideo
                class="mt-3 w-full rounded-2xl border border-white/10 bg-black"
                :sources="qualityControlOptions[0].sources"
                :qualities="qualityControlOptions"
                quality-control
                :default-quality="none"
                :show-quality-icon="false"
                quality-label="Resolution"
                :poster="videoAsset.poster"
                :width="1280"
                :height="720"
                :lazy="false"
                loading="eager"
                preload="metadata"
                controls
                speed-control
                :default-speed="1.25"
                speed-label="No-default selector"
                :show-speed-icon="false"
                aria-label="Quality selector without default quality"
                title="Quality selector without default quality"
                data-video-test-id="harness-quality-no-default-video"
              />
              <ResuxVideo
                class="mt-3 w-full rounded-2xl border border-white/10 bg-black"
                :sources="qualityControlOptions[3].sources"
                :qualities="qualityControlOptions"
                quality-control
                default-quality="missing"
                :poster="videoAsset.poster"
                :fallback-poster="videoAsset.poster"
                :width="1280"
                :height="720"
                controls
                lazy
                loading="lazy"
                root-margin="0px 0px"
                threshold="0.01"
                :placeholder="true"
                preload="metadata"
                aria-label="Quality selector missing source fallback"
                title="Quality selector missing source fallback"
                data-video-test-id="harness-quality-missing-source-video"
              />
            </article>

            <article
              v-if="group.id === 'I'"
              class="rounded-2xl border border-cyan-300/20 bg-cyan-950/20 p-3"
              data-video-quality-harness="combined"
              data-video-test-id="combined-harness-speed-quality"
            >
              <p class="text-sm font-semibold text-white">Combined harness: speed + quality + lazy + poster + placeholder</p>
              <pre class="mt-2 overflow-x-auto rounded-xl bg-slate-900/70 p-2 text-[11px] text-cyan-100">quality selector + speedControl + lazy + format fallback (webm/mp4) + error quality option</pre>
              <p class="mt-2 text-xs text-cyan-100">
                Expected: speed and quality controls can be used together without router navigation, hard refresh, or duplicate loading loops.
              </p>
              <ResuxVideo
                class="mt-3 w-full rounded-2xl border border-white/10 bg-black"
                :sources="qualityControlOptions[1].sources"
                :qualities="qualityControlOptions"
                quality-control
                default-quality="720p"
                quality-label="Quality"
                :poster="videoAsset.poster"
                :fallback-poster="videoAsset.poster"
                :width="1280"
                :height="720"
                controls
                lazy
                loading="lazy"
                :placeholder="videoAsset.placeholder"
                preload="metadata"
                speed-control
                :speeds="[0.25, 0.5, 1, 1.25, 1.5, 2]"
                :default-speed="1.25"
                speed-label="Combined speed"
                :show-speed-icon="true"
                aria-label="Combined speed and quality harness"
                title="Combined speed and quality harness"
                data-video-test-id="harness-speed-quality-video"
              />
              <div class="mt-4 h-[50vh] rounded-2xl border border-dashed border-cyan-200/30 bg-slate-900/40" />
              <ResuxVideo
                class="mt-4 w-full rounded-2xl border border-white/10 bg-black"
                :sources="qualityControlOptions[2].sources"
                :qualities="qualityControlOptions"
                quality-control
                default-quality="1080p"
                :poster="videoAsset.poster"
                :width="1280"
                :height="720"
                controls
                lazy
                loading="lazy"
                root-margin="0px 0px"
                threshold="0.01"
                :placeholder="true"
                preload="metadata"
                speed-control
                :default-speed="1"
                speed-label="Far-below combined"
                aria-label="Far below fold combined speed and quality test"
                title="Far below fold combined speed and quality test"
                data-video-test-id="harness-speed-quality-far-below"
              />
            </article>

            <article
              v-if="group.id === 'K'"
              class="rounded-2xl border border-amber-300/20 bg-amber-950/20 p-3"
              data-video-test-id="navigation-runtime-checklist"
            >
              <p class="text-sm font-semibold text-white">Manual navigation/runtime checklist</p>
              <pre class="mt-2 overflow-x-auto rounded-xl bg-slate-900/70 p-2 text-[11px] text-amber-100">direct load /media -> navigate away/back -> browser back/forward -> deep scroll -> speed/quality interactions</pre>
              <ol class="mt-2 list-decimal space-y-1 pl-4 text-xs text-slate-300">
                <li>Open `/media` directly and scroll through capability groups.</li>
                <li>Navigate to another route, return to `/media`, then re-open groups G/H/I.</li>
                <li>Use browser back/forward and verify scroll/interactions still work.</li>
                <li>Inspect `data-resux-observed` / `data-resux-video-controls-ready` markers for duplicated state.</li>
                <li>Verify no hard refresh, no scroll reset, and no duplicate media requests.</li>
              </ol>
            </article>
            </div>
          </details>
        </article>
      </div>
    </section>

    <section class="panel min-w-0 p-4 sm:p-6 lg:p-8">
      <p class="text-xs font-bold uppercase tracking-[0.35em] text-amber-200 sm:text-sm">Lazy Network Check</p>
      <h2 class="mt-3 text-xl font-black text-white sm:text-2xl">Far below fold lazy video</h2>
      <p class="mt-3 text-sm text-slate-300">
        The spacer below keeps this example off-screen initially. Confirm in network tab that the video request starts only after scroll.
      </p>
      <div class="mt-5 h-[62vh] rounded-2xl border border-dashed border-white/15 bg-slate-900/45" />
      <article class="mt-5 min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/65 p-3 sm:p-4">
        <p class="text-sm font-semibold text-white">Lazy video far down page</p>
        <pre class="mt-2 overflow-x-auto rounded-xl bg-slate-900/70 p-2 text-[11px] text-amber-100">lazy loading="lazy" root-margin="0px 0px" threshold="0.01"</pre>
        <ResuxVideo
          src="/media-test/videos/sample-video-lazy.mp4"
          poster="/media-test/videos/sample-poster.jpg"
          :width="1280"
          :height="720"
          aspect-ratio="16 / 9"
          controls
          lazy
          loading="lazy"
          root-margin="0px 0px"
          threshold="0.01"
          placeholder="Scroll-triggered lazy video"
          preload="metadata"
          class="mt-3 w-full rounded-2xl border border-white/10 bg-black"
          aria-label="Far below fold lazy video"
          title="Far below fold lazy video"
        />
      </article>
    </section>
  </section>
</template>
