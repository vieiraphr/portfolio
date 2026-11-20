"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { pluck } from "./audio";

const FREQS = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];

/*
 * Posição das cordas na foto /guitar-3d.webp (952×300), em frações da imagem.
 * Cada corda vai do nut (perto da mão) até o rastilho (no corpo).
 */
const NUT = { x: 0.247, y0: 0.51, step: 0.016 };
const BRIDGE = { x: 0.8, y0: 0.257, step: 0.0273 };
const stringY = (i: number, x: number) => {
  const t = (x - NUT.x) / (BRIDGE.x - NUT.x);
  return NUT.y0 + i * NUT.step + t * (BRIDGE.y0 + i * BRIDGE.step - (NUT.y0 + i * NUT.step));
};

/**
 * Violão para navegadores sem WebGL: uma foto do próprio violão 3D (renderizada com GPU)
 * com as cordas tocáveis por cima. Mesmo visual e mesmo som, sem precisar de aceleração de vídeo.
 */
export function MiniGuitarImage({ label, title }: { label: string; title?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [hits, setHits] = useState<number[]>(() => FREQS.map(() => 0));
  const pressed = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const lastString = useRef<number | null>(null);

  const hit = (i: number) => {
    pluck(FREQS[i]);
    setHits((h) => h.map((c, j) => (j === i ? c + 1 : c)));
  };

  const toLocal = (e: PointerEvent) => {
    const r = boxRef.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  };

  /** Corda mais próxima do ponto, se estiver em cima de uma. */
  const stringAt = (p: { x: number; y: number }) => {
    if (p.x < NUT.x - 0.02 || p.x > BRIDGE.x + 0.02) return null;
    let best: number | null = null;
    let bestD = 0.025;
    FREQS.forEach((_, i) => {
      const d = Math.abs(p.y - stringY(i, p.x));
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    pressed.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* segue sem captura */
    }
    const p = toLocal(e);
    const i = stringAt(p);
    if (i !== null) hit(i);
    lastString.current = i;
    last.current = p;
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!pressed.current || !last.current) return;
    const p = toLocal(e);
    // amostra o caminho entre os dois eventos para não pular cordas num arraste rápido
    for (let s = 1; s <= 8; s++) {
      const q = { x: last.current.x + ((p.x - last.current.x) * s) / 8, y: last.current.y + ((p.y - last.current.y) * s) / 8 };
      const i = stringAt(q);
      if (i !== null && i !== lastString.current) hit(i);
      if (i !== null) lastString.current = i;
    }
    last.current = p;
  };

  const onUp = () => {
    pressed.current = false;
    last.current = null;
    lastString.current = null;
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const n = Number(event.key);
    if (n >= 1 && n <= 6) hit(n - 1);
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      FREQS.forEach((_, i) => setTimeout(() => hit(i), i * 35));
    }
  };

  return (
    <div
      className="flex h-full items-center justify-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
      role="group"
      aria-label={label}
      title={title}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div
        ref={boxRef}
        className="guitar-photo relative aspect-[952/300] max-h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <Image src="/guitar-3d.webp" alt="" fill sizes="(min-width: 768px) 480px, 100vw" className="pointer-events-none object-contain" />
        <svg viewBox="0 0 1 1" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          {FREQS.map((_, i) =>
            hits[i] > 0 ? (
              <line
                key={`${i}-${hits[i]}`}
                className="photo-string"
                x1={NUT.x}
                y1={stringY(i, NUT.x)}
                x2={BRIDGE.x}
                y2={stringY(i, BRIDGE.x)}
                vectorEffect="non-scaling-stroke"
              />
            ) : null,
          )}
        </svg>
      </div>
    </div>
  );
}
