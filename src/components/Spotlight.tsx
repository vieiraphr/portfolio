"use client";

import { useEffect, useRef } from "react";

/** Luz suave que segue o ponteiro do mouse pelo fundo da página. */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${event.clientX}px`);
        el.style.setProperty("--my", `${event.clientY}px`);
        el.style.opacity = "1";
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <div ref={ref} className="spotlight" aria-hidden />;
}

/** Fundo fixo: grade, manchas de cor animadas, ruído e a luz do cursor. */
export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="bg-grid" />
      <div className="blob blob-a" />
      <div className="blob blob-b" />
      <div className="noise" />
      <Spotlight />
    </div>
  );
}
