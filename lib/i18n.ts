import type { Metadata } from "next";

export type Locale = "en" | "zh";
export type SitePath = "/" | "/about" | "/menu" | "/visit";

export const RESERVATION_URL = "https://reservation.umai.io/en/widget/aburii-ttdi";

export const translations = {
  en: {
    localeName: "English",
    nav: { home: "Home", about: "About", menu: "Menu", visit: "Visit", reserve: "Reserve a table" },
    accessibility: {
      primaryNavigation: "Primary navigation",
      navigationMenu: "Navigation menu",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      home: "ABURII home",
      languageSelector: "Language selector",
    },
    home: {
      heroLabel: "ABURII Japanese Yakiniku",
      heroKicker: "Japanese Yakiniku",
      heroSub: "Miyazaki A5 Wagyu",
      viewMenu: "View menu",
      scroll: "Scroll to reveal",
      introEyebrow: "ABURII · TTDI",
      introTitle: "Built around fire",
      introBodyOne: "Aburii brings together premium Japanese ingredients, carefully selected Wagyu and the ritual of yakiniku.",
      introBodyTwo: "Built around the grill, our dining experience encourages guests to slow down, share the table and enjoy every cut at its best.",
      discover: "Discover Aburii",
      cardsLabel: "Explore Aburii",
      cards: {
        about: { title: "About", copy: "The story, philosophy and space behind Aburii." },
        menu: { title: "Menu", copy: "Explore the original ABURII menu as a digital book." },
        visit: { title: "Visit", copy: "Find us in the heart of TTDI." },
      },
      imageAlts: {
        wagyuPlatter: "Premium raw Miyazaki A5 Wagyu at ABURII",
        wagyuGrill: "A5 Wagyu approaching a charcoal grill",
        diningRoom: "The intimate ABURII yakiniku dining room",
      },
    },
    about: {
      heroEyebrow: "About us",
      heroTitle: "This is\nABURII",
      heroSub: "Japanese Yakiniku\nin the heart of TTDI",
      storyEyebrow: "Our story",
      storyTitle: "A shared\nexperience",
      storyBodyOne: "Aburii was created from a simple idea: to bring people together over exceptional Japanese ingredients, thoughtful preparation and the ritual of yakiniku.",
      storyBodyTwo: "We believe great dining is about more than food. It is about the moments shared around the grill, the conversations that flow and the people who make it special.",
      philosophyEyebrow: "Our philosophy",
      philosophyTitle: "Exceptional\nby nature",
      philosophyBodyOne: "We are committed to quality in every detail, from the ingredients we select to the way we prepare and serve them.",
      philosophyBodyTwo: "Our focus is on honest flavours, precise techniques and a dining experience that feels effortless and genuine.",
      quality: "Quality",
      craft: "Craft",
      experience: "Experience",
      spaceEyebrow: "The space",
      spaceTitle: "Crafted for\nmeaningful\nmoments",
      spaceBodyOne: "Our space is designed for long dinners, good company and moments that linger beyond the meal.",
      spaceBodyTwo: "Whether it is an intimate gathering or a larger celebration, Aburii offers a setting that feels both refined and welcoming.",
    },
    reserve: { title: "Reserve your table", button: "Reserve a table", imageAlt: "Yakiniku grilling over charcoal at ABURII" },
    menu: {
      open: "Open ABURII menu book",
      viewHint: "Click to view",
      previous: "Previous menu page",
      next: "Next menu page",
      fullscreen: "View menu fullscreen",
      fullscreenText: "Fullscreen",
      page: (current: number, total: number) => `Page ${current} of ${total}`,
      pages: (first: number, last: number, total: number) => `Pages ${first}–${last} of ${total}`,
      imageAlt: (page: number) => `ABURII menu page ${page}`,
    },
    visit: {
      eyebrow: "Visit",
      title: "Find\nus at\nTTDI",
      intro: "A neighbourhood destination for Japanese yakiniku, good food and great company.",
      location: "Location",
      hours: "Opening hours",
      monday: "Monday",
      closed: "Closed",
      weekdays: "Tuesday – Friday",
      weekend: "Saturday – Sunday",
      directions: "Get directions",
      mapTitle: "Map showing ABURII TTDI",
      galleryLabel: "ABURII interior gallery",
    },
    footer: { about: "About", menu: "Menu", visit: "Visit" },
  },
  zh: {
    localeName: "简体中文",
    nav: { home: "首页", about: "关于我们", menu: "菜单", visit: "到访", reserve: "立即订位" },
    accessibility: {
      primaryNavigation: "主导航",
      navigationMenu: "导航菜单",
      openMenu: "打开菜单",
      closeMenu: "关闭菜单",
      home: "ABURII 首页",
      languageSelector: "语言选择",
    },
    home: {
      heroLabel: "ABURII 日式烧肉",
      heroKicker: "日式烧肉",
      heroSub: "宫崎 A5 和牛",
      viewMenu: "查看菜单",
      scroll: "向下探索",
      introEyebrow: "ABURII · TTDI",
      introTitle: "围炉而食",
      introBodyOne: "Aburii 汇聚优质日本食材、精心挑选的和牛，以及日式烧肉独有的用餐仪式感。",
      introBodyTwo: "围绕炭火烤炉而坐，与身边的人一同分享，让每一块和牛都在最适合的时刻入口。",
      discover: "认识 ABURII",
      cardsLabel: "探索 ABURII",
      cards: {
        about: { title: "关于我们", copy: "了解 Aburii 背后的故事、理念与空间。" },
        menu: { title: "菜单", copy: "以数字菜单册探索 ABURII 原版菜单。" },
        visit: { title: "到访", copy: "在 TTDI 找到我们。" },
      },
      imageAlts: {
        wagyuPlatter: "ABURII 精选宫崎 A5 和牛",
        wagyuGrill: "在炭火烤炉上烧制的 A5 和牛",
        diningRoom: "ABURII 日式烧肉餐厅空间",
      },
    },
    about: {
      heroEyebrow: "关于我们",
      heroTitle: "这就是\nABURII",
      heroSub: "坐落于 TTDI 的\n日式烧肉体验",
      storyEyebrow: "品牌故事",
      storyTitle: "一场共享的\n用餐体验",
      storyBodyOne: "Aburii 源自一个简单的想法——以优质日本食材、细致料理与日式烧肉的仪式感，把人们聚在同一张餐桌旁。",
      storyBodyTwo: "我们相信，一顿好的料理不只关乎食物本身，更在于围炉而坐的时刻、席间自然流动的交流，以及与你共享这一餐的人。",
      philosophyEyebrow: "我们的理念",
      philosophyTitle: "纯粹成就品质",
      philosophyBodyOne: "从食材挑选，到料理与呈现，我们重视每一个细节。",
      philosophyBodyTwo: "我们专注于食材本味、精准技法，以及自然而真诚的用餐体验。",
      quality: "品质",
      craft: "匠心",
      experience: "体验",
      spaceEyebrow: "用餐空间",
      spaceTitle: "为值得珍藏的\n时刻而设",
      spaceBodyOne: "Aburii 的空间为悠长晚餐、好友相聚，以及餐后仍让人回味的时刻而设计。",
      spaceBodyTwo: "无论是亲密聚会或多人庆祝，这里都保留了精致却舒适的氛围。",
    },
    reserve: { title: "预订您的座位", button: "立即订位", imageAlt: "ABURII 炭火烧肉实拍" },
    menu: {
      open: "打开 ABURII 菜单",
      viewHint: "点击查看",
      previous: "上一页",
      next: "下一页",
      fullscreen: "全屏查看菜单",
      fullscreenText: "全屏",
      page: (current: number, total: number) => `第 ${current} / ${total} 页`,
      pages: (first: number, last: number, total: number) => `第 ${first}–${last} / ${total} 页`,
      imageAlt: (page: number) => `ABURII 菜单第 ${page} 页`,
    },
    visit: {
      eyebrow: "到访",
      title: "在 TTDI\n找到我们",
      intro: "在 TTDI，享受日式烧肉、美味料理与相聚时光。",
      location: "地址",
      hours: "营业时间",
      monday: "星期一",
      closed: "休息",
      weekdays: "星期二至星期五",
      weekend: "星期六至星期日",
      directions: "导航前往",
      mapTitle: "ABURII TTDI 地图",
      galleryLabel: "ABURII 餐厅空间",
    },
    footer: { about: "关于我们", menu: "菜单", visit: "到访" },
  },
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale];
}

