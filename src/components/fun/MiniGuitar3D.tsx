"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { pluck as playPluck } from "./audio";
import type { GuitarScene } from "./guitarScene";
import { MiniGuitar } from "./MiniGuitar";

const FREQS = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];

/**
 * Violão 3D (three.js). O three só é baixado quando o card chega perto da tela.
 * Sem WebGL, cai para o violão 2D.
 */
export function MiniGuitar3D({ label, loading }: { label: string; loading: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<GuitarScene | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let cancelled = false;

    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        try {
          const [THREE, { RoomEnvironment }, { createGuitarScene }] = await Promise.all([
            import("three"),
            import("three/examples/jsm/environments/RoomEnvironment.js"),
            import("./guitarScene"),
          ]);
          if (cancelled) return;
          sceneRef.current = createGuitarScene(THREE, RoomEnvironment, stage, (i) => playPluck(FREQS[i]));
          setStatus("ready");
        } catch (error) {
          console.warn("Violão 3D indisponível, usando a versão 2D.", error);
          if (!cancelled) setStatus("fallback");
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(stage);

    return () => {
      cancelled = true;
      io.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  const onKeyDown = (event: KeyboardEvent) => {
    const scene = sceneRef.current;
    if (!scene) return;
    const n = Number(event.key);
    if (n >= 1 && n <= 6) scene.pluck(n - 1);
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      FREQS.forEach((_, i) => setTimeout(() => scene.pluck(i), i * 35));
    }
  };

  if (status === "fallback") return <MiniGuitar label={label} />;

  return (
    <div
      className="guitar-glow relative h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
      role="group"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div ref={stageRef} className="absolute inset-0" />
      {status === "loading" && (
        <p className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted">
          <span className="text-term">$</span>&nbsp;{loading}
          <span className="caret" />
        </p>
      )}
    </div>
  );
}
