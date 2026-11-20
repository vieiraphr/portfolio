"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { pluck } from "./audio";

// Afinação padrão, da corda mais grave (em cima) para a mais aguda
const STRINGS = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];
const VIEW_H = 130;
const Y0 = 44;
const GAP = 8;

export function MiniGuitar({ label }: { label: string }) {
  const [hits, setHits] = useState<number[]>(() => STRINGS.map(() => 0));
  const svgRef = useRef<SVGSVGElement>(null);
  const pressed = useRef(false);
  const lastString = useRef<number | null>(null);
  const lastY = useRef<number | null>(null);

  const hit = (i: number) => {
    pluck(STRINGS[i]);
    setHits((h) => h.map((count, j) => (j === i ? count + 1 : count)));
  };

  const toViewY = (clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return ((clientY - rect.top) / rect.height) * VIEW_H;
  };

  /** Toca toda corda cruzada entre a posição anterior e a atual. */
  const strumTo = (y: number) => {
    const from = lastY.current;
    lastY.current = y;
    if (from === null) return;
    const lo = Math.min(from, y);
    const hi = Math.max(from, y);
    const crossed = STRINGS.map((_, i) => i).filter((i) => {
      const sy = Y0 + i * GAP;
      return sy >= lo && sy <= hi;
    });
    if (y < from) crossed.reverse();
    crossed.forEach((i, n) => {
      if (i !== lastString.current) setTimeout(() => hit(i), n * 18);
      lastString.current = i;
    });
  };

  const onDown = (e: PointerEvent<SVGSVGElement>) => {
    pressed.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const y = toViewY(e.clientY);
    const nearest = Math.round((y - Y0) / GAP);
    if (nearest >= 0 && nearest < STRINGS.length && Math.abs(y - (Y0 + nearest * GAP)) < GAP / 2) {
      hit(nearest);
      lastString.current = nearest;
    } else {
      lastString.current = null;
    }
    lastY.current = y;
  };

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!pressed.current) return;
    strumTo(toViewY(e.clientY));
  };

  const onUp = () => {
    pressed.current = false;
    lastString.current = null;
    lastY.current = null;
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const n = Number(event.key);
    if (n >= 1 && n <= 6) hit(n - 1);
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      STRINGS.forEach((_, i) => setTimeout(() => hit(i), i * 35));
    }
  };

  return (
    <div
      className="h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
      role="group"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 320 ${VIEW_H}`}
        className="h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        aria-hidden
      >
        <defs>
          <linearGradient id="gtr-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d99a52" />
            <stop offset="1" stopColor="#a8642a" />
          </linearGradient>
          <linearGradient id="gtr-neck" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a2e1b" />
            <stop offset="1" stopColor="#2f1d11" />
          </linearGradient>
        </defs>

        {/* corpo */}
        <ellipse cx="224" cy="65" rx="38" ry="46" fill="url(#gtr-body)" />
        <ellipse cx="276" cy="65" rx="40" ry="58" fill="url(#gtr-body)" />
        <circle cx="226" cy="65" r="17" fill="#1a0f08" stroke="#6d3f1a" strokeWidth="4" />

        {/* braço, mão e trastes */}
        <rect x="4" y="36" width="30" height="58" rx="7" fill="#2a1a10" />
        {[44, 56, 68, 80].map((y) => (
          <circle key={y} cx="12" cy={y} r="3" fill="#d6d0c2" />
        ))}
        <rect x="30" y="38" width="170" height="54" fill="url(#gtr-neck)" />
        {[54, 76, 96, 114, 130, 145, 159, 172, 184].map((x) => (
          <line key={x} x1={x} y1="38" x2={x} y2="92" stroke="#cfc8b8" strokeWidth="1.2" opacity=".55" />
        ))}
        {[86, 121, 152].map((x) => (
          <circle key={x} cx={x} cy="65" r="2.2" fill="#e9e3d4" opacity=".7" />
        ))}

        {/* cavalete */}
        <rect x="286" y="38" width="9" height="54" rx="2" fill="#2a1a10" />

        {/* cordas */}
        {STRINGS.map((_, i) => (
          <g key={`${i}-${hits[i]}`} className={hits[i] > 0 ? "string-vib" : undefined}>
            <line
              x1="30"
              x2="290"
              y1={Y0 + i * GAP}
              y2={Y0 + i * GAP}
              stroke="#e8e2d4"
              strokeWidth={2.4 - i * 0.3}
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