export function localizedPath(locale: Locale, path: SitePath): string {
  if (locale === "en") return path;
  return path === "/" ? "/zh" : `/zh${path}`;
}

export function pathForLocale(pathname: string, locale: Locale): string {
  const englishPath = pathname === "/zh" ? "/" : pathname.replace(/^\/zh(?=\/)/, "") || "/";
  const knownPath = (["/", "/about", "/menu", "/visit"] as SitePath[]).includes(englishPath as SitePath)
    ? (englishPath as SitePath)
    : "/";
  return localizedPath(locale, knownPath);
}

const metadataCopy = {
  en: {
    home: ["ABURII TTDI | Japanese Yakiniku & Miyazaki A5 Wagyu", "Premium Japanese yakiniku and Miyazaki A5 Wagyu in TTDI, Kuala Lumpur."],
    about: ["About ABURII | Japanese Yakiniku TTDI", "Discover the story, philosophy and dining space behind ABURII Japanese Yakiniku."],
    menu: ["ABURII Menu | Japanese Yakiniku TTDI", "Explore ABURII's original Japanese yakiniku menu in its interactive digital book."],
    visit: ["Visit ABURII TTDI | Japanese Yakiniku", "Find ABURII Japanese Yakiniku in TTDI, Kuala Lumpur, with opening hours and directions."],
  },
  zh: {
    home: ["ABURII TTDI | 日式烧肉与宫崎 A5 和牛", "位于吉隆坡 TTDI 的日式烧肉餐厅，精选宫崎 A5 和牛与优质日本食材。"],
    about: ["关于 ABURII | TTDI 日式烧肉", "了解 ABURII 日式烧肉的品牌故事、用餐理念与空间。"],
    menu: ["ABURII 菜单 | TTDI 日式烧肉", "通过互动数字菜单册查看 ABURII 原版日式烧肉菜单。"],
    visit: ["到访 ABURII TTDI | 日式烧肉", "查看 ABURII TTDI 的地址、营业时间与导航信息。"],
  },
} as const;

export function createPageMetadata(locale: Locale, page: "home" | "about" | "menu" | "visit", path: SitePath): Metadata {
  const [title, description] = metadataCopy[locale][page];
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: localizedPath(locale, path),
      languages: { en: localizedPath("en", path), "zh-CN": localizedPath("zh", path) },
    },
  };
}
