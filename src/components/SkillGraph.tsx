"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Group = "hard" | "ai" | "soft";

type Props = {
  hubs: Record<Group, string>;
  hard: string[];
  ai: string[];
  soft: string[];
  label: string;
  /** Conteúdo do nó central (a foto). */
  children: ReactNode;
  /** Seletor de um elemento (o nome) cuja altura o nó central acompanha quando estão lado a lado. */
  alignTo?: string;
};

type Node = {
  id: string;
  label: string;
  group: Group | "center";
  hub: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  dragging: boolean;
  /** largura do rótulo em px (para não cortar nem passar por baixo da foto) */
  lw: number;
};

type Link = { a: number; b: number; len: number };

const COLORS: Record<Group, string> = {
  hard: "#b07cff",
  ai: "#00ff41",
  soft: "#cdb8ff",
};

/** Ligações extras entre habilidades relacionadas (índices de cada lista). */
const CROSS: [Group, number, Group, number][] = [
  ["hard", 0, "hard", 1],
  ["hard", 1, "hard", 2],
  ["hard", 0, "hard", 8],
  ["hard", 5, "hard", 6],
  ["hard", 3, "hard", 10],
  ["hard", 9, "hard", 10],
  ["hard", 0, "hard", 7],
  ["hard", 3, "hard", 7],
  ["hard", 4, "hard", 8],
  ["soft", 0, "hard", 9],
  ["soft", 4, "soft", 0],
  ["soft", 1, "soft", 2],
  ["soft", 3, "ai", 3],
  ["ai", 1, "hard", 0],
  ["ai", 2, "hard", 3],
  ["ai", 0, "soft", 1],
  ["soft", 5, "soft", 3],
];

/**
 * Grafo de habilidades no estilo do "graph view" do Obsidian:
 * a foto é o nó central, ligada a três grupos de habilidades.
 */
