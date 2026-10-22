"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Animate content independently of the hero's GSAP timeline and image transforms.
const targets = [
  ".intro-grid > *", ".route-card", ".about-hero-copy",
  ".about-story > *", ".about-philosophy-head > *", ".about-value",
  ".about-space > *", ".page-hero-copy", ".page-hero-image",
  ".visit-info", ".map-wrap", ".gallery-image", ".reserve-band > :not(.reserve-band-bg)",
].join(",");

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    let observer: IntersectionObserver | undefined;
    const stop = () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    const start = () => {
      stop();
      if (motion.matches || !("IntersectionObserver" in window)) return;
      const compact = window.matchMedia("(max-width: 680px)").matches;
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer?.unobserve(entry.target);
          // Content stays visible before JS loads and when motion is disabled.
          const siblings = Array.from(entry.target.parentElement?.children ?? []);
          const index = siblings.filter((element) => element.matches(targets)).indexOf(entry.target);
          const animation = entry.target.animate([
            { opacity: 0, translate: `0 ${compact ? 16 : 28}px` },
            { opacity: 1, translate: "0 0" },
          ], {
            duration: compact ? 550 : 750,
            delay: compact ? 0 : Math.max(0, Math.min(index, 2)) * 90,
            easing: "cubic-bezier(.22,1,.36,1)",
            fill: "backwards",
          });
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      }, { threshold: 0, rootMargin: "0px 0px -6% 0px" });
      document.querySelectorAll(targets).forEach((element) => observer?.observe(element));
    };
    const frame = requestAnimationFrame(start);
    motion.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(frame);
      motion.removeEventListener("change", start);
      stop();
    };
  }, [pathname]);

  return null;
}
