import { useEffect, useRef } from "react";

let activeOverlayLocks = 0;
let overlayInitialStyles: {
  bodyOverscroll: string;
  bodyPaddingRight: string;
  rootScrollBehavior: string;
} | null = null;

export function useOverlayLock(close: () => void, enabled = true) {
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    const body = document.body;
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const scrollbarGap = Math.max(0, window.innerWidth - root.clientWidth);
    const isFirstOverlay = activeOverlayLocks === 0;
    if (isFirstOverlay) {
      overlayInitialStyles = {
        bodyOverscroll: body.style.overscrollBehavior,
        bodyPaddingRight: body.style.paddingRight,
        rootScrollBehavior: root.style.scrollBehavior,
      };
    }
    activeOverlayLocks += 1;
    const isInsideScrollableOverlay = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(".overlay-scroll-region"));
    const stopBackgroundWheel = (event: WheelEvent) => {
      if (!isInsideScrollableOverlay(event.target)) event.preventDefault();
    };
    const stopBackgroundTouch = (event: TouchEvent) => {
      if (!isInsideScrollableOverlay(event.target)) event.preventDefault();
    };
    const keepPagePosition = () => {
      if (window.scrollX !== scrollX || window.scrollY !== scrollY) {
        window.scrollTo(scrollX, scrollY);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key === "Tab") {
        const panels = document.querySelectorAll<HTMLElement>(
          '.overlay-drawer-panel[role="dialog"]',
        );
        const panel = panels[panels.length - 1];
        if (!panel) return;
        const focusable = Array.from(
          panel.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }
      const target = event.target;
      const editable =
        target instanceof HTMLElement &&
        (target.matches("input, textarea, select") || target.isContentEditable);
      if (
        !editable &&
        !isInsideScrollableOverlay(target) &&
        ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(
          event.key,
        )
      ) {
        event.preventDefault();
      }
    };

    if (isFirstOverlay) {
      root.classList.add("overlay-open");
      root.style.scrollBehavior = "auto";
      body.style.overscrollBehavior = "none";
      if (scrollbarGap) body.style.paddingRight = `${scrollbarGap}px`;
    }
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("scroll", keepPagePosition, { passive: true });
    document.addEventListener("wheel", stopBackgroundWheel, {
      capture: true,
      passive: false,
    });
    document.addEventListener("touchmove", stopBackgroundTouch, {
      capture: true,
      passive: false,
    });
    const focusFrame = window.requestAnimationFrame(() => {
      const panels = document.querySelectorAll<HTMLElement>(
        '.overlay-drawer-panel[role="dialog"]',
      );
      const panel = panels[panels.length - 1];
      if (panel && !panel.contains(document.activeElement)) {
        panel
          .querySelector<HTMLElement>(
            '[autofocus], button:not([disabled]), a[href], input:not([disabled])',
          )
          ?.focus();
      }
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("scroll", keepPagePosition);
      document.removeEventListener("wheel", stopBackgroundWheel, true);
      document.removeEventListener("touchmove", stopBackgroundTouch, true);
      activeOverlayLocks = Math.max(0, activeOverlayLocks - 1);
      if (activeOverlayLocks === 0) {
        root.classList.remove("overlay-open");
        root.style.scrollBehavior = overlayInitialStyles?.rootScrollBehavior || "";
        body.style.overscrollBehavior = overlayInitialStyles?.bodyOverscroll || "";
        body.style.paddingRight = overlayInitialStyles?.bodyPaddingRight || "";
        overlayInitialStyles = null;
      }
      window.requestAnimationFrame(() => previousFocus?.focus());
    };
  }, [enabled]);
}
