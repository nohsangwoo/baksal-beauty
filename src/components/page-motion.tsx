"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __baksalMotionBooted?: boolean;
  }
}

const revealSelector = [
  "[data-reveal]",
  ".eyebrow",
  "h1",
  "h2",
  "h3",
  "p",
  ".button-primary",
  ".button-outline",
  ".glass-panel",
  "article",
  "form",
  "[data-magnetic]",
].join(", ");

function shouldSkipRevealTarget(target: HTMLElement) {
  if (target.closest("[data-no-reveal]")) {
    return true;
  }

  if (target.hasAttribute("data-reveal")) {
    return false;
  }

  const framedParent = target.parentElement?.closest("article, .glass-panel, form");
  return Boolean(framedParent && framedParent !== target);
}

function getMagneticNumber(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function PageMotion() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (prefersReducedMotion.matches) {
      return;
    }

    const revealTargets = new Set<HTMLElement>();

    document.querySelectorAll<HTMLElement>("[data-reveal-section]").forEach((section) => {
      let revealIndex = 0;

      section.querySelectorAll<HTMLElement>(revealSelector).forEach((target) => {
        if (shouldSkipRevealTarget(target)) {
          return;
        }

        target.dataset.reveal = target.dataset.reveal || "soft";
        target.style.setProperty("--reveal-delay", `${Math.min(revealIndex, 5) * 75}ms`);
        revealTargets.add(target);
        revealIndex += 1;
      });
    });

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((target) => {
      revealTargets.add(target);
    });

    const shouldKeepVisibleViewport = Boolean(window.__baksalMotionBooted);

    document.documentElement.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.14,
      },
    );

    revealTargets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      const isCurrentlyInView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;

      if (shouldKeepVisibleViewport && isCurrentlyInView) {
        target.classList.add("is-visible");
      }

      observer.observe(target);
    });

    window.__baksalMotionBooted = true;

    const cleanupMagneticHandlers: Array<() => void> = [];
    const canUseMagnetic = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (canUseMagnetic) {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((element) => {
        const strength = getMagneticNumber(element.dataset.magneticStrength, 8);
        const tilt = getMagneticNumber(element.dataset.magneticTilt, 2.4);

        const resetMagnetic = () => {
          element.classList.remove("is-magnetic");
          element.style.setProperty("--magnet-x", "0px");
          element.style.setProperty("--magnet-y", "0px");
          element.style.setProperty("--magnet-rx", "0deg");
          element.style.setProperty("--magnet-ry", "0deg");
        };

        const handlePointerMove = (event: PointerEvent) => {
          const rect = element.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;

          element.classList.add("is-magnetic");
          element.style.setProperty("--magnet-x", `${x * strength}px`);
          element.style.setProperty("--magnet-y", `${y * strength}px`);
          element.style.setProperty("--magnet-rx", `${x * tilt}deg`);
          element.style.setProperty("--magnet-ry", `${y * -tilt}deg`);
        };

        element.addEventListener("pointermove", handlePointerMove);
        element.addEventListener("pointerleave", resetMagnetic);

        cleanupMagneticHandlers.push(() => {
          element.removeEventListener("pointermove", handlePointerMove);
          element.removeEventListener("pointerleave", resetMagnetic);
          resetMagnetic();
        });
      });
    }

    return () => {
      observer.disconnect();
      cleanupMagneticHandlers.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