export function SkillGraph({ hubs, hard, ai, soft, label, children, alignTo }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const centerEl = centerRef.current;
    if (!wrap || !canvas || !centerEl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(document.body).fontFamily;

    /* ---------- montagem dos nós ---------- */
    let width = 0;
    let height = 0;
    const nodes: Node[] = [];
    const links: Link[] = [];
    const index: Record<string, number> = {};

    const add = (id: string, text: string, group: Node["group"], hub: boolean, r: number) => {
      index[id] = nodes.length;
      nodes.push({ id, label: text, group, hub, x: 0, y: 0, vx: 0, vy: 0, r, phase: Math.random() * Math.PI * 2, dragging: false, lw: 0 });
    };

    add("center", "", "center", true, 0);
    const lists: Record<Group, string[]> = { hard, ai, soft };
    (Object.keys(lists) as Group[]).forEach((g) => {
      add(`hub-${g}`, hubs[g], g, true, 7);
      links.push({ a: index.center, b: index[`hub-${g}`], len: 1.0 });
      lists[g].forEach((text, i) => {
        add(`${g}-${i}`, text, g, false, 3.6);
        links.push({ a: index[`hub-${g}`], b: index[`${g}-${i}`], len: 0.55 });
      });
    });
    CROSS.forEach(([ga, ia, gb, ib]) => {
      const a = index[`${ga}-${ia}`];
      const b = index[`${gb}-${ib}`];
      if (a !== undefined && b !== undefined) links.push({ a, b, len: 0.7 });
    });

    const neighbors = nodes.map(() => new Set<number>());
    links.forEach(({ a, b }) => {
      neighbors[a].add(b);
      neighbors[b].add(a);
    });
    nodes.forEach((n, i) => {
      if (!n.hub) n.r = 3.2 + Math.min(neighbors[i].size, 4) * 0.45;
    });

    /* ---------- tamanho e posições iniciais ---------- */
    let unit = 1; // escala das distâncias
    // caixa da foto (meia largura / meia altura), incluindo o adesivo embaixo
    let photoHalf = 60;
    let small = false; // tela estreita: fonte menor
    const fontFor = (n: Node) => (n.hub ? `600 ${small ? 11 : 12}px ${font}` : `${small ? 10 : 11}px ${font}`);
    const measure = () =>
      nodes.forEach((n) => {
        ctx.font = fontFor(n);
        n.lw = ctx.measureText(n.label).width;
      });
    let photoBottom = 80;
    let anchored = false; // foto alinhada ao nome (desktop)
    const center = nodes[index.center];

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const prevW = width || rect.width;
      const prevH = height || rect.height;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      unit = Math.sqrt(width * height) / 2.7;
      small = width < 480;
      measure();
      // largura da foto ou do adesivo console.log, o que for maior
      const sticker = centerEl.querySelector("span") as HTMLElement | null;
      photoHalf = Math.max(centerEl.offsetWidth / 2, (sticker?.offsetWidth ?? 0) / 2) + 10;
      photoBottom = centerEl.offsetHeight / 2 + 30; // espaço do console.log
      // reescala posições quando o tamanho muda
      nodes.forEach((n) => {
        n.x = (n.x / prevW) * width;
        n.y = (n.y / prevH) * height;
      });
      center.x = width / 2;
      center.y = height / 2;
      anchored = false;
      const target = alignTo ? document.querySelector(alignTo) : null;
      if (target) {
        const t = target.getBoundingClientRect();
        const f = wrap.getBoundingClientRect();
        if (t.right <= f.left + 1) {
          // lado a lado: a foto fica na mesma altura do centro do nome
          const y = t.top + t.height / 2 - f.top;
          center.y = Math.max(centerEl.offsetHeight / 2 + 4, Math.min(height - photoBottom - 40, y));
          anchored = true;
        }
      }
      centerEl.style.top = `${center.y}px`;
    };

    const placeInitial = () => {
      const angles: Record<Group, number> = anchored
        ? { hard: Math.PI - 0.2, ai: Math.PI / 2, soft: 0.2 }
        : { hard: -Math.PI / 2 - 0.5, ai: Math.PI / 2 + 0.9, soft: 0.25 };
      (Object.keys(lists) as Group[]).forEach((g) => {
        const hub = nodes[index[`hub-${g}`]];
        hub.x = center.x + Math.cos(angles[g]) * width * (anchored ? 0.36 : 0.3);
        hub.y = (anchored ? center.y + height * 0.12 : center.y) + Math.sin(angles[g]) * height * (anchored ? 0.42 : 0.3);
        lists[g].forEach((_, i) => {
          const n = nodes[index[`${g}-${i}`]];
          const a = angles[g] + (i / lists[g].length - 0.5) * 2.4;
          n.x = hub.x + Math.cos(a) * unit * 0.5;
          n.y = hub.y + Math.sin(a) * unit * 0.5;
        });
      });
    };

    width = wrap.getBoundingClientRect().width;
    height = wrap.getBoundingClientRect().height;
    resize();
    placeInitial();

    /* ---------- física ---------- */
    let t = 0;
    const step = (dt: number, drift: boolean) => {
      const n = nodes.length;
      // repulsão
      for (let i = 1; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const a = nodes[i];
          const b = nodes[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 1) {
            dx = Math.random() - 0.5;
            dy = Math.random() - 0.5;
            d2 = 1;
          }
          const d = Math.sqrt(d2);
          const f = (unit * unit * 0.012) / d2;
          const fx = (dx / d) * f;
          const fy = (dy / d) * f;
          a.vx -= fx;
          a.vy -= fy;
          b.vx += fx;
          b.vy += fy;

          // rótulos encavalados: empurra para os lados/para cima e para baixo
          const overlapX = (a.lw + b.lw) / 2 + 8 - Math.abs(dx);
          const overlapY = 22 - Math.abs(dy);
          if (overlapX > 0 && overlapY > 0) {
            if (overlapY < overlapX) {
              const push = (dy >= 0 ? 1 : -1) * overlapY * 0.18;
              a.vy -= push;
              b.vy += push;
            } else {
              const push = (dx >= 0 ? 1 : -1) * overlapX * 0.18;
              a.vx -= push;
              b.vx += push;
            }
          }
        }
      }
      // molas
      links.forEach(({ a, b, len }) => {
        const na = nodes[a];
        const nb = nodes[b];
        const dx = nb.x - na.x;
        const dy = nb.y - na.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const target = len * unit;
        const f = (d - target) * 0.02;
        const fx = (dx / d) * f;
        const fy = (dy / d) * f;
        if (na.group !== "center") {
          na.vx += fx;
          na.vy += fy;
        }
        nb.vx -= fx;
        nb.vy -= fy;
      });
      // gravidade, colisão com a foto, bordas
      for (let i = 1; i < n; i++) {
        const node = nodes[i];
        if (node.dragging) {
          node.vx = node.vy = 0;
          continue;
        }
        node.vx += (width / 2 - node.x) * (anchored ? 0.0006 : 0.0012);
        const gy = anchored ? center.y + height * 0.22 : height / 2;
        node.vy += (gy - node.y) * (small ? 0.0004 : anchored ? 0.0005 : 0.0012);
        if (drift) {
          node.vx += Math.cos(t * 0.6 + node.phase) * 0.012;
          node.vy += Math.sin(t * 0.5 + node.phase) * 0.012;
        }
        node.vx *= 0.82;
        node.vy *= 0.82;
        node.x += node.vx * dt;
        node.y += node.vy * dt;
        keepClear(node);
      }
    };

    /** Mantém nó + rótulo fora da foto e dentro da área (sem cortar texto). */
    const keepClear = (node: Node) => {
      const halfW = Math.max(node.r, node.lw / 2) + 4;
      const top = node.r + 2;
      const bottom = node.r + 20;
      // caixa do nó vs caixa da foto
      const left = center.x - photoHalf - halfW;
      const right = center.x + photoHalf + halfW;
      const up = center.y - photoHalf - bottom;
      const down = center.y + photoBottom + top;
      if (node.x > left && node.x < right && node.y > up && node.y < down) {
        const pushes = [node.x - left, right - node.x, node.y - up, down - node.y];
        const min = Math.min(...pushes);
        if (min === pushes[0]) node.x = left;
        else if (min === pushes[1]) node.x = right;
        else if (min === pushes[2]) node.y = up;
        else node.y = down;
      }
      node.x = Math.max(halfW + 2, Math.min(width - halfW - 2, node.x));
      node.y = Math.max(top + 4, Math.min(height - bottom, node.y));
    };

    for (let i = 0; i < 400; i++) step(1, false); // já começa assentado

    /* ---------- desenho ---------- */
    let hovered: number | null = null;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const focus = hovered !== null ? neighbors[hovered] : null;
      const lit = (i: number) => hovered === null || i === hovered || focus!.has(i);

      // linhas
      links.forEach(({ a, b }) => {
        const na = nodes[a];
        const nb = nodes[b];
        const active = hovered !== null && (a === hovered || b === hovered);
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        if (active) {
          const g = nb.group === "center" ? na.group : nb.group;
          ctx.strokeStyle = g === "center" ? "#b07cff" : COLORS[g as Group];
          ctx.globalAlpha = 0.85;
          ctx.lineWidth = 1.4;
        } else {
          ctx.strokeStyle = "#ffffff";
          ctx.globalAlpha = hovered === null ? 0.13 : 0.04;
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      // nós e rótulos
      nodes.forEach((node, i) => {
        if (node.group === "center") return;
        const color = COLORS[node.group];
        const on = lit(i);
        ctx.globalAlpha = on ? 1 : 0.18;
        if (node.hub || i === hovered) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 14;
        }
        ctx.beginPath();
        ctx.arc(node.x, node.y, i === hovered ? node.r + 2 : node.r, 0, Math.PI * 2);
        ctx.fillStyle = node.hub ? color : i === hovered ? color : hovered === null ? "#8b84a0" : color;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = fontFor(node);
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = node.hub ? color : i === hovered ? "#ffffff" : "#a8a1bb";
        ctx.fillText(node.label, node.x, node.y + node.r + 4);
      });
      ctx.globalAlpha = 1;
    };

    /* ---------- loop ---------- */
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 16.7, 2);
      last = now;
      t += dt / 60;
      step(dt, !reduced);
      draw();
    };
    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    draw();
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(wrap);
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(wrap);
    // remede depois que as fontes e a animação de entrada terminam
    const remeasure = () => {
      resize();
      draw();
    };
    document.fonts?.ready.then(remeasure);
    const settle = setTimeout(remeasure, 1300);

    /* ---------- interação ---------- */
    let dragging: Node | null = null;

    const pick = (x: number, y: number) => {
      let best: number | null = null;
      let bestD = 18;
      nodes.forEach((n, i) => {
        if (n.group === "center") return;
        const d = Math.hypot(n.x - x, n.y - y);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      return best;
    };
    const local = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onMove = (e: PointerEvent) => {
      const p = local(e);
      if (dragging) {
        dragging.x = p.x;
        dragging.y = p.y;
        keepClear(dragging);
        return;
      }
      hovered = pick(p.x, p.y);
      canvas.style.cursor = hovered !== null ? "grab" : "default";
      if (!raf) draw();
    };
    const onDown = (e: PointerEvent) => {
      const p = local(e);
      const i = pick(p.x, p.y);
      hovered = i;
      // no toque, só destaca (para não travar a rolagem da página)
      if (i !== null && e.pointerType !== "touch") {
        dragging = nodes[i];
        dragging.dragging = true;
        canvas.style.cursor = "grabbing";
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch {
          /* sem captura, o arraste ainda funciona dentro do canvas */
        }
      }
      if (!raf) draw();
    };
    const onUp = () => {
      if (dragging) dragging.dragging = false;
      dragging = null;
      canvas.style.cursor = hovered !== null ? "grab" : "default";
    };
    const onLeave = () => {
      if (dragging) return;
      hovered = null;
      if (!raf) draw();
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      clearTimeout(settle);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [hubs, hard, ai, soft, alignTo]);

  const all = [...hard, ...ai, ...soft];

  return (
    <figure ref={wrapRef} className="relative h-[28rem] w-full sm:h-[28rem] lg:h-[31rem]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-pan-y" role="img" aria-label={`${label}: ${all.join(", ")}`} />
      <div ref={centerRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </figure>
  );
}
