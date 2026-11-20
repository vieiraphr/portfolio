"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/**
 * Rolagem suave com inércia (Lenis). Desligada no modo leve (navegador sem GPU). Os links "#secao" também deslizam até o destino,
 * parando logo abaixo da barra de navegação fixa. Desligada para quem prefere menos movimento.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // modo leve (sem GPU): a rolagem nativa do navegador é mais rápida que qualquer suavização
    if (document.documentElement.dataset.lite) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.12,
      anchors: { duration: 1.4 }, // o recuo vem do scroll-margin das seções (scroll-mt-16)
      prevent: (node) => node.closest?.("[data-lenis-prevent]") != null,
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
