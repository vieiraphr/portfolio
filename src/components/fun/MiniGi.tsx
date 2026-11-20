"use client";

import { useEffect, useRef, useState } from "react";

/* Paleta do kimono preto */
const EDGE = "#2f2939"; // contorno que separa o tecido preto do fundo
const STITCH = "#4a4258"; // costuras
const SHADOW = "#050407";
const BELT_EDGE = "#c9c1ae";
const STITCH_BELT = "#b5ad99";

/* Mangas: a direita é o espelho da esquerda (viewBox de 200 de largura) */
const LEFT_SLEEVE = "M57 30 C45 34 35 40 29 49 L7 104 C6 108 8 111 12 112 L37 119 C40 120 43 118 44 115 L59 75 Z";
const RIGHT_SLEEVE = "M143 30 C155 34 165 40 171 49 L193 104 C194 108 192 111 188 112 L163 119 C160 120 157 118 156 115 L141 75 Z";

/**
 * Kimono preto, corte justo, com faixa branca de 3 graus.
 * Clique: cumprimento "Oss!" e os graus reaparecem um a um.
 */
export function MiniGi({ label, bow }: { label: string; bow: string }) {
  const [stripes, setStripes] = useState(3);
  const [bowKey, setBowKey] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const greet = () => {
    timers.current.forEach(clearTimeout);
    setBowKey((k) => k + 1);
    setStripes(0);
    timers.current = [1, 2, 3].map((n) => setTimeout(() => setStripes(n), 350 + n * 260));
  };

  return (
    <button
      type="button"
      onClick={greet}
      aria-label={label}
      className="relative flex h-full w-full items-center justify-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span className="gi-glow pointer-events-none absolute inset-0" aria-hidden />
      {bowKey > 0 && (
        <span
          key={`bubble-${bowKey}`}
          className="bubble-pop absolute right-[14%] top-1 z-10 rounded-xl rounded-bl-none bg-accent-strong px-3 py-1 font-mono text-sm font-bold text-white"
          aria-hidden
        >
          {bow} 🙏
        </span>
      )}

      <svg
        key={`gi-${bowKey}`}
        viewBox="0 0 200 220"
        className={`relative h-full drop-shadow-[0_14px_22px_rgba(0,0,0,0.7)] ${bowKey > 0 ? "gi-bow" : "gi-idle"}`}
        aria-hidden
      >
        <defs>
          {/* tecido: mais claro no centro, escurecendo nas laterais */}
          <linearGradient id="gi-fabric" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0c0a10" />
            <stop offset="0.38" stopColor="#1e1a27" />
            <stop offset="0.62" stopColor="#1a1622" />
            <stop offset="1" stopColor="#0a090d" />
          </linearGradient>
          <linearGradient id="gi-sleeve-l" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b1723" />
            <stop offset="1" stopColor="#0b0a0e" />
          </linearGradient>
          <linearGradient id="gi-sleeve-r" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1b1723" />
            <stop offset="1" stopColor="#0b0a0e" />
          </linearGradient>
          <linearGradient id="gi-collar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#14111a" />
            <stop offset="0.5" stopColor="#262130" />
            <stop offset="1" stopColor="#100e15" />
          </linearGradient>
          <linearGradient id="gi-belt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbf9f3" />
            <stop offset="1" stopColor="#ddd6c6" />
          </linearGradient>
          {/* trama do tecido (pearl weave) */}
          <pattern id="gi-weave" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M0 0 L4 4 M4 0 L0 4" stroke="#ffffff" strokeWidth="0.4" opacity="0.05" />
          </pattern>
          {/* sombra que a lapela de cima projeta */}
          <linearGradient id="gi-lapel-shadow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={SHADOW} stopOpacity="0" />
            <stop offset="1" stopColor={SHADOW} stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* ---------- mangas ---------- */}
        {[
          { d: LEFT_SLEEVE, fill: "url(#gi-sleeve-l)" },
          { d: RIGHT_SLEEVE, fill: "url(#gi-sleeve-r)" },
        ].map((sleeve) => (
          <g key={sleeve.d}>
            <path d={sleeve.d} fill={sleeve.fill} stroke={EDGE} strokeWidth="1.3" strokeLinejoin="round" />
            <path d={sleeve.d} fill="url(#gi-weave)" />
          </g>
        ))}
        {/* punhos reforçados */}
        <path d="M9 100 L39 108 L37 119 L12 112 C8 111 6 108 7 104 Z" fill="#0a090d" stroke={EDGE} strokeWidth="1" />
        <path d="M191 100 L161 108 L163 119 L188 112 C192 111 194 108 193 104 Z" fill="#0a090d" stroke={EDGE} strokeWidth="1" />
        <path d="M10 104 L37 111.5" stroke={STITCH} strokeWidth="0.7" strokeDasharray="1.6 1.4" />
        <path d="M190 104 L163 111.5" stroke={STITCH} strokeWidth="0.7" strokeDasharray="1.6 1.4" />
        {/* dobras das mangas */}
        <path d="M44 48 Q38 72 30 96" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="2" fill="none" />
        <path d="M156 48 Q162 72 170 96" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="2" fill="none" />
        <path d="M52 60 Q48 78 42 98" stroke={SHADOW} strokeOpacity="0.6" strokeWidth="1.2" fill="none" />
        <path d="M148 60 Q152 78 158 98" stroke={SHADOW} strokeOpacity="0.6" strokeWidth="1.2" fill="none" />


        {/* ---------- corpo (corte justo: cintura marcada) ---------- */}
        <path
          d="M84 15 C74 19 65 24 57 30 L59 75 C61 92 61 106 60 120 C58 150 56 178 53 204 Q100 213 147 204 C144 178 142 150 140 120 C139 106 139 92 141 75 L143 30 C135 24 126 19 116 15 Z"
          fill="url(#gi-fabric)"
          stroke={EDGE}
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M84 15 C74 19 65 24 57 30 L59 75 C61 92 61 106 60 120 C58 150 56 178 53 204 Q100 213 147 204 C144 178 142 150 140 120 C139 106 139 92 141 75 L143 30 C135 24 126 19 116 15 Z"
          fill="url(#gi-weave)"
        />
        {/* costuras dos ombros/cavas */}
        <path d="M57 30 L59 75" stroke={STITCH} strokeWidth="0.7" strokeDasharray="1.6 1.4" />
        <path d="M143 30 L141 75" stroke={STITCH} strokeWidth="0.7" strokeDasharray="1.6 1.4" />

        {/* interior visível no decote */}
        <path d="M92 15 L100 60 L108 15 Z" fill="#060509" />

        {/* lapela de baixo (só até o cruzamento) */}
        <path d="M80 15 L92 15 L105 64 L96 69 Z" fill="url(#gi-collar)" stroke={EDGE} strokeWidth="0.8" />
        <path d="M86 17 L100 66" stroke={STITCH} strokeWidth="0.7" strokeDasharray="1.6 1.4" />
        <path d="M83.5 17 L97.5 67 M88.5 17 L102.5 65" stroke={STITCH} strokeWidth="0.4" strokeOpacity="0.6" />

        {/* sombra da lapela de cima sobre o tecido */}
        <path d="M84 116 L108 18 L104 18 L78 118 Z" fill="url(#gi-lapel-shadow)" opacity="0.8" />
        {/* lapela de cima: gola grossa e acolchoada */}
        <path d="M108 15 L120 15 L95 120 L83 117 Z" fill="url(#gi-collar)" stroke={EDGE} strokeWidth="0.8" />
        <path d="M114 17 L89 118" stroke={STITCH} strokeWidth="0.7" strokeDasharray="1.6 1.4" />
        <path d="M111 17 L86 117 M117 17 L92 119" stroke={STITCH} strokeWidth="0.4" strokeOpacity="0.6" />
        <path d="M120 15 L95 120" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" />

        {/* abertura da saia abaixo da faixa (painel de cima sobre o de baixo) */}
        <path d="M90 134 L84 208" stroke={SHADOW} strokeWidth="2.4" />
        <path d="M91.4 134 L85.6 208" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1" />

        {/* barra reforçada e aberturas laterais */}
        <path d="M55 197 Q100 205.5 145 197" stroke={STITCH} strokeWidth="0.7" strokeDasharray="1.6 1.4" fill="none" />
        <path d="M56 184 L54 204" stroke={SHADOW} strokeWidth="1.6" />
        <path d="M144 184 L146 204" stroke={SHADOW} strokeWidth="1.6" />

        {/* ---------- faixa branca ---------- */}
        <path d="M59 117 Q100 125 141 117 L141 130 Q100 138 59 130 Z" fill="url(#gi-belt)" stroke={BELT_EDGE} strokeWidth="0.8" />
        <path d="M60 121.3 Q100 129.3 140 121.3" stroke={STITCH_BELT} strokeWidth="0.45" fill="none" />
        <path d="M60 125.6 Q100 133.6 140 125.6" stroke={STITCH_BELT} strokeWidth="0.45" fill="none" />

        {/* pontas penduradas */}
        <g transform="translate(96 133) rotate(17)">
          <rect x="-5.5" y="0" width="11" height="40" rx="1" fill="url(#gi-belt)" stroke={BELT_EDGE} strokeWidth="0.8" />
          <path d="M-2 1 V39 M2 1 V39" stroke={STITCH_BELT} strokeWidth="0.4" />
        </g>
        <g transform="translate(104 133) rotate(-15)">
          <rect x="-5.5" y="0" width="11" height="46" rx="1" fill="url(#gi-belt)" stroke={BELT_EDGE} strokeWidth="0.8" />
          <path d="M-2 1 V27 M2 1 V27" stroke={STITCH_BELT} strokeWidth="0.4" />
          {/* ponteira preta e graus */}
          <rect x="-5.5" y="27" width="11" height="15" fill="#0b0a0e" />
          {[0, 1, 2].map((n) => (
            <rect
              key={n}
              x="-5.5"
              y={29.5 + n * 4}
              width="11"
              height="2.2"
              fill="#fbf9f3"
              className={n < stripes ? "stripe-on" : "stripe-off"}
            />
          ))}
        </g>

        {/* nó (quadrado) */}
        <path d="M89 119 Q100 116 111 119 L113 136 Q100 139 87 136 Z" fill="url(#gi-belt)" stroke={BELT_EDGE} strokeWidth="0.9" />
        <path d="M90 121 L110 134" stroke={BELT_EDGE} strokeWidth="1.4" />
        <path d="M91 125 L104 134.5" stroke={STITCH_BELT} strokeWidth="0.45" />
      </svg>
    </button>
  );
}
