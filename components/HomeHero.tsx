"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { getTranslations, localizedPath, RESERVATION_URL, type Locale } from "@/lib/i18n";
import { heroAssets } from "@/lib/hero-assets";
import { SiteNav } from "./SiteChrome";

type HeroAnimationConfig = {
  scrollVh: number;
  scrub: number;
  stageWidth: string;
  stageHeight: string;
  stageYOffsetVh?: number;
  revealScale: number;
  sliceSpreadVw: number;
  sliceVerticalVh: number;
  sliceRotation: number;
  grill: {
    width: string;
    height: string;
    bottomVh: number;
    startYPercent: number;
    surfaceHalfVw: number;
    surfaceYVh: number;
  };
  landingYOffsetVh: [number, number, number, number];
  dropScale: number;
  smokeWidthVw: number;
  smokeLeftPercent: number;
  reactionInsetPercent: number;
  grillLanding?: {
    surfaceYRatio: number;
    surfaceHalfWidthRatio: number;
    rowOffsetRatio: number;
    depthPx: number;
    tiltX: number;
    verticalScale: number;
    edgeScale: number;
  };
};

const heroAnimationConfig: Record<string, HeroAnimationConfig> = {
  largeDesktop: { scrollVh: 470, scrub: .45, stageWidth: "min(68vw,1100px)", stageHeight: "min(40vw,620px)", revealScale: 1.05, sliceSpreadVw: 6.4, sliceVerticalVh: 1.2, sliceRotation: 3.2, grill: { width: "min(62vw,920px)", height: "min(54vw,760px)", bottomVh: -7, startYPercent: 80, surfaceHalfVw: 5.8, surfaceYVh: 4 }, landingYOffsetVh: [0, -.6, 1.2, .6], dropScale: .56, smokeWidthVw: 46, smokeLeftPercent: 27, reactionInsetPercent: 29, grillLanding: { surfaceYRatio: .34, surfaceHalfWidthRatio: .16, rowOffsetRatio: .05, depthPx: 24, tiltX: 58, verticalScale: .8, edgeScale: .8 } },
  desktop: { scrollVh: 470, scrub: .45, stageWidth: "min(72vw,1100px)", stageHeight: "min(42vw,620px)", revealScale: 1.045, sliceSpreadVw: 6, sliceVerticalVh: 1.1, sliceRotation: 3, grill: { width: "min(66vw,920px)", height: "min(58vw,760px)", bottomVh: -8, startYPercent: 78, surfaceHalfVw: 5.7, surfaceYVh: 4.2 }, landingYOffsetVh: [0, -.6, 1.2, .6], dropScale: .56, smokeWidthVw: 48, smokeLeftPercent: 25, reactionInsetPercent: 28, grillLanding: { surfaceYRatio: .34, surfaceHalfWidthRatio: .16, rowOffsetRatio: .05, depthPx: 24, tiltX: 58, verticalScale: .8, edgeScale: .8 } },
  laptop: { scrollVh: 440, scrub: .4, stageWidth: "min(78vw,980px)", stageHeight: "min(48vw,580px)", revealScale: 1.04, sliceSpreadVw: 5.4, sliceVerticalVh: 1, sliceRotation: 2.7, grill: { width: "min(74vw,860px)", height: "min(64vw,700px)", bottomVh: -14, startYPercent: 74, surfaceHalfVw: 5.2, surfaceYVh: 5.1 }, landingYOffsetVh: [0, -.5, 1, .5], dropScale: .54, smokeWidthVw: 56, smokeLeftPercent: 22, reactionInsetPercent: 24, grillLanding: { surfaceYRatio: .33, surfaceHalfWidthRatio: .16, rowOffsetRatio: .048, depthPx: 22, tiltX: 57, verticalScale: .8, edgeScale: .8 } },
  tabletLandscape: { scrollVh: 390, scrub: .35, stageWidth: "min(84vw,820px)", stageHeight: "min(56vw,500px)", revealScale: 1.034, sliceSpreadVw: 4.8, sliceVerticalVh: .8, sliceRotation: 2.2, grill: { width: "min(84vw,760px)", height: "min(70vw,620px)", bottomVh: -5, startYPercent: 68, surfaceHalfVw: 4.8, surfaceYVh: 6.1 }, landingYOffsetVh: [0, -.4, .8, .4], dropScale: .53, smokeWidthVw: 72, smokeLeftPercent: 14, reactionInsetPercent: 18, grillLanding: { surfaceYRatio: .32, surfaceHalfWidthRatio: .155, rowOffsetRatio: .047, depthPx: 20, tiltX: 56, verticalScale: .82, edgeScale: .81 } },
  tabletPortrait: { scrollVh: 370, scrub: .32, stageWidth: "min(92vw,820px)", stageHeight: "min(64vw,520px)", revealScale: 1.03, sliceSpreadVw: 4.5, sliceVerticalVh: .75, sliceRotation: 2, grill: { width: "94vw", height: "78vw", bottomVh: -4, startYPercent: 66, surfaceHalfVw: 4.5, surfaceYVh: 8 }, landingYOffsetVh: [0, -.5, 1.2, .5], dropScale: .51, smokeWidthVw: 84, smokeLeftPercent: 8, reactionInsetPercent: 14, grillLanding: { surfaceYRatio: .32, surfaceHalfWidthRatio: .15, rowOffsetRatio: .046, depthPx: 18, tiltX: 55, verticalScale: .82, edgeScale: .82 } },
  tabletPortraitWide: { scrollVh: 370, scrub: .32, stageWidth: "min(86vw,820px)", stageHeight: "min(56vw,520px)", revealScale: 1.03, sliceSpreadVw: 4.5, sliceVerticalVh: .75, sliceRotation: 2, grill: { width: "94vw", height: "78vw", bottomVh: -4, startYPercent: 66, surfaceHalfVw: 4.5, surfaceYVh: 8 }, landingYOffsetVh: [0, -.5, 1.2, .5], dropScale: .47, smokeWidthVw: 84, smokeLeftPercent: 8, reactionInsetPercent: 14, grillLanding: { surfaceYRatio: .34, surfaceHalfWidthRatio: .15, rowOffsetRatio: .045, depthPx: 18, tiltX: 55, verticalScale: .82, edgeScale: .82 } },
  mobileLandscape: { scrollVh: 250, scrub: .22, stageWidth: "min(76vw,112vh)", stageHeight: "min(50vw,72vh)", stageYOffsetVh: 5, revealScale: 1.022, sliceSpreadVw: 3.8, sliceVerticalVh: .45, sliceRotation: 1.5, grill: { width: "min(78vw,122vh)", height: "min(66vw,98vh)", bottomVh: -18, startYPercent: 54, surfaceHalfVw: 3.8, surfaceYVh: 1.5 }, landingYOffsetVh: [0, -.25, .55, .25], dropScale: .48, smokeWidthVw: 66, smokeLeftPercent: 18, reactionInsetPercent: 20, grillLanding: { surfaceYRatio: .31, surfaceHalfWidthRatio: .15, rowOffsetRatio: .044, depthPx: 16, tiltX: 54, verticalScale: .84, edgeScale: .83 } },
  mobilePortrait: { scrollVh: 320, scrub: .26, stageWidth: "96vw", stageHeight: "70vw", revealScale: 1.025, sliceSpreadVw: 4.6, sliceVerticalVh: .65, sliceRotation: 1.8, grill: { width: "136vw", height: "122vw", bottomVh: -4, startYPercent: 62, surfaceHalfVw: 4.6, surfaceYVh: 17.5 }, landingYOffsetVh: [0, -.5, 1.3, .65], dropScale: .58, smokeWidthVw: 88, smokeLeftPercent: 6, reactionInsetPercent: 12, grillLanding: { surfaceYRatio: .28, surfaceHalfWidthRatio: .16, rowOffsetRatio: .045, depthPx: 16, tiltX: 68, verticalScale: .65, edgeScale: .86 } },
  smallMobile: { scrollVh: 300, scrub: .22, stageWidth: "98vw", stageHeight: "74vw", revealScale: 1.02, sliceSpreadVw: 4.1, sliceVerticalVh: .55, sliceRotation: 1.5, grill: { width: "140vw", height: "126vw", bottomVh: -3, startYPercent: 58, surfaceHalfVw: 4.1, surfaceYVh: 17.5 }, landingYOffsetVh: [0, -.45, 1.15, .55], dropScale: .55, smokeWidthVw: 90, smokeLeftPercent: 5, reactionInsetPercent: 10, grillLanding: { surfaceYRatio: .28, surfaceHalfWidthRatio: .155, rowOffsetRatio: .044, depthPx: 14, tiltX: 67, verticalScale: .67, edgeScale: .87 } },
};

