"use client";

import { useEffect, useRef } from "react";

/**
 * Luz suave que segue o ponteiro do mouse. É um círculo de tamanho fixo movido com
 * transform (feito pela placa de vídeo), então não repinta a tela inteira a cada movimento.
 * Só liga em aparelhos com mouse.
 */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (document.documentElement.dataset.lite) return;

    const half = el.offsetWidth / 2;
    let frame = 0;
    let x = 0;
    let y = 0;
    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.style.transform = `translate3d(${x - half}px, ${y - half}px, 0)`;
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

/** Fundo fixo: grade, manchas de cor estáticas e a luz do mouse. */
export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [contain:strict]" aria-hidden>
      <div className="bg-grid" />
      <div className="blob blob-a" />
      <div className="blob blob-b" />
      <Spotlight />
    </div>
  );
}
