"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { playKey } from "./audio";

const WHITE = [
  { note: "C", freq: 261.63, key: "a" },
  { note: "D", freq: 293.66, key: "s" },
  { note: "E", freq: 329.63, key: "d" },
  { note: "F", freq: 349.23, key: "f" },
  { note: "G", freq: 392.0, key: "g" },
  { note: "A", freq: 440.0, key: "h" },
  { note: "B", freq: 493.88, key: "j" },
  { note: "C", freq: 523.25, key: "k" },
];

// `after` = índice da tecla branca à esquerda da preta
const BLACK = [
  { note: "C#", freq: 277.18, key: "w", after: 0 },
  { note: "D#", freq: 311.13, key: "e", after: 1 },
  { note: "F#", freq: 369.99, key: "t", after: 3 },
  { note: "G#", freq: 415.3, key: "y", after: 4 },
  { note: "A#", freq: 466.16, key: "u", after: 5 },
];

const KEY_WIDTH = 100 / WHITE.length;

type Floating = { id: number; left: number; note: string };

export function MiniKeyboard({ label }: { label: string }) {
  const [down, setDown] = useState<Set<string>>(new Set());
  const [floating, setFloating] = useState<Floating[]>([]);
  const nextId = useRef(0);

  const press = (id: string, freq: number, note: string, left: number) => {
    playKey(freq);
    setDown((s) => new Set(s).add(id));
    setTimeout(
      () =>
        setDown((s) => {
          const copy = new Set(s);
          copy.delete(id);
          return copy;
        }),
      160,
    );
    const fid = nextId.current++;
    setFloating((f) => [...f.slice(-6), { id: fid, left, note }]);
    setTimeout(() => setFloating((f) => f.filter((x) => x.id !== fid)), 1000);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.repeat || event.metaKey || event.ctrlKey) return;
    const k = event.key.toLowerCase();
    const w = WHITE.findIndex((x) => x.key === k);
    if (w >= 0) {
      press(`w${w}`, WHITE[w].freq, WHITE[w].note, (w + 0.5) * KEY_WIDTH);
      return;
    }
    const b = BLACK.findIndex((x) => x.key === k);
    if (b >= 0) press(`b${b}`, BLACK[b].freq, BLACK[b].note, (BLACK[b].after + 1) * KEY_WIDTH);
  };

  return (
    <div
      className="relative h-full touch-none select-none rounded-xl bg-[#1a1424] p-2 pt-5 outline-none focus-visible:ring-2 focus-visible:ring-accent"
      role="group"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* "tampa" do teclado com LEDs */}
      <div className="absolute inset-x-3 top-1.5 flex items-center justify-between" aria-hidden>
        <span className="font-mono text-[9px] tracking-[0.3em] text-accent/70">PV-61</span>
        <span className="flex gap-1">
          <span className="size-1.5 rounded-full bg-term shadow-[0_0_6px] shadow-term" />
          <span className="size-1.5 rounded-full bg-accent/60" />
        </span>
      </div>

      <div className="relative h-full">
        <div className="flex h-full gap-[2px]">
          {WHITE.map((w, i) => (
            <button
              key={`w${i}`}
              type="button"
              tabIndex={-1}
              aria-label={w.note}
              onPointerDown={() => press(`w${i}`, w.freq, w.note, (i + 0.5) * KEY_WIDTH)}
              onPointerEnter={(e) => e.buttons === 1 && press(`w${i}`, w.freq, w.note, (i + 0.5) * KEY_WIDTH)}
              className={`piano-white flex-1 rounded-b-md ${down.has(`w${i}`) ? "is-down" : ""}`}
            />
          ))}
        </div>
        {BLACK.map((b, i) => (
          <button
            key={`b${i}`}
            type="button"
            tabIndex={-1}
            aria-label={b.note}
            onPointerDown={() => press(`b${i}`, b.freq, b.note, (b.after + 1) * KEY_WIDTH)}
            onPointerEnter={(e) => e.buttons === 1 && press(`b${i}`, b.freq, b.note, (b.after + 1) * KEY_WIDTH)}
            style={{ left: `calc(${(b.after + 1) * KEY_WIDTH}% - ${KEY_WIDTH * 0.32}%)`, width: `${KEY_WIDTH * 0.64}%` }}
            className={`piano-black absolute top-0 h-[60%] rounded-b-md ${down.has(`b${i}`) ? "is-down" : ""}`}
          />
        ))}

        {floating.map((f) => (
          <span
            key={f.id}
            className="note-float pointer-events-none absolute bottom-[55%] font-mono text-sm font-bold text-accent"
            style={{ left: `${f.left}%` }}
            aria-hidden
          >
            ♪{f.note}
          </span>
        ))}
      </div>
    </div>
  );
}
