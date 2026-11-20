"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/**
 * Rolagem suave com inércia (Lenis). Os links "#secao" também deslizam até o destino,
 * parando logo abaixo da barra de navegação fixa. Desligada para quem prefere menos movimento.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      anchors: { duration: 1.4 }, // o recuo vem do scroll-margin das seções (scroll-mt-16)
      prevent: (node) => node.closest?.("[data-lenis-prevent]") != null,
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
