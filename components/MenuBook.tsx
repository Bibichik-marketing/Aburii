"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { getTranslations, type Locale } from "@/lib/i18n";

const menuPages = Array.from({ length: 16 }, (_, index) => ({
  image: `/menu/page-${String(index + 1).padStart(2, "0")}.webp`,
  pageNumber: index + 1,
}));

const decodedPages = new Map<string, Promise<void>>();
function preparePage(index: number) {
  const source = menuPages[index]?.image;
  if (!source) return Promise.resolve();
  if (!decodedPages.has(source)) {
    const image = new window.Image();
    image.src = source;
    decodedPages.set(source, image.decode().catch(() => { decodedPages.delete(source); }));
  }
  return decodedPages.get(source)!;
}

type LayoutMode = "single" | "spread";
type TurnDirection = "previous" | "next";
type KillableTimeline = { kill: () => void };

export function MenuBook({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isTurning, setIsTurning] = useState(false);
  const [turnDirection, setTurnDirection] = useState<TurnDirection | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("spread");
  const [simpleMotion, setSimpleMotion] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);

  const bookRef = useRef<HTMLDivElement>(null);
  const closedBookRef = useRef<HTMLButtonElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const openBookRef = useRef<HTMLDivElement>(null);
  const leftPageRef = useRef<HTMLDivElement>(null);
  const rightPageRef = useRef<HTMLDivElement>(null);
  const openingLock = useRef(false);
  const turningLock = useRef(false);
  const layoutModeRef = useRef<LayoutMode>("spread");
  const activeTimeline = useRef<KillableTimeline | null>(null);
  const turnOverlay = useRef<HTMLDivElement | null>(null);
  const turnGeneration = useRef(0);
  const pointerStart = useRef<{ x: number; y: number; id: number } | null>(null);

  const isSinglePage = layoutMode === "single";
  const visiblePageIndex = isSinglePage ? pageIndex : pageIndex - (pageIndex % 2);
  const lastVisibleIndex = isSinglePage
    ? menuPages.length - 1
    : Math.floor((menuPages.length - 1) / 2) * 2;
  const rightPageIndex = isSinglePage
    ? visiblePageIndex
    : visiblePageIndex + 1 < menuPages.length
      ? visiblePageIndex + 1
      : null;

  const clearAnimatedStyles = useCallback(() => {
    for (const element of [closedBookRef.current, coverRef.current, openBookRef.current, leftPageRef.current, rightPageRef.current]) {
      if (!element) continue;
      element.style.removeProperty("transform");
      element.style.removeProperty("opacity");
      element.style.removeProperty("visibility");
      element.style.removeProperty("filter");
      element.style.removeProperty("will-change");
    }
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const updateLayout = () => {
      const nextMode: LayoutMode = query.matches ? "single" : "spread";
      if (layoutModeRef.current === nextMode) return;
      turnGeneration.current += 1;
      turnOverlay.current?.remove();
      turnOverlay.current = null;
      activeTimeline.current?.kill();
      activeTimeline.current = null;
      clearAnimatedStyles();
      if (openingLock.current) setIsOpen(true);
      openingLock.current = false;
      turningLock.current = false;
      layoutModeRef.current = nextMode;
      setIsOpening(false);
      setIsTurning(false);
      setTurnDirection(null);
      setLayoutMode(nextMode);
    };

    updateLayout();
    query.addEventListener("change", updateLayout);
    setSimpleMotion(!window.CSS.supports("transform-style", "preserve-3d"));
    setCanFullscreen(Boolean(document.fullscreenEnabled && bookRef.current?.requestFullscreen));
    return () => {
      query.removeEventListener("change", updateLayout);
      turnGeneration.current += 1;
      turnOverlay.current?.remove();
      turnOverlay.current = null;
      activeTimeline.current?.kill();
    };
  }, [clearAnimatedStyles]);

  useEffect(() => {
    const nearby = new Set<number>();
    const step = isSinglePage ? 1 : 2;
    for (const index of [visiblePageIndex - step, visiblePageIndex - step + 1, visiblePageIndex, visiblePageIndex + 1, visiblePageIndex + step, visiblePageIndex + step + 1]) {
      if (index >= 0 && index < menuPages.length) nearby.add(index);
    }
    for (const index of nearby) {
      void preparePage(index);
    }
  }, [isSinglePage, visiblePageIndex]);

  const releaseTurnLock = useCallback(() => {
    turnOverlay.current?.remove();
    turnOverlay.current = null;
    activeTimeline.current = null;
    turningLock.current = false;
    for (const element of [openBookRef.current, leftPageRef.current, rightPageRef.current]) {
      if (!element) continue;
      element.style.removeProperty("transform");
      element.style.removeProperty("opacity");
      element.style.removeProperty("filter");
      element.style.removeProperty("will-change");
    }
    setIsTurning(false);
    setTurnDirection(null);
  }, []);

  const openBook = useCallback(async () => {
    if (isOpen || openingLock.current) return;
    openingLock.current = true;
    setIsOpening(true);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setIsOpen(true);
      setIsOpening(false);
      openingLock.current = false;
      return;
    }

    const { gsap } = await import("gsap");
    const simplified = simpleMotion;
    const timeline = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        activeTimeline.current = null;
        setIsOpen(true);
        setIsOpening(false);
        openingLock.current = false;
        clearAnimatedStyles();
      },
    });
    activeTimeline.current = timeline;

    if (simplified) {
      timeline
        .to(closedBookRef.current, { scale: 0.985, opacity: 0, duration: 0.28 })
        .fromTo(openBookRef.current, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.42 }, "-=0.12");
      return;
    }

    if (isSinglePage) {
      timeline
        .to(closedBookRef.current, { scale: 1.018, duration: 0.14 })
        .to(closedBookRef.current, { autoAlpha: 0, duration: 0.22 })
        .fromTo(openBookRef.current, { autoAlpha: 0, scale: 0.975 }, { autoAlpha: 1, scale: 1, duration: 0.46 }, "-=0.2");
      return;
    }

    timeline
      .to(closedBookRef.current, { scale: 1.012, duration: 0.16 })
      .to(coverRef.current, { rotateY: -72, xPercent: -2, duration: 0.68, transformOrigin: "left center" })
      .to(closedBookRef.current, { autoAlpha: 0, duration: 0.2 }, "-=0.22")
      .fromTo(openBookRef.current, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.52 }, "-=0.2");
  }, [clearAnimatedStyles, isOpen, isSinglePage, simpleMotion]);

  const turnPage = useCallback(async (direction: TurnDirection) => {
    if (!isOpen || openingLock.current || turningLock.current) return;
    const step = isSinglePage ? 1 : 2;
    const target = Math.max(0, Math.min(lastVisibleIndex, visiblePageIndex + (direction === "next" ? step : -step)));
    if (target === visiblePageIndex) return;

    turningLock.current = true;
    setIsTurning(true);
    setTurnDirection(direction);

    const generation = turnGeneration.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const [{ gsap }] = await Promise.all([
      import("gsap"),
      preparePage(target),
      isSinglePage ? Promise.resolve() : preparePage(target + 1),
    ]);
    if (generation !== turnGeneration.current) return;
    const frame = openBookRef.current;
    if (!frame || reducedMotion) {
      setPageIndex(target);
      releaseTurnLock();
      return;
    }

    // Keep the decoded outgoing spread over the incoming pages: no mid-turn image swap.
    const outgoing = frame.cloneNode(true) as HTMLDivElement;
    outgoing.setAttribute("aria-hidden", "true");
    outgoing.inert = true;
    outgoing.style.pointerEvents = "none";
    outgoing.style.zIndex = "5";
    outgoing.style.willChange = "transform, opacity";
    frame.after(outgoing);
    turnOverlay.current = outgoing;
    flushSync(() => setPageIndex(target));
    const sign = direction === "next" ? -1 : 1;
    const distance = isSinglePage ? 28 : 16;
    frame.style.willChange = "transform, opacity";
    // The snapshot preserves the current swipe offset, while the incoming page settles in.
    gsap.set([leftPageRef.current, rightPageRef.current].filter(Boolean), { clearProps: "transform,opacity,filter,willChange" });
    if (!isSinglePage && !simpleMotion) {
      // A physical leaf turns around the spine; its reverse becomes the opposite page.
      const turningSelector = direction === "next" ? ".book-page-right" : ".book-page-left";
      const reverseSelector = direction === "next" ? ".book-page-left" : ".book-page-right";
      const oldPage = outgoing.querySelector<HTMLDivElement>(turningSelector)!;
      const staticPage = outgoing.querySelector<HTMLDivElement>(reverseSelector)!;
      const destination = frame.querySelector<HTMLDivElement>(reverseSelector)!;
      const leaf = document.createElement("div");
      leaf.className = "book-turn-leaf";
      Object.assign(leaf.style, {
        left: `${oldPage.offsetLeft}px`, top: `${oldPage.offsetTop}px`,
        width: `${oldPage.offsetWidth}px`, height: `${oldPage.offsetHeight}px`,
        transformOrigin: direction === "next" ? "left center" : "right center",
      });
      const front = oldPage.cloneNode(true) as HTMLDivElement;
      const back = destination.cloneNode(true) as HTMLDivElement;
      front.className = "book-page book-turn-face book-turn-front";
      back.className = "book-page book-turn-face book-turn-back";
      leaf.append(front, back);
      oldPage.style.visibility = "hidden";
      outgoing.append(leaf);
      const timeline = gsap.timeline({ onComplete: releaseTurnLock });
      activeTimeline.current = timeline;
      timeline
        .to(leaf, { rotateY: sign * 180, duration: .78, ease: "power2.inOut", force3D: true }, 0)
        .set(staticPage, { visibility: "hidden" }, .39);
      return;
    }
    const timeline = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: releaseTurnLock,
    });
    activeTimeline.current = timeline;
    timeline
      .fromTo(frame, { x: -sign * distance, rotateY: simpleMotion ? 0 : -sign * 4, opacity: 0 },
        { x: 0, rotateY: 0, opacity: 1, duration: .58, ease: "power3.out" }, 0)
      .to(outgoing, { x: sign * distance, rotateY: simpleMotion ? 0 : sign * 14, opacity: 0,
        transformOrigin: direction === "next" ? "left center" : "right center", duration: .5 }, 0);

  }, [isOpen, isSinglePage, lastVisibleIndex, releaseTurnLock, simpleMotion, visiblePageIndex]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        turnPage("previous");
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        turnPage("next");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [turnPage]);

  const snapMobilePageBack = useCallback(async () => {
    if (!isSinglePage || isTurning || !rightPageRef.current) return;
    const { gsap } = await import("gsap");
    rightPageRef.current.style.willChange = "transform, opacity";
    gsap.to(rightPageRef.current, {
      x: 0,
      rotateY: 0,
      opacity: 1,
      duration: 0.22,
      ease: "power2.out",
      onComplete: () => { rightPageRef.current?.style.removeProperty("will-change"); },
    });
  }, [isSinglePage, isTurning]);

  const handlePointerDown = (event: React.PointerEvent) => {
    if (!isOpen || turningLock.current || openingLock.current || !event.isPrimary || (event.target as HTMLElement).closest("button")) return;
    pointerStart.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    const start = pointerStart.current;
    if (!start || start.id !== event.pointerId || !isSinglePage || isTurning || !rightPageRef.current) return;
    const distance = event.clientX - start.x;
    if (Math.abs(event.clientY - start.y) > Math.abs(distance) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const visualDistance = Math.max(-44, Math.min(44, distance * 0.24));
    rightPageRef.current.style.willChange = "transform, opacity";
    rightPageRef.current.style.transform = `translate3d(${visualDistance}px, 0, 0) rotateY(${visualDistance / 7}deg)`;
    rightPageRef.current.style.opacity = String(1 - Math.abs(visualDistance) / 230);
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || start.id !== event.pointerId) return;
    const movementX = event.clientX - start.x;
    const movementY = event.clientY - start.y;
    if (Math.abs(movementX) < 60 || Math.abs(movementX) < Math.abs(movementY) * 1.25) {
      void snapMobilePageBack();
      return;
    }
    if ((movementX > 0 && visiblePageIndex === 0) || (movementX < 0 && visiblePageIndex === lastVisibleIndex)) {
      void snapMobilePageBack();
      return;
    }
    turnPage(movementX < 0 ? "next" : "previous");
  };

  const previousDisabled = !isOpen || isOpening || isTurning || visiblePageIndex <= 0;
  const nextDisabled = !isOpen || isOpening || isTurning || visiblePageIndex >= lastVisibleIndex;

  return (
    <div
      className="menu-stage"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { pointerStart.current = null; void snapMobilePageBack(); }}
    >
      <div
        ref={bookRef}
        className={`digital-menu-book ${isOpen ? "is-open" : ""} ${isOpening ? "is-opening" : ""} ${simpleMotion ? "is-simple-motion" : ""}`}
        data-layout={layoutMode}
        data-turning={turnDirection ?? undefined}
      >
        <button ref={closedBookRef} className="closed-book" type="button" onClick={openBook} aria-label={t.menu.open} disabled={isOpening}>
          <span className="closed-book-pages" aria-hidden="true" />
          <span ref={coverRef} className="closed-book-cover">
            <span className="book-binding" aria-hidden="true" />
            <span className="book-cover-texture" aria-hidden="true" />
            <span className="book-brand">
              <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M19 45c-4-9 4-14 6-22 5 5 3 10 3 14 5-6 7-12 6-20 10 9 14 19 8 28-5 8-18 9-23 0Z" /><path d="M25 47c-2-5 2-8 5-12 1 4 0 7 2 10 3-3 4-6 4-9 4 5 4 10 0 13-4 4-9 2-11-2Z" /></svg>
              <span>ABURII</span>
            </span>
          </span>
          <span className="menu-view-hint">{t.menu.viewHint}</span>
        </button>

        <div ref={openBookRef} className="open-book-frame" aria-live="polite" aria-busy={isTurning}>
          <span className="open-book-cover-underlay" aria-hidden="true" />
          {!isSinglePage && (
            <div ref={leftPageRef} className="book-page book-page-left">
              <Image unoptimized src={menuPages[visiblePageIndex].image} alt={t.menu.imageAlt(menuPages[visiblePageIndex].pageNumber)} fill sizes="(max-width: 1023px) 86vw, 42vw" priority={visiblePageIndex < 4} draggable={false} />
            </div>
          )}
          <div ref={rightPageRef} className="book-page book-page-right">
            {rightPageIndex === null ? (
              <span className="book-page-blank" aria-hidden="true" />
            ) : (
              <Image unoptimized src={menuPages[rightPageIndex].image} alt={t.menu.imageAlt(menuPages[rightPageIndex].pageNumber)} fill sizes={isSinglePage ? "(max-width: 1023px) 92vw, 560px" : "42vw"} priority={rightPageIndex < 4} draggable={false} />
            )}
          </div>
          <span className="book-gutter" aria-hidden="true" />
        </div>

        <button className="book-nav-button book-nav-previous" type="button" aria-label={t.menu.previous} disabled={previousDisabled} onClick={() => turnPage("previous")}><ChevronLeft /></button>
        <button className="book-nav-button book-nav-next" type="button" aria-label={t.menu.next} disabled={nextDisabled} onClick={() => turnPage("next")}><ChevronRight /></button>

        {isOpen && <>
          <span className="book-page-counter" role="status">{isSinglePage ? t.menu.page(visiblePageIndex + 1, menuPages.length) : t.menu.pages(visiblePageIndex + 1, (rightPageIndex ?? visiblePageIndex) + 1, menuPages.length)}</span>
          {canFullscreen && <button className="book-fullscreen" type="button" onClick={() => bookRef.current?.requestFullscreen?.()} aria-label={t.menu.fullscreen}><Maximize2 size={16} /><span>{t.menu.fullscreenText}</span></button>}
        </>}
      </div>
    </div>
  );
}