export function HomeHero({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const openingImage = new window.Image();
      openingImage.src = heroAssets.wagyuWhole;
      await openingImage.decode().catch(() => {});
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      let removeControl = () => {};
      const ctx = gsap.context(() => {
        const q = gsap.utils.selector(root);
        const slices = q<HTMLElement>(".lux-wagyu-slice");
        const stage = q<HTMLElement>(".lux-slices");
        const intact = q<HTMLElement>(".lux-intact-wagyu");
        const cutLines = q<HTMLElement>(".lux-cut-lines");
        const grill = q<HTMLElement>(".lux-grill");
        const smoke = q<HTMLElement>(".lux-smoke");
        let activeTimeline: ReturnType<typeof gsap.timeline> | null = null;
        let openingComplete = false;
        const mm = gsap.matchMedia();

        mm.add({
          fallback: "all",
          largeDesktop: "(min-width: 1600px)",
          desktop: "(min-width: 1280px) and (max-width: 1599px)",
          laptop: "(min-width: 1024px) and (max-width: 1279px) and (orientation: landscape)",
          tabletLandscape: "(min-width: 641px) and (max-width: 1023px) and (orientation: landscape)",
          tabletPortrait: "(min-width: 641px) and (max-width: 900px) and (orientation: portrait)",
          tabletPortraitWide: "(min-width: 901px) and (max-width: 1279px) and (orientation: portrait)",
          mobileLandscape: "(max-width: 640px) and (orientation: landscape), (max-width: 900px) and (max-height: 520px) and (orientation: landscape)",
          mobilePortrait: "(min-width: 375px) and (max-width: 640px) and (orientation: portrait)",
          smallMobile: "(max-width: 374px) and (orientation: portrait)",
        }, (mediaContext) => {
          const conditions = mediaContext.conditions ?? {};
          const preset = conditions.mobileLandscape
            ? "mobileLandscape"
            : (Object.keys(heroAnimationConfig) as Array<keyof typeof heroAnimationConfig>).find((key) => conditions[key]) ?? "desktop";
          const config = heroAnimationConfig[preset];
          const separatedX = [-1, -.33, .33, 1].map((position) => `${position * config.sliceSpreadVw}vw`);
          const separatedY = [0, -1, .7, -.45].map((position) => `${position * config.sliceVerticalVh}vh`);
          const separateRotations = [-1, -.33, .33, 1].map((position) => position * config.sliceRotation);
          const cutNudge = Math.max(1, config.sliceSpreadVw * .42);

          gsap.set(root.current, { height: `${config.scrollVh}vh` });
          gsap.set([...stage, ...cutLines], { width: config.stageWidth, height: config.stageHeight, y: `${config.stageYOffsetVh ?? 0}vh` });
          gsap.set(slices, { autoAlpha: 0, x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0, scaleX: 1, scaleY: 1 });
          gsap.set(intact, { autoAlpha: 1 });
          gsap.set(grill, { width: config.grill.width, height: config.grill.height, bottom: `${config.grill.bottomVh}vh`, yPercent: config.grill.startYPercent });
          gsap.set(smoke, { width: `${config.smokeWidthVw}vw`, left: `${config.smokeLeftPercent}%` });
          gsap.set(q(".lux-reaction"), { left: `${config.reactionInsetPercent}%`, right: `${config.reactionInsetPercent}%` });
          gsap.set(q(".lux-embers"), { left: `${config.reactionInsetPercent + 4}%`, right: `${config.reactionInsetPercent + 4}%` });

          const stageElement = stage[0];
          const grillElement = grill[0];
          const sliceSourceX = [.175, .42, .565, .82];
          const landingColumns = [-.58, .48, -.48, .58];
          const landingRows = [-.78, -.66, .72, .84];
          const edgeScale = config.grillLanding?.edgeScale ?? 1;
          const landingScaleX = [edgeScale, 1, 1, edgeScale].map((factor) => config.dropScale * factor);
          const landingScaleY = landingScaleX.map((scale) => scale * (config.grillLanding?.verticalScale ?? 1));
          const landedX = config.grillLanding && stageElement && grillElement
            ? sliceSourceX.map((sourcePosition, index) => {
                const sourceX = stageElement.offsetLeft + stageElement.offsetWidth * sourcePosition;
                const stageCenterX = stageElement.offsetLeft + stageElement.offsetWidth * .5;
                const scaledSourceX = stageCenterX + (sourceX - stageCenterX) * landingScaleX[index];
                const targetX = grillElement.offsetLeft + grillElement.offsetWidth * config.grillLanding!.surfaceHalfWidthRatio * landingColumns[index];
                return targetX - scaledSourceX;
              })
            : [-.7, -.24, .24, .7].map((position) => position * config.grill.surfaceHalfVw * window.innerWidth / 100);
          const landedY = config.grillLanding && stageElement && grillElement
            ? landingRows.map((row) => {
                const sourceY = stageElement.offsetTop + stageElement.offsetHeight * .5;
                const targetY = grillElement.offsetTop + grillElement.offsetHeight * (config.grillLanding!.surfaceYRatio + row * config.grillLanding!.rowOffsetRatio);
                return targetY - sourceY;
              })
            : config.landingYOffsetVh.map((offset) => (config.grill.surfaceYVh + offset) * window.innerHeight / 100);
          const landedZ = config.grillLanding
            ? [-1, -.35, -.7, -.2].map((depth) => depth * config.grillLanding!.depthPx)
            : [0, 0, 0, 0];
          const landingTiltX = config.grillLanding
            ? [-3, 2, 0, -2].map((offset) => config.grillLanding!.tiltX + offset)
            : [0, 0, 0, 0];
          const landingRotations = [-11, 6, -5, 10];
          const approachY = landedY.map((target) => typeof target === "number" && grillElement ? target - grillElement.offsetHeight * .07 : target);
          const approachX = landedX.map((target) => typeof target === "number" ? target * .92 : target);

          const timeline = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
          activeTimeline = timeline;

          timeline
            .addLabel("cut", 0)
            .set(slices, { autoAlpha: 1 }, .3)
            .set(intact, { autoAlpha: 0 }, .3)
            .fromTo(q(".cut-1"), { autoAlpha: 0, scaleY: 0, yPercent: -12 }, { autoAlpha: .82, scaleY: 1, yPercent: 0, duration: .42, ease: "power3.inOut" }, .04)
            .to(slices[0], { x: -cutNudge, duration: .42, ease: "power2.inOut" }, .3)
            .fromTo(q(".cut-2"), { autoAlpha: 0, scaleY: 0, yPercent: -12 }, { autoAlpha: .82, scaleY: 1, yPercent: 0, duration: .42, ease: "power3.inOut" }, .22)
            .to(slices[1], { x: -cutNudge * .55, duration: .42, ease: "power2.inOut" }, .48)
            .fromTo(q(".cut-3"), { autoAlpha: 0, scaleY: 0, yPercent: -12 }, { autoAlpha: .82, scaleY: 1, yPercent: 0, duration: .42, ease: "power3.inOut" }, .4)
            .to([slices[2], slices[3]], { x: (index: number) => index === 0 ? cutNudge * .55 : cutNudge, duration: .42, ease: "power2.inOut" }, .66)
            .to(q(".lux-cut-line"), { autoAlpha: .18, duration: .35, stagger: .06, ease: "power2.inOut" }, .72)
            .addLabel("separate", .72)
            .to(slices, { x: (index: number) => separatedX[index], y: (index: number) => separatedY[index], rotateZ: (index: number) => separateRotations[index], scale: (index: number) => [.97, 1, 1.03, 1][index], duration: .9, stagger: .045, ease: "power3.inOut" }, .72)
            .addLabel("grill", 1.19)
            .to(grill, { autoAlpha: 1, y: 0, yPercent: 0, duration: 1.02, ease: "power3.inOut" }, 1.19)
            .to(q(".lux-warmth"), { opacity: 1, duration: .68 }, 1.36)
            .to(q(".lux-smoke-warm"), { opacity: .72, duration: .72 }, 1.41)
            .to(q(".lux-cut-line"), { autoAlpha: 0, duration: .36, stagger: .04 }, 1.39)
            .addLabel("drop", 2)
            .to(slices, { y: (index: number) => approachY[index], x: (index: number) => approachX[index], z: (index: number) => landedZ[index] * .4, transformPerspective: 1200, rotateX: (index: number) => landingTiltX[index] * .55, rotateZ: (index: number) => landingRotations[index] * .65, scaleX: (index: number) => landingScaleX[index] * 1.06, scaleY: (index: number) => landingScaleY[index] * 1.06, duration: .64, stagger: .08, ease: "power2.in" }, 2)
            .to(slices, { y: (index: number) => landedY[index], x: (index: number) => landedX[index], z: (index: number) => landedZ[index], rotateX: (index: number) => landingTiltX[index], rotateZ: (index: number) => landingRotations[index], scaleX: (index: number) => landingScaleX[index], scaleY: (index: number) => landingScaleY[index], duration: .42, stagger: .055, ease: "power3.out" }, 2.52)
            .addLabel("ignite", 2.86)
            .to(q(".lux-reaction"), { autoAlpha: 1, scale: 1, duration: .3, ease: "power3.out" }, 2.92)
            .to(q(".lux-embers"), { autoAlpha: 1, duration: .22 }, 2.96)
            .to(q(".lux-reaction"), { opacity: .4, duration: .58 }, 3.19)
            .addLabel("final", 3.32)
            .to(q(".lux-final-copy"), { autoAlpha: 1, y: 0, duration: .72, ease: "power3.out" }, 3.34)
            .to(q(".lux-opening-mark"), { autoAlpha: 0, duration: .35 }, 3.19);

          let scrollTrigger: ReturnType<typeof ScrollTrigger.create> | null = null;
          let openingTimeline: ReturnType<typeof gsap.timeline> | null = null;
          const activateScrollTimeline = () => {
            const scrollStart = window.scrollY;
            timeline.pause(0);
            scrollTrigger = ScrollTrigger.create({
              trigger: root.current,
              start: scrollStart,
              end: "bottom bottom",
              scrub: config.scrub,
              invalidateOnRefresh: true,
              animation: timeline,
            });
            ScrollTrigger.refresh();
          };

          if (openingComplete) {
            gsap.set(q(".lux-blackout"), { autoAlpha: 0 });
            gsap.set(stage, { autoAlpha: 1, scale: config.revealScale });
            gsap.set(q(".lux-bloom"), { opacity: .52 });
            activateScrollTimeline();
          } else {
            gsap.set(q(".lux-blackout"), { autoAlpha: 1 });
            gsap.set(stage, { autoAlpha: 0, scale: .94 });
            gsap.set(q(".lux-bloom"), { opacity: 0 });
            openingTimeline = gsap.timeline({
              delay: .18,
              defaults: { ease: "power3.inOut" },
              onComplete: () => {
                openingComplete = true;
                gsap.set(stage, { autoAlpha: 1, scale: config.revealScale });
                gsap.set(q(".lux-blackout"), { autoAlpha: 0 });
                activateScrollTimeline();
              },
            });
            openingTimeline
              .to(q(".lux-blackout"), { autoAlpha: 0, duration: 1.35, ease: "power2.inOut" }, 0)
              .to(stage, { autoAlpha: 1, scale: 1, duration: 1.45, ease: "power3.out" }, .1)
              .to(q(".lux-bloom"), { opacity: .52, duration: 1.2, ease: "power2.out" }, .38)
              .to(stage, { scale: config.revealScale, duration: .85, ease: "power2.inOut" }, 1.08);
          }

          return () => {
            openingTimeline?.kill();
            scrollTrigger?.kill();
            timeline.kill();
            activeTimeline = null;
          };
        });

        const onControl = (event: Event) => {
          const action = (event as CustomEvent<{ action: string }>).detail.action;
          const controlTargets: Record<string, number> = { reveal: 0, cut: .72, grill: 1.62, drop: 2.7, ignite: 3.28, final: 3.98 };
          if (!activeTimeline) return;
          if (action === "play") activeTimeline.play();
          else if (action === "pause") activeTimeline.pause();
          else if (action === "restart") activeTimeline.restart();
          else if (controlTargets[action] !== undefined && activeTimeline.scrollTrigger) {
            const progress = controlTargets[action] / activeTimeline.duration();
            const targetScroll = activeTimeline.scrollTrigger.start + (activeTimeline.scrollTrigger.end - activeTimeline.scrollTrigger.start) * progress;
            window.scrollTo({ top: targetScroll, behavior: "auto" });
          }
        };
        window.addEventListener("aburii:hero-control", onControl);
        removeControl = () => { window.removeEventListener("aburii:hero-control", onControl); mm.revert(); };
      }, root);

      cleanup = () => { removeControl(); ctx.revert(); };
    })();
    return () => { disposed = true; cleanup(); };
  }, []);

  const controlHero = (action: string) => window.dispatchEvent(new CustomEvent("aburii:hero-control", { detail: { action } }));

  return <section ref={root} className="lux-hero" aria-label={t.home.heroLabel}>
    <SiteNav locale={locale} />
    <div className="lux-hero-pin">
      <div className="lux-bloom" aria-hidden="true" />
      <div className="lux-slices lux-depth" role="img" aria-label={t.home.imageAlts.wagyuPlatter}>
        <div className="lux-intact-wagyu" style={{ backgroundImage: `url(${heroAssets.wagyuWhole})` }} />
        {[0, 1, 2, 3].map((index) => <div className={`lux-wagyu-slice slice-${index + 1}`} style={{ backgroundImage: `url(${heroAssets.wagyuWhole})` }} key={index} />)}
      </div>
      <div className="lux-cut-lines" aria-hidden="true"><i className="lux-cut-line cut-1" /><i className="lux-cut-line cut-2" /><i className="lux-cut-line cut-3" /></div>
      <div className="lux-grill"><Image src={heroAssets.yakinikuGrill} alt="" fill sizes="(max-width: 800px) 94vw, 66vw" /></div>
      <div className="lux-warmth" aria-hidden="true" /><div className="lux-reaction" aria-hidden="true" />
      <div className="lux-smoke lux-smoke-cool" aria-hidden="true" /><div className="lux-smoke lux-smoke-warm" aria-hidden="true" />
      <div className="lux-embers" aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</div>
      <div className="lux-edge-shade" aria-hidden="true" /><div className="lux-blackout" aria-hidden="true" />
      <div className="lux-final-copy"><h1>ABURII</h1><p>{t.home.heroKicker}</p><p>{t.home.heroSub}</p><div className="lux-actions"><Link className="solid-button" href={localizedPath(locale, "/menu")}>{t.home.viewMenu}</Link><a className="ghost-button" href={RESERVATION_URL} target="_blank" rel="noopener noreferrer">{t.nav.reserve}</a></div></div>
      <span className="lux-scroll-cue">Scroll to reveal <span aria-hidden="true">↓</span></span>
      {process.env.NODE_ENV !== "production" && <div className="lux-dev-controls" aria-label="Hero scene controls">
        {[['reveal', 'Reveal'], ['cut', 'Cut Wagyu'], ['grill', 'Grill Up'], ['drop', 'Drop Wagyu'], ['ignite', 'Ignite'], ['final', 'Final']].map(([action, label]) => <button type="button" key={action} onClick={() => controlHero(action)}>{label}</button>)}
        <i aria-hidden="true" />
        {['play', 'pause', 'restart'].map((action) => <button type="button" key={action} onClick={() => controlHero(action)}>{action}</button>)}
      </div>}
    </div>
  </section>;
}
